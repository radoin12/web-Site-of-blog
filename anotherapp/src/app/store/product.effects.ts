import { Injectable, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { addProduct, addProductsuccess,  loadProductFailed, loadProductSuccess, loadProducts, removeProduct, removeProductsuccess, updateProduct, updateProductFailure, updateProductSuccess } from './product.actions';
import { mergeMap, map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { ProductService } from '../product/product.service';


import { ProductComponent } from '../products/game.component';
import { from, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceUserService } from '../service-user.service';
import { commentAddSuccess, commentDeleteError,commentLoad, commentLoadDelete, commentLoadError, commentLoadSuccess, commentLoadedAdd, commentdeletecommentNow } from './user/action_comment/comment.actions';
import { CommentService } from '../commentService/comment.service';

@Injectable()
export class ProductEffects {

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(action =>
        this.productService.getAllProduct(action.cat).pipe(
          map(products => loadProductSuccess({ products })),
          catchError(error => of(loadProductFailed({ error })))
        )
      )
    )
  );
deleteProduct$ = createEffect(() =>
this.actions$.pipe(
  ofType(removeProduct),
  switchMap(action =>
   
    this.productService.deleteProduct(action.id).pipe(
      map(response =>
      removeProductsuccess({ id:response})),
      catchError(error => of(loadProductFailed({error})))
    )
  )
)
);



addProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addProduct),
    switchMap(action => 
      this.productService.createPost(action.pro).pipe(
       
      map(response => addProductsuccess({content:response}))
     
    
    )
    )
  )
);
updateProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(updateProduct), 
   mergeMap(action =>
      this.productService.updatePost(action.updatedProduct,action.id).pipe(
        map(response => updateProductSuccess({ updatedProduct:response })),
        catchError(error => of(updateProductFailure({ error })))
      )
    )
  )
);
// comment to up date the state
loadComment$=createEffect(
  ()=>
  this.actions$.pipe(
    ofType(commentLoad),
    mergeMap(action => 
      this.comentService.getProductWithComments(action.id).pipe(
        map(res=>commentLoadSuccess({content:res})),
        catchError(error=>of(commentLoadError({error})))
      )
      )
  )
)
// comment add

addComment$ = createEffect(() =>
  this.actions$.pipe(
    ofType(commentLoadedAdd),
    mergeMap(action =>
      this.comentService.addComment(action.id, action.data).pipe(
        map(res => commentAddSuccess({ data: res })),
        catchError(error => of(commentLoadError({ error })))
      )
    )
  )
);

//  delete comment
deleteComment$=createEffect(
  ()=>
  this.actions$.pipe(
    ofType(commentLoadDelete),
    mergeMap(action => 
      this.comentService.deleteComment(action.id).pipe(
        map(res=>commentdeletecommentNow({id:res})),
        catchError(err=>of(commentDeleteError({error:err})))
      )
      )
  )
)








  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private comentService:CommentService
  ) {}

}