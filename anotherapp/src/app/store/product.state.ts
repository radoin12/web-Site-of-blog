import { countNotifyType, notificationTypeDatas } from '../notification/notify.actions';
import { ProductBlogType } from '../product/product.service';
import { commentType } from './type/comment.type';


import { userWithPosts, usersType } from './user/user.actions';

export interface InitialStateType {
  data: ProductBlogType[] ,
  user:usersType[],
  comment:commentType[]
  error:string |null,
  status:boolean,
  notification:notificationTypeDatas[],
  count:countNotifyType
 
}
export interface InitialStateTypeUser {
 
  user:usersType[],
  error:string |null,
  status:boolean,
  statusProfile:boolean ,
  getuser:userWithPosts,
  count:any
}
export type  AppState={
   product:InitialStateType,
   user:InitialStateTypeUser

}