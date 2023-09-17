import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, UserInfo } from '../auth.service';
import { Router } from '@angular/router';
import { SocketIOService, typeNotification, typeNotificationuser } from '../soketIo/socket-io.service';
import { ProductService } from '../product/product.service';
import { Subscription, mergeMap, switchMap } from 'rxjs';
import { usersType } from '../store/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { notifyEventAdd } from '../notification/notify.actions';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {
    dataUser:UserInfo={
      name:'',
      email:'',
      password:''
    }
    image:any=''
    file:any=null
    error:string=''
    intouchedName:boolean=false
    intouchedEmail:boolean=false
    intouchedPassword:boolean=false
    subscribe$:Subscription=new Subscription()
    selected:boolean|null=null
    onselectImage(event:any){
     if (event.target&&event.target.files) {
       this.file=event.target.files[0]
       this.selected=true
     }
    }
    ngOnDestroy(): void {
      this.subscribe$.unsubscribe()
    }
    async getUser(){
      
      if (!this.file) {
        this.selected=false
        return;
       }
       if (!this.dataUser.name) {
        this.intouchedName=true
        return;
       }
       if (!this.dataUser.email) {
        this.intouchedEmail=true
        return;
       }
       if (this.error!=='') {
        this.intouchedEmail=true
       }
       if (!this.dataUser.password) {
        this.intouchedPassword=true
        return;
       }
       if (this.dataUser.password.length<6) {
        return ;
       }
       
  
       const formData=new FormData()
       formData.append('file',this.file)
      
       this.productService.uploadImage(formData).pipe(
      
          mergeMap((data)=>
         {
          this.image=data['filename']
          const userDataWithImage={...this.dataUser,image:data['filename']}
          
         
           
            return this.authservice.registerUser(userDataWithImage)
           

       
        
         }
       
            
            )
          
       )
       .subscribe(res=>{
        if ( typeof(res)!=="string") {
          
          const emitAddeUser:typeNotificationuser={
            userId:res.id,
         
            message: ` is created New Profile  `,
            type:'addUser',
            userName: this.dataUser.name,
            imageUser:this.image
           }
           this.ioService.getSocket().emit('eventUser',emitAddeUser)
            this.subscribe$=this.ioService.onAddUser().subscribe(data=>{
              console.log(data,'data notify')
            const{id,...other}=data
            this.store.dispatch(notifyEventAdd({data:{...other,notifiction_id:data.id}}))
           })
          this.dataUser={
            name:'',
            email:'',
            password:''
          }
          this.file=''
          this.intouchedEmail=false
           this.intouchedName=false
           this.intouchedPassword=false
          this.router.navigate(['/login'])
       }},
       (err)=>{
       this.error=err
       console.log(err)
       }       
       )}
    
   constructor(private authservice:AuthService,private router:Router,
    private ioService:SocketIOService,
      private productService:ProductService,
      private store:Store<AppState>
    ){
  
   }
  //  focus to input
  onfocusInput(name:string){
    switch (name) {
        case 'name':this.intouchedName=true
        
        break;
        case 'email':this.intouchedEmail=true
        
        break;
        case 'password':this.intouchedPassword=true
        
        break;
    
      default:
        break;
    }
  }
    //  onblurInput
    onBlur(name:string,val:string){
      switch (name) {
        case 'name':
          if (!val) {
            this.intouchedName=false
          }
          break;
          case 'email':
            if (!val) {
              this.intouchedEmail=false
            }
            break;
            case 'password':
              if (!val) {
                this.intouchedPassword=false
              }
              break;
      
        default:
          break;
      }
    }
  
ngOnInit():void{
   
}
}
