import { createReducer, on } from "@ngrx/store";
import {  initialState1 } from "../product.reducers";
import { addUser, addUserFailed, addUsersuccess, countErrorLoad, countLoad, countLoadSuccess, findUser, finduserWithFailed, finduserWithSuccess, loadUser, loadUserSuccess, removeUser, removeUsersuccess, updateUserLoad, updateUserLoadfailed, updateUserLoadsuccess } from "./user.actions";
import { commentAddSuccess, commentLoadSuccess, commentLoadedAdd } from "./action_comment/comment.actions";


export const userReducer=createReducer(
    initialState1,

    on(loadUser,(state)=>({
        ...state,status:true
    })),
    on(loadUserSuccess,(state,{Users})=>({
        ...state,user:Users,error:null,status:false
    })),
    on(addUser,(state)=>({
      ...state,status:true
     })),
    on(addUsersuccess,(state,{content})=>(
  
      {
        ...state,user:[...state.user,content],error:null,status:false
       })),
       on(addUserFailed,(state,{error})=>({
        ...state,error:error.message,status:false
       })),


      //  Remove user
       on(removeUser,(state)=>({
        ...state,status:true
       })),
       on(removeUsersuccess,(state,{id})=>({
       ...state,user:state.user.filter((user)=>user.id!==id),
        status:false
       })),
         // up date the state of count 
  on(countLoad,(state)=>({
    ...state,status:true
  })),
  on(countLoadSuccess,(state,{content})=>({
    ...state,count:content,
    error:null,
    status:false
  })),
  on(countErrorLoad,(state,{error})=>({
    ...state,error:error ,
    status:false
  })),
  on(findUser,(state)=>({
    ...state,statusProfile:true
  })),
  on(finduserWithSuccess,(state,{user})=>({
    ...state,getuser:user,statusProfile:false,error:null
  })),
  on(finduserWithFailed,(state,{error})=>({
    ...state, statusProfile:false,error:error
  })),
  on(updateUserLoad,(state)=>({
  ...state,status:true
  })),
  on(updateUserLoadsuccess,(state,{content})=>({
    ...state,user:state.user.map((item)=>item.id===content.id?content:item)
    })),
    on(updateUserLoadfailed,(state,{error})=>({
      ...state,error:error
      
      })),
      // comment added
      // on(commentLoadedAdd,(state)=>({
      //   ...state, status:true
      // })),
      on(commentAddSuccess, (state, { data }) => (
       
        {
        ...state,
      
        getuser: {
          ...state.getuser,
          post: (state.getuser?.post ).map((post) => {
            console.log(typeof(data.blogId),typeof(post.id))
            if (post.id===parseInt(data.blogId)) {
         
              // Si c'est le premier post, ajoutez le commentaire au tableau des commentaires
              const updatedComment = {
                blogId: data.blogId,
                content: data.comments_content,
                createdAt: data.createdAt_comment,
                id: data.id,
                userId: data.user_id,
                image: data.user_image,
                name: data.user_name,
              };
            
              return {
              
                ...post,
                comment: [...post.comment , updatedComment],
              };
            }
            return post;
          }),
        },
      }))
      
      
)
