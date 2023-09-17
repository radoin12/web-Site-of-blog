
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ServiceUserService } from 'src/app/service-user.service';
import { addUser, addUserFailed, addUsersuccess, countErrorLoad, countLoad, countLoadSuccess, findUser, finduserWithFailed, finduserWithSuccess, loadUser, loadUserSuccess, loaduserFailed, removeUser, removeUsersuccess, updateUserLoad, updateUserLoadfailed, updateUserLoadsuccess } from './user.actions';
import { AuthService } from 'src/app/auth.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Store } from '@ngrx/store';




@Injectable()
export class userEffect{
    constructor(
        private actions$: Actions,
        private servuser: ServiceUserService,
        private authservice:AuthService ,
        private store: Store
      ) {}
    
      loadUsers$ = createEffect(() =>
  this.actions$.pipe(
  
    ofType(loadUser),
    
    mergeMap((action) =>
      this.servuser.getAllUsers(action.name).pipe(
        map(Users => loadUserSuccess({ Users })),
        catchError((error: any) => of(loaduserFailed({ error }))) // Add type for error parameter
      )
    )
    
   
  )
);
      // get count document cat
 loadCount$=createEffect(()=>
 this.actions$.pipe(
   ofType(countLoad),
   mergeMap(action=>
      this.servuser.getCountCategorie().pipe(
        map(res=>countLoadSuccess({content:res.fieldCounts})) ,
        catchError(error=>of(countErrorLoad({error})))
      )
     )
 )
)
// get one user 
  loadfinfuser$=createEffect(()=>
    this.actions$.pipe( 
      ofType(findUser),
      mergeMap((action)=> 
       this.servuser.getOneUser(action.id).pipe(
        map(res=>finduserWithSuccess({user:res})),
        catchError(error=>of(finduserWithFailed({error})))
       )
      )
    )
  )
      // load delete user 
      loadDelete$=createEffect(()=>
        this.actions$.pipe(
          ofType(removeUser),
          mergeMap(action=>
             this.servuser.deleteUser(action.id).pipe(
               map(res=>removeUsersuccess({id:action.id})),
                catchError(error=>of(loaduserFailed({error})))
             )
            )
        )
      )
          // create user 
          createUser$=createEffect(()=>
          this.actions$.pipe(
            ofType( addUser),
            mergeMap(action=> 
              this.authservice.registerUser(action.content).pipe(
                map(res=>addUsersuccess({content:res})),
                catchError(error=>of(addUserFailed({error:{message:error.error.text}})))
              )
              
              )
          )
          )

          // up date user 
          $updateuser=createEffect(()=>
          this.actions$.pipe(
            ofType(updateUserLoad),
            mergeMap(action=> 
              this.servuser.upDateuser(action.content,action.id).pipe(
                map(res=>updateUserLoadsuccess({content:res})),
                catchError(error=>of(updateUserLoadfailed({error:error.error.text})))
              )
              )
          )
          )


}