import { createSelector } from "@ngrx/store";
import { AppState, InitialStateType } from "./product.state";




export const seletcAll=(state:AppState)=>state.product
export const selectUsers=(state:AppState)=>state.user
const selectProductState = (state: AppState) => state; // Vous devrez peut-être ajuster le chemin selon la structure de votre état.

export const selectAllProduct = createSelector(
  selectProductState,
  (state: AppState) => state.product.data
);
export const selectUserProfile=createSelector(
   selectProductState,
(state:AppState)=>state.user.getuser
)
export const notifyState=createSelector(
  selectProductState ,
  (state:AppState)=>state.product.notification
)