import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProductBlogType } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class DarkService {
   isSubjectDarkMode=new BehaviorSubject<boolean>(false) 
   isdark$=this.isSubjectDarkMode.asObservable()
   product$?: Observable<ProductBlogType[]>;
   setData(){
    this.isSubjectDarkMode.next(!this.isSubjectDarkMode.value)
   }
   
   setProductData(data: Observable<ProductBlogType[]>) {
    this.product$ = data; // Utilisez cette méthode pour initialiser product$
   }
  constructor() { }
}
