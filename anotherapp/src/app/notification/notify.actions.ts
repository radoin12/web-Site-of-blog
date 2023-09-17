import { createAction, props } from "@ngrx/store";



export type notificationTypeDatas={
    
  id: number,
  notification_id:number,
  isread: boolean,
  isdelete: boolean,
  userId: number,
  message: string,
  type: string,
  createdAt:Date|string ,
  userName:string,
  imageUser: string,
  postId: number
}
export type countNotifyType={
    id?: number,
    post_count: number,
    userId?: number
}


// action to display notification
export const loadNotification=createAction( `[notification page],
 loaded notification
`)

export const loadNotificationSuccess=createAction( `[notification page],
  notification loaded success
`,
props<{notification:notificationTypeDatas[]}>()
)
export const loadNotificationFailed=createAction( `[notification page],
  notification loaded Failed
`,
props<{error:string}>()
)

// action to display count notification
export const loadNotifycount=createAction(`[count notification],
 loaded count notification
`)
export const loadNotifycountSuccess=createAction(`[count notification],
  count loaded success
`,
props<{count:countNotifyType}>()
)
export const loadNotifycountFailed=createAction(`[count notification],
  count loaded failed
`,
props<{error:string}>()
)
export const updateCount = createAction(
    "[count notification Update Count",
    props<{ count: countNotifyType }>()
  );
  export const  notifyEventAdd=createAction('[notification page], load notification',
  
  props<{ data:notificationTypeDatas}>()
  )
  export const addNewComments = createAction(
    '[count notification] Add New notComment ',
    props<{ commentData: notificationTypeDatas}>()
  );
  // make notification readble
  export const loadNotificationReadbleLoad=createAction('[notification page] load up date notify read',
  props<{id:number}>()
  )
 export const  upDateNotifyReadble=createAction('[notification page] up date notify readble',
 props<{data:number}>()
 )
//  delete notification
export const loadDeleteNotification=createAction('[notification page] load delete notify' ,
props<{id:number}>()
)
export const successNotifyDelete=createAction('[notification page] success delete notify',
props<{id:number}>()
)