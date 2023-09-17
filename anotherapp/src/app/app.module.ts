import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import socket io

//  import matrial angular
import {MatBadgeModule} from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import{MatSidenavModule} from '@angular/material/sidenav'
import{MatExpansionModule} from '@angular/material/expansion'
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';
import{FormsModule}from  '@angular/forms'
import {  ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{  MatIconModule} from '@angular/material/icon'
import { ProductComponent } from './products/game.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OtherPostsComponent } from './other-posts/other-posts.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { productReducer } from './store/product.reducers';
import { ProductEffects } from './store/product.effects';
import { UserComponent } from './admin/user/user.component';
import { SingleuserComponent } from './admin/singleuser/singleuser.component';
import { NavAdminComponent } from './admin/nav-admin/nav-admin.component';
import { userEffect } from './store/user/user.effect';
import { userReducer } from './store/user/user.reducers';
import { DetailUserComponent } from './admin/detail-user/detail-user.component';
import { ProductdetailComponent } from './admin/productdetail/productdetail.component';
import { AdduserComponent } from './admin/adduser/adduser.component';
import { AddblogComponent } from './admin/addblog/addblog.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ContentComponent } from './comment/content/content.component';
import { notifyEffect } from './notification/notify.effect';
import { NoCloseMenuDirective } from './admin/nav-admin/no-closemenu';
import { ProfileComponent } from './profile/profile.component';
import { SerchUserComponent } from './serch-user/serch-user.component';
import { SlideComponent } from './slide/slide.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';






@NgModule({
  
  declarations: [
    AppComponent,
  
    ProductComponent,
    NavbarComponent,
    RegisterComponent,
    ListComponent,
    AddComponent,
    LoginComponent,
    NotFoundComponent,
    SingleProductComponent,
    OtherPostsComponent,
  
    UserComponent,
    SingleuserComponent,
    NavAdminComponent,
    DetailUserComponent,
    ProductdetailComponent,
    AdduserComponent,
    AddblogComponent,
    ContentComponent,
    NoCloseMenuDirective,
    ProfileComponent,
    SerchUserComponent,
    SlideComponent
   

  
   

  ],
  imports: [
    BrowserModule,
    MatMenuModule,
    MatButtonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule ,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatRadioModule,
    StoreModule.forRoot({ 
       product: productReducer,
      user: userReducer
    }),
    EffectsModule.forRoot([ProductEffects,userEffect,notifyEffect]),
    MatSlideToggleModule,
    MatSidenavModule,
    MatExpansionModule,
  
    ReactiveFormsModule,
  
     MatSnackBarModule,
     MatBadgeModule,
     NgbModule
   
   

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
