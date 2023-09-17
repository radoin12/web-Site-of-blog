import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { ProductService } from 'src/app/product/product.service';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/product.state';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { addUser, loadUser, updateUserLoad, usersType } from 'src/app/store/user/user.actions';
import { selectUsers } from 'src/app/store/product.selector';
import { SocketIOService, typeNotification, typeNotificationuser } from 'src/app/soketIo/socket-io.service';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';

import jwtDecode from 'jwt-decode';
import { notifyEventAdd } from 'src/app/notification/notify.actions';
import { Subscription } from 'rxjs';

export type userform={
  name:string ,
  email:string ,
  password:string
}
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css'],
 

})
export class AdduserComponent implements OnInit,OnDestroy {
  formGroup: FormGroup;
  private subscription:Subscription=new Subscription()
    user:userform={
      name:'',
      email:'',
      password:''
    }
    inputTouchedEmail:boolean=false
    inputTouchedName:boolean=false
    inputTouchedPassword:boolean=false
    errorMessage: string | null = null;
    load:boolean=false;
    usersData:usersType[]=[]
    emailExist:string|null=null ;
    changedImage:boolean=false
    locationUser:any=null
    selectedImage: any | null =  null;
     decodeUser:DecodeType=null
  
  constructor(private formBuilder: FormBuilder,
    private productService:ProductService,
    private _snackBar: MatSnackBar ,
    private store:Store<AppState>,
    private router:Router,
   private activateRoute:ActivatedRoute,
   private SocketIoService:SocketIOService,
   private localStorageService:LocalstorageService ,
  
   
    ) {
      this.activateRoute.queryParams.subscribe(params=>{
        this.locationUser=params 
        this.selectedImage=params['image']
      
      })

    this.formGroup = this.formBuilder.group({
      email: [this.locationUser?.email?`${this.locationUser?.email}`:'', [Validators.required, Validators.email,this.emailExistValidator()]],
    
     name: [this.locationUser?.name?`${this.locationUser?.name}`:'',[Validators.required]],
     password:['',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
   
  
  }


  onBlur(data: any, inputName: string): void {
  
   if (!data&&inputName==="name") {
     this.inputTouchedName=false
   }
   if (!data&&inputName==="email") {
    this.inputTouchedEmail=false
  }
  if (!data&&inputName==="password") {
    this.inputTouchedPassword=false
  }
  }
  onfocus(inputTouch:string):void{
    
    if (inputTouch==="name") {
      this.inputTouchedName=true
    }
    if (inputTouch==="email") {
      this.inputTouchedEmail=true
   
    }
    if (inputTouch==="password") {
      this.inputTouchedPassword=true
    }
   
   
  }
  
     
   emailExistValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) => {
    
     
      
     
      const userid= this.usersData.filter((item)=>item.id!==parseInt(this.locationUser.id)&&item.email === control.value)



      if(userid.length>0){
        this.emailExist='email is already exist'
      }
      else{
        this.emailExist=null 
      }
   
      
      
     
      return null;
    };
  }

    // invalid password 

    // invalidPassword(control: AbstractControl){
    //   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    //   if (control.value && !passwordPattern.test(control.value)) {
    //     return { invalidPassword: true };
    //   }
      
    //   return null;
    // }
  fileTypeValidator(allowedTypes: string[]) {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const fileType = file.type;
        if (!allowedTypes.includes(fileType)) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }
  onImageSelected(event: Event) {
   
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      this.changedImage=true
     
    }
  }
  // edit user
  editUser(){
    const emailChanged:Boolean=this.locationUser?.email!==this.formGroup.get('email')?false:true
    const nameChanged:Boolean=this.locationUser?.name!==this.formGroup.get('name')?false:true
    const emitUpdateUser:typeNotificationuser={
      userId:this.decodeUser?.id,
      message: emailChanged?`is changed the email of${this.formGroup.get('name')}`:nameChanged?`is changed the name of${this.locationUser?.name} to  ${this.formGroup.get('name')}`:this.changedImage?`is changed the photo of${this.formGroup.get('name')?.value}`:`is changed the profile of${this.locationUser?.name}`,
      type:'UpdateUser',
      userName:this.decodeUser?.name,
      imageUser:this.decodeUser?.img
     }
   
    this.formGroup.get('password')?.clearValidators();
    this.formGroup.get('password')?.updateValueAndValidity(); // Update validation status

    this.formGroup.get('password')?.setValue(''); // Set an empty value
    
     if(this.formGroup.valid&&this.selectedImage&&this.emailExist===null){
      const title=this.formGroup.get('name')?.value
      const emailCompte=this.formGroup.get('email')?.value
   if (!this.changedImage) {
   console.log(this.locationUser.id,'id loca')
     const upadateUser={name:title ,email: emailCompte,image:this.selectedImage}
     this.store.dispatch(updateUserLoad({content:upadateUser,id:this.locationUser.id}))
    
   
    
    }
    else{
     const formData=new FormData()
     formData.append('file',this.selectedImage)
 
     this.productService.uploadImage(formData).subscribe(
       res=>{
         const data={name:title,email:emailCompte,image:res['filename']}
         console.log(this.locationUser.id,'id user')
         this.store.dispatch(updateUserLoad({content:data,id:this.locationUser.id}))
       
       
       },
       err=>{
         console.log(err)
       }
     )
     
   
    
         }
         this.SocketIoService.getSocket().emit('eventUser',emitUpdateUser)
     
         this.SocketIoService.onUpdateUser().subscribe((data)=>{
    
        const{id,...other}=data
        this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
        })
    
           
         this.router.navigate(['/user'])
 
 }
 


  }
  // click butoon to add user
   addUser(){
    const formData=new FormData()
    formData.append('file',this.selectedImage)
    this.user={
      name:this.formGroup.get('name')?.value||'',
      email:this.formGroup.get('email')?.value||'',
      password:this.formGroup.get('password')?.value||'',
    }
    
   
    this.productService.uploadImage(formData).subscribe(
      res=>{
        const data={...this.user,image:res['filename']}
        this.store.dispatch(addUser({content:data}))
        this.router.navigate(['/user'])
       
      }
    )
    const emitAddeUser:typeNotificationuser={
      userId:this.decodeUser?.id,
      message: ` is created New Profile for ${this.formGroup.get('name')?.value} `,
      type:'addUser',
      userName:this.decodeUser?.name,
      imageUser:this.decodeUser?.img
     }
     this.SocketIoService.getSocket().emit('eventUser',emitAddeUser)
      this.SocketIoService.onAddUser().subscribe((data)=>{

       const{id,...other}=data
        this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
      })
    
   }
  async onSubmit(){
 try {
 
  if (Object.values(this.locationUser).length>0){
 
    this.editUser()
  }   

  if (this.formGroup.valid&&this.selectedImage&&this.emailExist===null) {
     
    this._snackBar.open('Form submitted successfully!', 'Dismiss', {
      duration: 5000,
    });
 
    if(Object.values(this.locationUser).length===0){
     
     this.addUser()
    }
    
   
  
  }
  else{
    
    this.handleValidationErrors()
    this.inputTouchedEmail=true 
    this.inputTouchedName=true 
    this.inputTouchedPassword=true
  

}


 } catch (error) {
  this.handleSubmissionError(error);
 }



   
      
    
   
    
  }
  private handleValidationErrors() {
    this.errorMessage = 'Failed to submit the form. Check your information for each field.';
  
    if (this.formGroup.get('name')?.hasError('required')) {
      this.showSnackBar('name is required !');
    }
  
    if (!this.selectedImage) {
      this.showSnackBar('select your image !');
    }
  
    if (this.formGroup.get('email')?.hasError('required')) {
      this.showSnackBar('email is required !');
    }
  
    if (this.formGroup.get('password')?.hasError('required')) {
      this.showSnackBar('password is required !');
    }
  
    if (this.formGroup.get('password')?.hasError('pattern')) {
      this.showSnackBar('invalid password');
    }
  }


  private showSnackBar(message: string) {
  this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  

  private handleSubmissionError(error: any) {
    console.error(error); // Log the error for debugging
    const errorMessage = 'An error occurred while submitting the form.';
    this._snackBar.open(errorMessage, 'Cancel', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  
ngOnDestroy(): void {
  this.subscription.unsubscribe()
}
  ngOnInit(): void {
    this.store.dispatch(loadUser({name:''}))
   this.subscription= this.store.select(selectUsers).subscribe(
      state=>{
        this.load=state.status
     
          this.emailExist=state.error
          this.usersData=state.user
        
         
       
     
      }
     )
     const user=this.localStorageService.getItem('userToken')?this.localStorageService.getItem('userToken')as string:null
     if (user) {
      this.decodeUser=jwtDecode(user)
     }
}
}
