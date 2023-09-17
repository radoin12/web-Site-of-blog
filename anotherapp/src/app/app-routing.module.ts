import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ProductComponent } from './products/game.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { AddComponent } from './add/add.component';

import { UserComponent } from './admin/user/user.component';
import { SingleuserComponent } from './admin/singleuser/singleuser.component';
import { AdduserComponent } from './admin/adduser/adduser.component';
import { AddblogComponent } from './admin/addblog/addblog.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'register', component:RegisterComponent},
  {path:'home',component:ProductComponent},
  {path:'single/:id' ,component:SingleProductComponent},
  {path:'login',component:LoginComponent},
  {path:'createpost', component:AddComponent},
  {path:'admin',component:UserComponent},
  {path:'user',component:SingleuserComponent},
  {path:'product',component:SingleuserComponent},
  {path:'adduser',component: AdduserComponent},
  {path:'addproduct',component:AddblogComponent},
  {path:'profile/:id',component:ProfileComponent},
  {path:'**',component:NotFoundComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
