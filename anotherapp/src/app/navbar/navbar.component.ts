import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DecodeType, LocalstorageService } from '../localstorage.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';

import jwtDecode from 'jwt-decode';
import { AdminservService } from '../adminserv.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { notifyState, selectUsers, seletcAll } from '../store/product.selector';
import { countNotifyType, loadDeleteNotification, loadNotification, loadNotificationReadbleLoad, loadNotifycount, notificationTypeDatas, updateCount } from '../notification/notify.actions';
import { ServiceUserService } from '../service-user.service';
import { loadUser, usersType } from '../store/user/user.actions';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';

declare var $:any

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,AfterViewInit,OnDestroy {

    id:number|null=null
    name:string=''  
    isdark$:Observable<boolean>
    notification: Observable<notificationTypeDatas[]>
    count:countNotifyType={
      id: 0,
      post_count: 0,
      userId: undefined
    }
    
    usersList:usersType[]=[]
    search:string=''
    loading:boolean=false  
    listeIsopen:boolean=true
    subscriptionListUser:Subscription=new Subscription()
    subscriptionCount:Subscription=new Subscription()
   getDate:(date:string|Date)=>string
  
  
  Token(){
     
        const decode:DecodeType|null=this.localService.getItem('userToken')?jwtDecode(this.localService.getItem('userToken')):null
     
        if (decode&&decode?.id) {
           this.id=decode?.id
           this.name=decode?.name 
           this.store.dispatch(loadNotification())
           this.store.dispatch(loadNotifycount())
           this.store.dispatch(updateCount({count:{id:1,  post_count:0,userId:undefined}})) 
       }
       else{
        this.id=null
       }
    
      
      
    
  
  }


  constructor(private localService:LocalstorageService,
    private route:Router,
    private authservice:AuthService,
  
    private store:Store<AppState>,
    private serviceUser:ServiceUserService,
    private elementRef:ElementRef ,
    private darkModeService:DarkService

  
  
    ){
      this.route.events.subscribe((event)=>{
        if (event instanceof NavigationEnd) {
          this.Token()
        }
      })
  this.getDate=this.serviceUser.getDate.bind(this.serviceUser)
  this.notification=this.store.select(notifyState) 
  this.isdark$=this.darkModeService.isdark$
    } 
 
   ToglleDark(){
    this.darkModeService.setData()
    this.isdark$.subscribe(test=>{
      console.log(test)
    })
   }


  
private userTokenKey = 'userToken'; 
  public readble:boolean=false
         // readbleNotification
         readbleNotify(id:number){
         
         
        
           this.store.dispatch(loadNotificationReadbleLoad({id}))
            this.readble=true
    
        
         }
         closeSearchList() {
          // Fermez la liste de recherche en mettant à jour une variable booléenne.
          this.listeIsopen = false;
        }

Logout(){
  this.localService.removeItem(this.userTokenKey)
  
  this.authservice.LogoutUser()
  .subscribe(
    res=>{},
    error=>{}
  )

  this.route.navigate(['/login'])



}
// delete notification
deleteNotify(id:number){
   this.store.dispatch(loadDeleteNotification({id}))
 
}

// style navbar
isVisble:boolean=false
resize(){
  window.addEventListener('resizes', () => {
    // Mettez à jour la visibilité de la barre latérale lorsque la taille de l'écran change
    this.isVisble = window.innerWidth > 301;
    // Utilisez jQuery pour ajuster les styles CSS si nécessaire
    if (this.isVisble) {
      $('.navbar').css('transform','translateX(0)')
      $('.navbar').css('width','100%')
     
    } 
  });
}

// search user

ngAfterViewInit(): void {
  $('#toggleSidebarNav').click(()=>{
  
  this.toggleSidebar()
  })
}

toggleSidebar(){
  this.isVisble=!this.isVisble 
  if(this.isVisble===true){
  $('.navbar').css('transform','translateX(0)')
  $('.navbar').css('width','100%')
 

  }
  else{
   
      $('.navbar').css('transform','translateX(-150px)')
      $('.navbar').css('width','0')
 
 

      
  }
}

onSearch(){
  const searchTerm = this.search.trim();
  this.store.dispatch(loadUser({name:searchTerm}))
  this.listeIsopen=true
}
navigateToReference(type:string,postId:number,userId:number,id:number):any{

    if(type==='AddComment'){
    
      return this.route.navigate(['/single',postId])
      }
     else if(type==='DeleteComment'){
        return this.route.navigate(['/single',postId])
      }
     else if (type==='UpdateProduct') {
      return this.route.navigate(['/single',postId]) 
      }
      else {
     this.route.navigate(['/profile',userId])
      } 
  
 
}
@HostListener('document:click', ['$event'])
onclick(event: MouseEvent): void {
  if (!this.elementRef.nativeElement.contains(event.target)) {
    // Le clic s'est produit en dehors du composant.
    this.closeSearchList();
  }
}
ngOnDestroy(): void {
  this.subscriptionListUser.unsubscribe()
  this.subscriptionCount.unsubscribe()
  
}
ngOnInit():void{

this.resize()

this.Token()


 this.subscriptionCount=this.store.select(seletcAll).subscribe((state)=>{
 

  this.count=state.count
 
 
 
 

 
})
  
 this.subscriptionListUser= this.store.select(selectUsers).subscribe((state)=>{
  this.usersList=state.user
 

})



 

  
}
}
