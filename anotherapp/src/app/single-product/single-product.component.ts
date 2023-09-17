import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductService, SingleProductJoinUserType } from '../product/product.service';
import { DecodeType, LocalstorageService } from '../localstorage.service';
import jwtDecode from 'jwt-decode';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { removeProduct } from '../store/product.actions';

import { commentType } from '../store/type/comment.type';

import { commentAddSuccess, commentLoad, commentLoadedAdd } from '../store/user/action_comment/comment.actions';
import { SocketIOService } from '../soketIo/socket-io.service';
import { notifyEventAdd } from '../notification/notify.actions';
import { Observable } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';
 declare var $:any
@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit, AfterViewInit{
  id:any=0
  singlePost:SingleProductJoinUserType|null=null
  userId:number=0
  loading:boolean=false
  desc:string=''
  dark$:Observable<boolean>
   inputTouched:boolean=false
  decodeUser:DecodeType={
    id: 0,
    name:"",
    img:'',
    email: "",
    isAdmin: false
  }
 constructor(private router:ActivatedRoute,
  private servicepro:ProductService,
  private localService:LocalstorageService,
  private routerNav:Router,
 private  activateRoute:ActivatedRoute,
  private store:Store<AppState>,
  private servIo:SocketIOService ,
  private darkService:DarkService
  ){
    this.dark$=this.darkService.isdark$
  }
  comments:commentType[]=[]
 calculateTime=this.servicepro.calculateRelativeTime.bind(this.servicepro)
 
 async findOne(id:number){
 try {

  this.servicepro.getOneProduct(id)
  .subscribe(
    resp=>{
   
      this.singlePost=resp

     
    },
    err=>{
      console.log(err)
    }
  )
 } catch (error) {
  console.log(error)
 }
 }
 
 deleteProduct(title?:string,cat?:string){

  const deleteBlog={
    userId:this.decodeUser?.id,
    postId: this.id
    ,message:`is deleted blog ${title} of category ${cat}`
    ,type:'removeBlog'
    ,userName:this.decodeUser?.name,
    imageUser:this.decodeUser?.img
   }
  this.servIo.getSocket().emit('eventBlog',deleteBlog)
  this.servIo.onRemovePro().subscribe(data=>{
    const{id,...other}=data
    this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
  })
 
  this.store.dispatch(removeProduct({id:this.id}))

 }
//  add comment
  // focus
  onFocus(){
    this.inputTouched=true
    
  }
  // blur
  onBlur(){
    if (!this.desc) {

      this.inputTouched=false
      console.log(this.inputTouched)
    }
  }
 AddComment(){

   const AddCommentToNotify={
    userId:this.decodeUser?.id,
    postId: this.id,
    message:`is  comment about the ${this.singlePost?.title} of category ${this.singlePost?.cat}`,
    type:'AddComment',
    userName:this.decodeUser?.name,
     imageUser:this.decodeUser?.img
   }
 if(this.desc!==''){
   this.store.dispatch(commentLoadedAdd({id:this.id,data:{content:this.desc}}))
   this.servIo.getSocket().emit('commentEvent',AddCommentToNotify)
   this.servIo.onCommentAdded().subscribe((data)=>{
    const{id,...other}=data
    console.log(other)
     this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
   })
   
   this.desc=''
   this.inputTouched=false
   

 }
  else{
    this.inputTouched=true
 
  }
 
 

 }
 ngAfterViewInit(): void {
   
 }
 ngOnInit(): void {
this.activateRoute.params.subscribe((params)=>{
   this.id=params['id']
  
   this.findOne(this.id)
  })

 
  this.store.dispatch(commentLoad({id:this.id}))

  this.router.queryParams.subscribe(
    params=>{
  this.userId=parseInt(params['userId'])
      
    }
  )
  const user:any=this.localService?.getItem('userToken')?this.localService.getItem('userToken')as string:null
 if (user) {
  this.decodeUser=jwtDecode(user)
 }


  //  this.router.params.subscribe(
  //   params=>{
  //     this.id=params['id']
  //   }
     
  //  )

 
 }
}
