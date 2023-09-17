import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { CreatePosteType } from 'src/app/add/add.component';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';
import { notifyEventAdd } from 'src/app/notification/notify.actions';
import { ProductService } from 'src/app/product/product.service';
import { SocketIOService, typeNotification } from 'src/app/soketIo/socket-io.service';
import { addProduct, updateProduct } from 'src/app/store/product.actions';
import { seletcAll } from 'src/app/store/product.selector';
import { AppState } from 'src/app/store/product.state';


export type locationType={
    id:0,
    desc:string,
    cat:string,
    img:string,
    title:string
}

@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.css']
})
export class AddblogComponent  implements OnInit , OnDestroy{
  private subscription:Subscription=new Subscription
  formGroup:FormGroup
  inputTouchedCat:boolean=false
  inputTouchedTitle:boolean=false
  selected:boolean=false 
  changeImage:boolean=false
  load:boolean=false
  location:locationType={
    id:0,
    desc:"",
    cat:"",
    img:"",
    title:""
  }
  decodeUser:DecodeType=null
  inputTouchedDescription:boolean=false 
  dataProduct:CreatePosteType={
    title:"",
    description:"",
    cat:""
  }
  selectImage:any= null

radioOptions = [
  { value: 'art', label: 'article' },
  { value: 'technology', label: 'technology' },
  { value: 'design', label: 'design'},
  { value: 'Food', label: 'Food'},
  { value: 'cinema', label: 'cinema'},
  { value: 'science', label: 'science'},

]

   constructor(
   private  formBiulder:FormBuilder,
   private _snckbar:MatSnackBar,
   private productservice:ProductService,
   private router:Router ,
   private store:Store<AppState>,
   private activateRoute:ActivatedRoute,
   private serviceIo:SocketIOService,
   private localStorageService:LocalstorageService,

   ){
    this.activateRoute.queryParams.subscribe(
      query=>{
        if (query) {
          this.location=query as locationType 
          this.selectImage=this.location.img
        }
   

        console.log( Object.keys(this.location).length)
      }
     )
    
    this.formGroup=this.formBiulder.group({
      title:[`${this.location.title||''}`,[Validators.required,this.customErrorValidator]],
      description:[`${this.location.desc||''}`,[Validators.required,this.customErrorDef]],
      selectedOption:[`${this.location.cat||''}`,[Validators.required]],
    
    })
   }
  //  when touch to customer validator
  onBlurInput( data:string,name:string){
      const val=data 
       switch (name) {
        case 'title':
          if (!val) {
            this.inputTouchedTitle=false
          }
          break;
          case 'desc':
            if (!val) {
              this.inputTouchedDescription=false
            }
            break;
            case 'cat':
              if (!val) {
                this.inputTouchedCat=false
              }
              break;
       
        default:
          break;
       }
  }
  onFocusInput(name:string){
    switch (name) {
      case 'title':
        this.inputTouchedTitle=true
        break;
        case 'cat':
          this.inputTouchedCat=true
          break;
          case 'desc':
            this.inputTouchedDescription=true
            break;
    
      default:''
        break;
    }
  }
  // Custom validator for handling custom errors per radio option
  customErrorValidator(control: AbstractControl): ValidationErrors | null {
    const selectedOption = control.value;
    
    if (selectedOption.length>15) {
      return { customError: true };
    }
    
    return null;
  }
  // description validator length
  customErrorDef(control: AbstractControl): ValidationErrors | null {
    const selectedOption = control.value;
    
    if (selectedOption.length>250) {
      return { customErrordef: true };
    }
    
    return null;
  }
  //  on selectimage
    onselectImage(e:Event){
      const target=e.target as HTMLInputElement
      if (target.files&&target.files.length>0) {
         this.selectImage=target.files[0]
          this.changeImage=true
      }
    }
    // submit form product
     async onSubmit(){

     
      if (this.formGroup.valid&&this.selectImage) {
      try {
    
        this.dataProduct={
          title:this.formGroup.get('title')?.value,
          description:this.formGroup.get('description')?.value,
          cat:this.formGroup.get('selectedOption')?.value
        } 
          
        const formData=new FormData()
        formData.append('file',this.selectImage)
     this.router.navigate(['/product'])
        if (!this.changeImage&&Object.values(this.location).length>0) {
          const newImg=this.location.img.split('/')[2]
   
          const upDateData={...this.dataProduct,img:newImg}
        
          this.store.dispatch(updateProduct({updatedProduct:upDateData,id:this.location?.id}))
          const emitUpdateUser:any={
            userId:this.decodeUser?.id,
            postId:this.location?.id,
            message: `is changed the  blog for category ${this.formGroup.get('selectedOption')?.value} `,
            type:'UpdateProduct',
            userName:this.decodeUser?.name,
            imageUser:this.decodeUser?.img
           }
           this.serviceIo.getSocket().emit('eventBlog',emitUpdateUser)
           this.serviceIo.onUpdateProduct().subscribe((data)=>{
            const{id,...other}=data
            this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
          })
          return ;
        }
        this.productservice.uploadImage(formData).subscribe(
          res=>{
            const newData={...this.dataProduct,img:res['filename']}
           if (Object.values(this.location).length===0) {
            this.store.dispatch(addProduct({pro:newData}))
            const emitAddProduct:any={
              userId:this.decodeUser?.id,
              message: `is created new  blog about  ${this.formGroup.get('title')?.value} for category ${this.formGroup.get('selectedOption')?.value} `,
              type:'addProduct',
              userName:this.decodeUser?.name,
              imageUser:this.decodeUser?.img
             }
             
            this.serviceIo.getSocket().emit('eventBlog', emitAddProduct)
            this.serviceIo.onAddProduct().subscribe((data)=>{
              const{id,...other}=data
              this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
            })
            return ;
           }
           else{
            this.store.dispatch(updateProduct({updatedProduct:newData,id:this.location?.id}))
             

            const emitUpDateProduct:any={
              userId:this.decodeUser?.id,
              postId:this.location?.id,
              message: `is changed new Blog   for category ${this.formGroup.get('selectedOption')?.value} `,
              type:'UpDateProduct',
              userName:this.decodeUser?.name,
              imageUser:this.decodeUser?.img
             }
             
            
             this.serviceIo.getSocket().emit('UpDateProduct', emitUpDateProduct)
             this.serviceIo.onUpdateProduct().subscribe((data)=>{

              const{id,...other}=data
              this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
            })
           }
       
          
          },
          err=>{
            console.log(err)
          }
        )
      } catch (error) {
        console.log(error)
      }
        
      }
      else{
        this.selected=true 
        this.inputTouchedDescription=true
        this.inputTouchedCat=true 
        this.inputTouchedTitle=true
       this.submitedFailed()
      }
    }

    submitedFailed(){
      if (this.formGroup.get('category')?.hasError('required')) {
        this.matSnackBar('choose an option of category')
      }
      if (this.formGroup.get('description')?.hasError('required')) {
        this.matSnackBar('description  is required')
      }
      if (this.formGroup.get('title')?.hasError('required')) {
        this.matSnackBar('title is required')
      }
      if (this.formGroup.get('title')?.hasError('customError')) {
        this.matSnackBar(' title must be less than 10 caracters ')
      }
      if (!this.selectImage) {
        this.matSnackBar('choose your image')
      }
    }
    matSnackBar(name:string){
      this._snckbar.open(name,'cancel',{
        duration:2000 ,
        horizontalPosition:'center' ,
        verticalPosition:'top'
      })
    }
    ngOnDestroy(): void {
      this.subscription.unsubscribe()
    }
   ngOnInit(): void {
    this.subscription= this.store.select(seletcAll).subscribe(
      state=>{
        this.load=state.status
      }
     )  
    const user=this.localStorageService.getItem('userToken')?this.localStorageService.getItem('userToken'):null
    if (user) {
      this.decodeUser=jwtDecode(user)
    }
    }
}
