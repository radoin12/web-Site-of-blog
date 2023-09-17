import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { findUser, userWithPosts } from '../store/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { selectUserProfile, selectUsers } from '../store/product.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceUserService } from '../service-user.service';
import { DecodeType, LocalstorageService } from '../localstorage.service';
import jwtDecode from 'jwt-decode';
import { SocketIOService } from '../soketIo/socket-io.service';
import { notifyEventAdd } from '../notification/notify.actions';
import { commentLoadedAdd } from '../store/user/action_comment/comment.actions';
import { DarkService } from '../darkMode/dark.service';
declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{
  userProfile$:Observable<userWithPosts|null>
  id?:number|string|null=0
  load:boolean=false
  isSidebarVisible: boolean = false
  isButtonVisible: boolean =false // Affiche le bouton sur les écrans de largeur maximale à 700px
  dateComment:(createdAt:string|Date)=>string
  decode:DecodeType=null
  content:string='' 
  subParam:Subscription=new Subscription()
  darkSubscription$:Subscription=new Subscription()
  dark$:boolean=false
constructor(
  private store:Store<AppState>,
  private activateRoute:ActivatedRoute,
  private userService:ServiceUserService,
  private localStorage:LocalstorageService,
  private socketIo:SocketIOService ,
  private darkService:DarkService
){
  this.userProfile$=this.store.select(selectUserProfile)
  this.dateComment=this.userService.getDate.bind(this.userService)
}

  //  navigate to user profile


  // add comment
  addComment(cat:string,id:number,title:string){
    this.store.dispatch(commentLoadedAdd({id:id,data:{content:this.content}}))
   
     const notifyAddComment={
      userId:this.decode?.id,
      message:` is commented to  ${title} of ${cat} ${this.content.substring(0,13)} ...` ,
      postId:id,
      type:'AddComment'
      ,userName:this.decode?.name,
      imageUser:this.decode?.img
   
     }
     this.socketIo.getSocket().emit('commentEvent',notifyAddComment)
     this.socketIo.onCommentAdded().subscribe(data=>{
       const{id,...other}=data
       this.store.dispatch(notifyEventAdd({data:{...other, notification_id:data.id}}))
     })
     this.content=''
  }

  // Fonction pour afficher/masquer la barre latérale
 
  toggleSidebars() {
   
    this.isSidebarVisible=!this.isSidebarVisible
       
      // Utilisation de jQuery pour manipuler les styles CSS lorsque la barre latérale est visible
      if (this.isSidebarVisible) {
        console.log('Bouton cliqué false')
        $('.user-info-sidebar').css('transform', 'translateX(0)');
        $('.user-info-sidebar').css('width', '850px');
        console.log('rr')
       
    
      } else {
        console.log('Bouton cliqué true')
        $('.user-info-sidebar').css('transform', 'translateX(-350px)');
        $('.user-info-sidebar').css('width', '0');
      
      
      }
      
    
  }
  resize(){
    let timeout:any;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
 
  this.isSidebarVisible = window.innerWidth > 800;
 
  if (this.isSidebarVisible) {
    $('.user-info-sidebar').css('transform', 'translateX(0)');
    $('.user-info-sidebar').css('width', '250px');
   
  } else {
    $('.user-info-sidebar').css('transform', 'translateX(-350px)');
    $('.user-info-sidebar').css('width', '0px');

  }
  }, 100); // Délai de 100 ms
});

   
  }
  ngOnDestroy(): void {
    this.subParam.unsubscribe()
    this.darkSubscription$.unsubscribe()
  }
ngOnInit(): void {
   this.resize();
  this.subParam= this.activateRoute.params.subscribe((params) => {
    this.id = params['id'];
    console.log(this.id)
    // Dispatchez une action pour charger les données de l'utilisateur en fonction du nouvel ID
    if (this.id) {
      this.load=false
      this.store.dispatch(findUser({id:this.id}))
    }
  });
   this.store.select(selectUsers).subscribe((state)=>{
  this.load=state.statusProfile
   })
 
   
    const user=this.localStorage.getItem('userToken')?this.localStorage.getItem('userToken') as string:null
      
    if (user) {
      this.decode=jwtDecode(user)
    }

  this.darkSubscription$=this.darkService.isdark$.subscribe((dark)=>{
  this.dark$=dark
  })

  
}
}
