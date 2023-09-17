import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';
import jwtDecode from 'jwt-decode';
import { ProductService } from 'src/app/product/product.service';

import { seletcAll } from 'src/app/store/product.selector';
import { AppState } from 'src/app/store/product.state';
import { commentType } from 'src/app/store/type/comment.type';
import { commentLoadDelete } from 'src/app/store/user/action_comment/comment.actions';
import { SocketIOService } from 'src/app/soketIo/socket-io.service';
import { notifyEventAdd } from 'src/app/notification/notify.actions';
import { Observable, Subscription } from 'rxjs';
import { DarkService } from 'src/app/darkMode/dark.service';

@Component({
  selector: 'comment-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent  implements OnInit,OnDestroy{
  @Input() idProduct?:number
  comments:commentType[]=[] 
  dark$:Observable<boolean>
  getDate:(test:string)=>string
  decode:DecodeType|null=null 
  subComment:Subscription=new Subscription()
constructor(
  private store:Store<AppState>,
  private serviceUser:ProductService,
  private localstorage:LocalstorageService,
  private socketService:SocketIOService ,
  private darkServ:DarkService
){
  this.getDate=this.serviceUser.calculateRelativeTime.bind(this.serviceUser) 
  this.dark$=this.darkServ.isdark$
}

 deleteComment(idcoment:number,item:any){
  console.log(idcoment,'id from component')
  const DataCommentDelete={
    userId:this.decode?.id,
    postId: this.idProduct,
   
    message:'is deleted comment',
    type:'DeleteComment',
    userName:this.decode?.name,
     imageUser:this.decode?.img
   }
   this.socketService.getSocket().emit('commentEvent',DataCommentDelete)
  
   this.socketService.onRemoveComment().subscribe(data=>{
  
   const{id,...other}=data
  
   
   this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}))
   })
   this.store.dispatch(commentLoadDelete({id:idcoment}))

  
 }
 ngOnDestroy(): void {
   this.subComment.unsubscribe()
 }
ngOnInit(): void {
const user=this.localstorage.getItem('userToken')?this.localstorage.getItem('userToken'):null
  if (user) {
    this.decode=jwtDecode(user)
  }
  console.log(this.decode?.img,'img')
  // user_id
this.subComment=this.store.select(seletcAll).subscribe(
    state=>{
  
   this.comments=state.comment

      
    }
  ) 

}

}
