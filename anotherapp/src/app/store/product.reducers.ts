import { createReducer, on } from '@ngrx/store';

import { addProduct,addProductsuccess,loadProductFailed, loadProductSuccess, loadProducts, removeProduct, removeProductsuccess, updateProduct, updateProductFailure, updateProductSuccess } from './product.actions';
import { InitialStateType, InitialStateTypeUser } from './product.state';
import { commentAddError, commentAddSuccess, commentDeleteError,  commentLoad, commentLoadDelete, commentLoadError, commentLoadSuccess, commentLoadedAdd, commentdeletecommentNow } from './user/action_comment/comment.actions';
import {  addNewComments, loadDeleteNotification, loadNotification, loadNotificationFailed, loadNotificationReadbleLoad, loadNotificationSuccess, loadNotifycount, loadNotifycountFailed, loadNotifycountSuccess, notifyEventAdd, successNotifyDelete, upDateNotifyReadble, updateCount } from '../notification/notify.actions';
import { count } from 'rxjs';




export interface CreatePosteTypes{
   id: number;
   img: string; 
   description: string; 
   title: string; 
   date: string; 
   cat: string; 
   userId: number; 
}
export interface createPostInput{
  img: string; 
  description: string; 
  title: string; 

  cat: string; 
}
export const initialState:InitialStateType = {
  data: [],
  user:[],
  comment:[],
  error:null ,
  status:false,
  notification:[{
    id: 0,
    notification_id:0,
    isread: false,
    isdelete: false,
    userId: 0,
    message: '',
    type: '',
    createdAt:'' ,
    userName:'',
    imageUser: '',
    postId: 0
  }],
  count:{
    id:0,
    post_count:0,
    userId:0
  }

};
export const initialState1:InitialStateTypeUser = {
 
  user:[],
  error:null ,
  status:false,
  statusProfile:false,
  getuser:{
    id:0 ,
  name: '',
  email: '',

  image:'',
  DateUser:'',
  post:[],
 
},
count:[]
}

export const productReducer = createReducer(
  initialState,

  on(loadProducts, (state) => ({
    ...state,status:true
  })),
  on(loadProductSuccess, (state, { products }) => ({
    ...state,
    data: products,
    status: false,
    error: null,
  })),
  on(addProduct,(state)=>({
    ...state,status:true
  })),
  on(addProductsuccess,(state,{content})=>({
       ...state,data:[...state.data,content],error:null,status:false
  })),
  on(loadProductFailed,(state,{error})=>({
    ...state,error:error,status:false
  })),
  on(removeProduct, state => ({
    ...state,
    status: true
  })),
  on(removeProductsuccess, (state, { id }) => (
     
    {
    
    ...state,
    data: state.data.filter(data => data.id !== id),
    status: false
    // You can remove the error property
  }
  
  )),
  on(updateProduct ,(state) => ({
    ...state,status:true
  
  })),
  on(updateProductSuccess, (state, { updatedProduct }) => (
   
    {
    ...state,
    data: state.data.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ),
    status:false,
    error:null
  })),
  on(updateProductFailure ,(state, { error }) => ({
    ...state,error:error,status:false
  
  })),
    // comment Module operations
    // **********load comment************

    on(commentLoad,(state)=>({
      ...state,status:true
    })),
    // comment loaded succefully
    
    on(commentLoadSuccess,(state,{content})=>({
      ...state,comment:content,

      status:false ,
      error:null
    })),
    //*********** * comment loaded Failed ****** *
    
    on(commentLoadError,(state,{error})=>({
      ...state,status:false,error:error
    })),

      // **********Add comment************

      on(commentLoadedAdd,(state)=>({
        ...state,status:true
      })),
      // comment loaded succefully
      
      on(commentAddSuccess,(state,{data})=>(
     
        {
        ...state,comment:[...state.comment,data],
        
        status:false ,
        error:null
      })),
      //*********** * comment loaded Failed ****** *
      
      on(commentAddError,(state,{error})=>({
        ...state,status:false,error:error
      })),
      // delete comment
        // **********load deletecomment************

        on(commentLoadDelete,(state,{id})=>(
  
               {
          ...state,status:true
        })),
        // comment loaded  delete succefully
        
        on(commentdeletecommentNow,(state,{id})=>(
       console.log(id,'reducer'),
          {
          ...state,comment:state.comment.filter((item)=>item.id!==id),
          status:false ,
          error:null
        })),
        //*********** * comment loaded Failed ****** *
        
        on(commentDeleteError,(state,{error})=>(
          console.log(error,'error from error'),
          {
          ...state,status:false,error:error
        })),
        // display notification
        on(loadNotification,(state)=>({
          ...state,status:true
        })),
        on(loadNotificationSuccess,(state,{notification})=>(
          
          {
           ...state,error:null,status:false,notification:notification
        })),
        on(loadNotificationFailed,(state,{error})=>({
          ...state,status:false,error:error
       })),
        //  display count notify
        on(loadNotifycount,(state)=>({
          ...state,status:true
        })),
        on(loadNotifycountSuccess,(state,{count})=>({
           ...state,error:null,status:false,count:count
        })),
        on(loadNotifycountFailed,(state,{error})=>({
          ...state,status:false,error:error
       })),
      //  updateCount
  
      on(updateCount, (state, { count }) => (
      
        {
        ...state,
        count
      })),
      // up liste notification add to state
      on(notifyEventAdd,(state)=>(
       
        {
        ...state,status:true
      })),
      on(addNewComments,(state,{commentData})=>{

      

  let updateNotificationByOrder = [...state.notification, commentData];
  updateNotificationByOrder.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
        return{
          ...state,
          status:false ,
          notification:updateNotificationByOrder
        }

      }),
      on(loadNotificationReadbleLoad,(state)=>({
        ...state,status:true
      })),
      on(upDateNotifyReadble,(state,{data})=>{
        let notify=state.notification.find((item)=>item.notification_id===data)
        let read=notify?.isread
        return{
          ...state,status:false,
          notification:state.notification.map((item)=>item.notification_id===data?{...item,isread:true}:item),
          count:{...state.count,post_count:!read&&state.count.post_count>0?state.count.post_count-1:state.count.post_count}
          
          
           }
      }
      
       ),
       on(loadDeleteNotification,(state)=>({
       ...state,status:true
       })),
       on(successNotifyDelete,(state,{id})=>{
      
        let notify=state.notification.find((item)=>item.notification_id===id)
        let readble=notify?.isread 
           console.log(readble,'readble')
        let upDatedNotify=state.notification.filter((item)=>item.notification_id!==id)
        console.log(upDatedNotify,'notify')
       
       return {
      ...state,status:false,notification:upDatedNotify
       }}
       )
      
)
     


  
