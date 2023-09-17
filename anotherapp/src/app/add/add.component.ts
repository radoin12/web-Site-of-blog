import { ChangeDetectorRef, Component, OnChanges } from '@angular/core';
import { GameSourceType, ReduxService } from '../redux.service';
import { ProductService } from '../product/product.service';
import { Observable, mergeMap, of, switchMap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { addProduct, updateProduct} from '../store/product.actions';
import { SocketIOService,  typeNotificationuser } from '../soketIo/socket-io.service';
import { DecodeType, LocalstorageService } from '../localstorage.service';
import jwtDecode from 'jwt-decode';
import { notifyEventAdd } from '../notification/notify.actions';
import { DarkService } from '../darkMode/dark.service';

 export interface CreatePosteType{
  title:string ,
  description:string ,
  cat:string
}
export interface CreatePosteTypepayload{
  title:string ,
  description:string ,
  cat:string,
  img:string
}


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
constructor(private productservice:ProductService,
 private router:Router,
 private active:ActivatedRoute,
 private store:Store<AppState>,
 private socketIo:SocketIOService,
 private localStorage:LocalstorageService,
 private darkServ:DarkService


 ){
  this.router.events.subscribe((event)=>{
    if (event instanceof NavigationEnd) {
      this.getIdUser()
    }
  })
  this.dark$=this.darkServ.isdark$
 }

download:any=null 
upimg:any=null
load:boolean|null=false
location:boolean=false 
ischanged:boolean=false
file:any=null 
id:number=0
errorTitle:boolean=false
errorCat:boolean=false
errorDesc:boolean=false
decode:DecodeType=null 
dark$:Observable<boolean>
printFileName(){
   this.file="rad"
}
getIdUser(){
  const user =this.localStorage.getItem('userToken')?this.localStorage.getItem('userToken') as string: null 
  if(user) {
    this.decode=jwtDecode(user)
  }
}
getParam(){
  this.active.queryParams.subscribe((
    param=>{
    
  if (param['cat']) {
    this.location=true
    this.DataEventProduct.cat=param['cat']
    this.DataEventProduct.title=param['title']
    this.DataEventProduct.description=param['description']
    this.file=param['img']
    this.id=param['id']
  
  }
    }
  ))
}
DataEventProduct:CreatePosteType={
  title: '',
  description:'',
  cat:''
}
  
HandlChangeImg(e:any){


  this.file=e.target.files[0]
  this.ischanged=true


}



async editHandler(){

  const emitUpdateProduct:any={
    userId:this.decode?.id,
    postId:this.id,
    message: `is  updated   blog for category ${this.DataEventProduct.cat} `,
    type:'UpdateProduct',
    userName:this.decode?.name,
    imageUser:this.decode?.img
   }
  if (this.ischanged===false) {
    this.download={...this.DataEventProduct,img:this.file}  
    console.log(this.id,"id down")
   this.store.dispatch(updateProduct({updatedProduct:this.download,id:this.id}))
 
   
  this.socketIo.getSocket().emit('eventBlog', emitUpdateProduct)
  this.socketIo.onUpdateProduct().subscribe((data)=>{
    const{id,...other}=data
    this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
  })
  this.router.navigate(['/home',{cat:''}])
  return ;
 
    
  }
  else {
    const formData = new FormData();
  formData.append('file', this.file);
 

   this.productservice.uploadImage(formData).pipe(mergeMap(
    res=>{
    
      this.download={...this.DataEventProduct,img:res['filename']} 
        
      this.store.dispatch(updateProduct({updatedProduct:this.download,id:this.id}))
      this.socketIo.getSocket().emit('eventBlog', emitUpdateProduct)
      this.socketIo.onUpdateProduct().subscribe((data)=>{
        const{id,...other}=data
     
        this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
      })
          return res['filename']
        
      
    }
   ))
   .subscribe(
    
    res=>{
     
   
     
        this.router.navigate(['/home',{cat:''}])
      
    },
    err=>{
   
      console.log(err)
    }
   )
 

 
  }

}

async clickHandler  (){
  console.log('step one')
  if (!this.file) {
    return ;
  }
  if (!this.DataEventProduct.title) {
    console.log('step two')
    this.errorTitle=true 
    return ;
  }
  if (!this.DataEventProduct.description) {
    this.errorDesc=true 
    return ;
  }
  if (this.DataEventProduct.description.length>400) {
    this.errorDesc=true 
    return ;
  }
  if (!this.DataEventProduct.cat) {
    this.errorCat=true 
    return ;
  }
  const formData = new FormData();
  formData.append('file', this.file);
  

   this.productservice.uploadImage(formData).pipe(mergeMap(
    res=>{
   
      this.download={...this.DataEventProduct,img:res['filename']} 
        console.log(this.decode?.id,'id user')
      const emitAddProduct:typeNotificationuser={
        userId:this.decode?.id,
        message: `is  Add new  blog for category ${this.download.cat} `,
        type:'addProduct',
        userName:this.decode?.name,
        imageUser:this.decode?.img
       }
       
      this.store.dispatch(addProduct({pro:this.download}))
       this.socketIo.getSocket().emit('eventBlog',emitAddProduct) 
       this.socketIo.onAddProduct().subscribe((data)=>{
        const{id,...other}=data
       this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
       }) 
    return of(res['filename'])
      
    }
   ))
   .subscribe(
    
    res=>{
     
      this.errorCat=false
      this.errorDesc=false
      this.errorTitle=false
      this.ischanged=true
        this.router.navigate(['/home',{cat:''}])
      
    },
    err=>{
   
      console.log(err)
    }
   )
 

 


}





ngOnInit ():void{
  
this.getParam()

this.getIdUser()
  

}
}
