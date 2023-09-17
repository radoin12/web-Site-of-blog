import { createAction, props } from "@ngrx/store"
import {  typeCreatuser1, typeedituser } from "../product.actions"


export type usersType={
    id:number ,
    name: string,
    email: string,
  
    image:string,
    DateUser:string
}
export type userWithPosts={
  id:number ,
  name: string,
  email: string,

  image:string,
  DateUser:string,
  post:{
    id: number;
    comment:{
      blogId:number,
      content:string
     createdAt:Date|string,
     id:number,
     userId:number ,
     image:string ,
     name:string

    }[],
    img: string;
    description: string;
    title: string;
    date: string;
    cat: string;
    userId: number;}[]
}



export const addUser=createAction(
    '[User page] Add user',
    props<{content:typeCreatuser1}>()
  )
  export const addUsersuccess=createAction(
    '[User page] Add user  successfully',
    props<{content:usersType}>()
  )
  export const addUserFailed=createAction(
    '[User page] Add user failed',
    props<{error:{message:string}}>()
  )
  export const removeUser=createAction(
    '[user page]  load remove user',
    props<{id:number}>()
  )
  export const removeUsersuccess=createAction(
    '[user page] remove user success',
    props<{id:number}>()
  )
  export const loadUser=createAction(
    '[user page] loaded user',
    props<{name:any}>()
    
    )
 
    // count document categorie
export const countLoad=createAction('[count page] count loaded')
export const countLoadSuccess=createAction('[count page] loaded count success',
 props<{content:any}>()
)
export const countErrorLoad=createAction('[count page] load error count',
props<{error:string}>()
)

    export const loadUserSuccess = createAction(
        '[user page] loaded user success',
        props<{ Users: usersType[] }>()
      );
        export const loaduserFailed=createAction(
            '[user page] load error user',
            props<{error:string}>()
        )

        // find one user
        export const findUser=createAction(
        '[user page] load find user'  ,
        props<{id:any}>()
        )
        export const finduserWithSuccess=createAction('[user page] load find user success',
        props<{user:userWithPosts}>()
        )
        export const finduserWithFailed=createAction('[user page] load find user Failed',
        props<{error:string}>()
        )
        // up date user 
        export const updateUserLoad=createAction('[user page] load update user',
         props<{content:typeedituser;id:number}>()
        )
        export const updateUserLoadsuccess=createAction('[user page]  update user success',
        props<{content:usersType}>()
       )
       export const updateUserLoadfailed=createAction('[user page]  update user failed',
       props<{error:string}>()
      )