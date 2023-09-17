import { Component,  OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminservService } from 'src/app/adminserv.service';
import { AuthService } from 'src/app/auth.service';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';
import { SideBar, SideBarType } from '../user/user.component';
import jwtDecode from 'jwt-decode';



import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/product.state';
import { countNotifyType, loadDeleteNotification, loadNotification, loadNotificationReadbleLoad, loadNotifycount, updateCount } from 'src/app/notification/notify.actions';
import { seletcAll } from 'src/app/store/product.selector';
import { ServiceUserService } from 'src/app/service-user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css']
 
})

export class NavAdminComponent  implements OnInit , OnDestroy{

  private subscriptionNotify:Subscription=new Subscription()
  MenuOpen:boolean = false; // Suivez l'état du menu
  DecodeUser:DecodeType|null=null
   getDates:(date:string|Date)=>string
  notifications: any[] = []; // Array to hold notifications

  notificationCount:countNotifyType={
    id:0,
    post_count:0,
    userId:0
  }; // Initialize notification count
 
  logout(){
    this.localService.removeItem('userToken')
    this.adminsev.setAdminStatus(false)
   
  this.auth.LogoutUser()

  .subscribe(
    res=>{},
    error=>{}
  )

  this.route.navigate(['/login'])
  }
  //  readble notification
  public readble:boolean=false
  readbleNotify(id:number){
     if (!this.readble) {
    
      this.store.dispatch(loadNotificationReadbleLoad({id}))
     
     }
  }
  constructor(
    private auth :AuthService,
   private  localService:LocalstorageService,
  private  route:Router,
  private adminsev:AdminservService ,

   private store:Store<AppState>,  
   private serviceUser:ServiceUserService,
  
 


    ){
      this.getDates=this.serviceUser.getDate.bind(this.serviceUser)
    }
    public sideBarData:SideBarType=SideBar||[]

    
    toggle(index:number){
      this.sideBarData[index].open=!this.sideBarData[index].open
      
     
    }
    // menu toggole delete notify
  
    notificationStates: boolean[] = [];
    toggleRightWorkspace(index: number) {
      this.notificationStates[index] = !this.notificationStates[index];
    
    }
   
  
    toggleMenus() {
     this.MenuOpen =  !this.MenuOpen 
     
    }

  
  
  
    openMenu() {
    
      this.MenuOpen=true
    }
    
    
   
   
   
     
    // delete notification
    deleteNotify(id:number){
        this.store.dispatch(loadDeleteNotification({id}))
    }
   

    ngOnInit(): void {
      
      this.store.dispatch(loadNotification());
      this.store.dispatch(loadNotifycount());
  
      this.store.dispatch(updateCount({count:{id:1,  post_count:0,userId:undefined}}))
      this.subscriptionNotify=this.store.select(seletcAll).subscribe((state) => {
        this.notifications = state.notification;
  
        this.notificationCount = state.count;
     
      });
      this.DecodeUser = this.localService.getItem('userToken') ? jwtDecode(this.localService.getItem('userToken') as string) : null;
    
    }
    ngOnDestroy(): void {
      this.subscriptionNotify.unsubscribe()
    }
}
