import { createAction, props } from "@ngrx/store";
import { commentType, typeCreateComment } from "../../type/comment.type";




            //  display comment
export const commentLoad=createAction('[comment page] comment loaded ',
props<{id:number}>()
)
export const commentLoadSuccess=createAction(' [comment page] comment loaded succefully ',
props<{content:commentType[]}>()
)
export const commentLoadError=createAction(' [comment page] comment loaded Failed ',
props<{error:string}>()
)
                // add comment
export const commentLoadedAdd=createAction('[comment page] comment add loaded  ',
props<{id:number;data:typeCreateComment}>()
)
export const commentAddSuccess=createAction(' [comment page] comment add succefully ',
props<{data:commentType}>()
)
export const commentAddError=createAction(' [comment page] comment add Failed ',
props<{error:string}>() 
 )   
             //  delete comment
 export const commentLoadDelete=createAction('[comment Remove] comment delete loaded  ',
 props<{id:number}>()
 )
 export const commentdeletecommentNow=createAction('[comment Remove] omment delete now succefully ',
 props<{id: number}>()
 )
 export const commentDeleteError=createAction('[comment Remove] comment delete Failed ',
 props<{error:string}>() 
  ) 

