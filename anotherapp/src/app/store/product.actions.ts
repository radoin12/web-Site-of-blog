import { createAction, props } from '@ngrx/store';
import { ProductBlogType } from '../product/product.service';
import { CreatePosteTypes, createPostInput } from './product.reducers';
import { CreatePosteTypepayload } from '../add/add.component';

export interface typeCreatuser{
  id:number ,
  name: string,
  email: string,

  image:string
}
export interface typeCreatuser1{
 
  name: string,
  email: string,
  password:string,
  image:string
}
export interface typeedituser{
 
  name: string,
  email: string,
 
  image:string
}

export const loadProducts= createAction('[Product] Load Products',
props<{ cat: string }>()
);
export const loadProductSuccess= createAction(
  '[Product] Products Loaded success',
  props<{ products: ProductBlogType[] }>()
);
export const loadProductFailed=createAction(
  '[Product] Loads Products Failure',
  props<{error:string}>()

)
export const removeProduct=createAction('[Product Remove] load delete Product',
 props<{id:number}>()
 )
 export const removeProductsuccess=createAction('[Product Remove] delete Product success',
 props<{id:number}>()
 )
 export const addProduct=createAction('[Product] add product',
 props<{pro:CreatePosteTypepayload}>()
 )
 export const addProductsuccess=createAction('[Product] add product success',
 props<{content:CreatePosteTypes}>()
 )
 
// Action for successful update
export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ updatedProduct: ProductBlogType }>()
);
export const updateProduct = createAction(
  '[Product] Update Product ',
  props<{ updatedProduct: createPostInput; id: number }>()
);

// Action for failed update
export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: string }>()
);



