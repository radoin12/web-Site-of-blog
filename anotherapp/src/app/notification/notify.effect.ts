import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { NotifyService } from "./notify.service";
import { addNewComments, countNotifyType, loadDeleteNotification, loadNotification, loadNotificationFailed, loadNotificationReadbleLoad, loadNotificationSuccess, loadNotifycount, loadNotifycountFailed, loadNotifycountSuccess, notifyEventAdd, successNotifyDelete, upDateNotifyReadble, updateCount} from "./notify.actions";
import { catchError, map, mergeMap, of, switchMap, tap } from "rxjs";
import { SocketIOService } from "../soketIo/socket-io.service";

@Injectable()
export class notifyEffect{
   
     constructor(
        private notifyService:NotifyService ,
        private actions$:Actions,
        private websocket:SocketIOService
     ){}
   
     loadNotify$=createEffect(
        ()=>this.actions$.pipe(
            ofType(loadNotification),
            mergeMap(()=> 
             this.notifyService.getListNotification().pipe(
             
                map(res=>loadNotificationSuccess({notification:res})),
                catchError(error=>of(loadNotificationFailed({error:error})))
             )
            )
        )
        
        )
        loadCount$=createEffect(()=>
        this.actions$.pipe(
            ofType(loadNotifycount),
            switchMap(()=> 
            this.notifyService.getcountNotification().pipe(
                tap((data)=>{
                
                }),
                map(res=>loadNotifycountSuccess({count:res})),
                catchError(error=>of(loadNotifycountFailed({error})))
            )
            )
        )
        )
        updateCount$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateCount),
          switchMap(() => {
       
            return this.websocket.onupdateCount().pipe(
          
              map((count: countNotifyType) => {
                return updateCount({ count });
              })
            );
          })
        )
      );
      updateListeEvent$ = createEffect(() =>
      this.actions$.pipe(
        ofType(notifyEventAdd),
       
        map((action) => {
         
          // Dispatch the addNewComment action with the updated data
          return addNewComments({ commentData: action.data });
        }),
      )
     
    );
  

    // when user interect with notification to make readlbe
  loadUpadateNotifyRead$=createEffect(()=>
   this.actions$.pipe(
    ofType(loadNotificationReadbleLoad),
    tap((ac)=>{console.log(ac,"action")}),
    mergeMap((action)=> 
  
     this.notifyService.readbleNotification(action.id).pipe(
         tap((res)=>console.log(res,'response')),
      map(res=>upDateNotifyReadble({data:res}))
     )
    )

   )
  ) ;
  // delete notify
  
    loadDelete$=createEffect(()=>
    this.actions$.pipe(
      ofType(loadDeleteNotification),
      tap((t)=>{console.log(t,'effect')}),
      mergeMap((action)=>
   
       this.notifyService.deleteNotification(action.id).pipe(
  
        map(res=>successNotifyDelete({id:res}))
       )
      )
    )
    )

}


