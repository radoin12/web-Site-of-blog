import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';
import { seletcAll } from 'src/app/store/product.selector';
import { AppState } from 'src/app/store/product.state';
import { commentType } from 'src/app/store/type/comment.type';
import { commentLoad, commentLoadDelete, commentLoadedAdd } from 'src/app/store/user/action_comment/comment.actions';
import jwtDecode from 'jwt-decode';
import { SocketIOService } from 'src/app/soketIo/socket-io.service';
import { notifyEventAdd } from 'src/app/notification/notify.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit, OnDestroy{
  commentContent:commentType[]=[]
  descComment:string=''
  inputTouched:boolean=false
  decodeUser:DecodeType|null=null
  private subscription:Subscription=new Subscription()
  constructor(@Inject(MAT_DIALOG_DATA)public product:any,
  private store:Store<AppState>,
  private localService:LocalstorageService,
  private socketService:SocketIOService

  ){}
  async displaycomment(){
    try {
     setTimeout(()=>{
      this.store.dispatch(commentLoad({ id: this.product.blog.id }));
     })
    } catch (error) {
      console.log(error)
    }
    }
    // add icon
    async AddComment(){
       try {
        if (this.descComment!=='') {
          this.store.dispatch(commentLoadedAdd({id:this.product.blog.id,data:{content:this.descComment}}))
          this.inputTouched=false
         const DataComment={
          userId:this.decodeUser?.id,
          postId: this.product.blog.id
          ,message:`is comment about   ${this.product.blog.title} of ${this.product.blog.cat}`
          ,type:'AddComment'
          ,userName:this.decodeUser?.name,
          imageUser:this.decodeUser?.img
         }
          this.socketService.getSocket().emit('commentEvent',DataComment)
          this.socketService.getSocket().on('emitCommentAdd',data=>{
            const{id,...other}=data
         this.store.dispatch(notifyEventAdd({data:{...other, notification_id:data.id}}))
          })
       
        
       
         
          this.descComment=''
        }
        else{
       
          this.inputTouched=true
         }
     
       } catch (error) {
        console.log(error)
       }
    }
    // delete comment
   async  deleteComment(id:number,content:string){
  try {
    
    const DataCommentDelete={
      userId:this.decodeUser?.id,
      postId: this.product.blog.id
      ,message:'is Delete comment'
      ,type:'DeleteComment'
      ,userName:this.decodeUser?.name,
      imageUser:this.decodeUser?.img
     }
    this.socketService.getSocket().emit('commentEvent',DataCommentDelete)
  
    this.socketService.onRemoveComment().subscribe(data=>{
      console.log(data,'data')
      this.store.dispatch(notifyEventAdd({data}))
    })
     
     
    this.store.dispatch(commentLoadDelete({id:id}))
  } catch (error) {
    console.log(error)
  }
    }
    // // onfocus comment
    onFocusComment(){
      this.inputTouched=true
    }
    // onblur add comment
    onBlurComment(){
      if (!this.descComment) {
        this.inputTouched=false
      }
    }
    ngOnDestroy(): void {
      this.subscription.unsubscribe()
    }
  ngOnInit(): void {
 // Dispatch the action outside of the initial change detection cycle
  this.displaycomment()

this.subscription=this.store.select(seletcAll).subscribe(
  state=>{
    this.commentContent=state.comment
    console.log(state.comment ,"comment detail")
   
  }
 )
 const user=this.localService.getItem('userToken')?this.localService.getItem('userToken'):null
  if (user) {
    this.decodeUser=jwtDecode(user)
  }
}

   
  }

