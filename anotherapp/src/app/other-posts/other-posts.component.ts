import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';


import { loadProducts } from '../store/product.actions';
import { ProductBlogType } from '../product/product.service';
import {  seletcAll } from '../store/product.selector';
import { AppState } from '../store/product.state';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';

@Component({
  selector: 'app-other-posts',
  templateUrl: './other-posts.component.html',
  styleUrls: ['./other-posts.component.css']
})
export class OtherPostsComponent implements OnChanges  {
 
   @Input() cats:any

  
  load:boolean=false
  dark$:Observable<boolean>
constructor(private store:Store<AppState>,
  private router:Router ,
  private darkService:DarkService
  ){
   this.dark$=this.darkService.isdark$
  }


pro:ProductBlogType[]=[]
status:boolean=false; // Initial status
product$: ProductBlogType[] = [];
 
ngOnChanges(changes: SimpleChanges) {
  if (changes['cats']) {
    this.store.dispatch(loadProducts({cat:changes['cats'].currentValue}))
  }

}
ngOnInit(): void {
  if (!this.status) {
    console.log(this.cats,'cats')
  }


  this.store.select(seletcAll).subscribe(state => {
 
    this.product$ = state.data
  
    this.status=state.status
   
  });


 


  



  
}
}
