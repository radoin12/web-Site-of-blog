import { Component, Injectable, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { ProductBlogType, ProductService } from '../product/product.service';

import { Store, select } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { selectAllProduct, seletcAll } from '../store/product.selector';
import { loadProducts } from '../store/product.actions';
import { Observable } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';








@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class ProductComponent  implements OnInit{
 

  load:boolean=false
  page:number=0
  paginator:ProductBlogType[]=[]
  public pageSize:number=4
  TotalPage:number=0
  darek$:Observable<ProductBlogType[]>
constructor(
  private router:ActivatedRoute,
  private productService:ProductService,
  private store:Store<AppState> ,
 private  darkMode:DarkService
  
  ){
  this.darek$=this.store.select(selectAllProduct)
  this.darkMode.setProductData(this.darek$);
  }

 togleDarkMode(){
  this.darkMode.setData()
  this.darkMode.isSubjectDarkMode.subscribe((item)=>{
    console.log(item ,'item')
  })
 }

   updateitem(data:ProductBlogType[]):ProductBlogType[]{
    const startIndex = this.page * this.pageSize;
    const endIndex = (this.page + 1) * this.pageSize;
 
     return data.slice(startIndex, endIndex)

   }
  querry:string|any=""
   
  ngOnInit(){
    this.router.queryParams.subscribe(param => {
      this.querry = param['cat'];
      this.page=+param['page'] || 0
      this.store.dispatch(loadProducts({ cat: this.querry}));
    });
   this.loadProductsByCategory()
    this.store.select(seletcAll).subscribe(state => {

      this.load=state.status


    
    });
    
  this.darek$.subscribe((data)=>{
    this.TotalPage= Math.ceil(data.length / this.pageSize)
  })
  }

  loadProductsByCategory() {
    this.store.dispatch(loadProducts({ cat: this.querry}));
  }
 
  nextPage() {
    this.page++;
   
   
   
  }

  previousPage() {
 
      this.page--;
   
    
     
    
  }
}
   

