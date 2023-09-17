import { Component, Input, OnInit } from '@angular/core';


import { ProductBlogType, ProductService } from '../product/product.service';
import { DarkService } from '../darkMode/dark.service';
import { Observable } from 'rxjs';
//  to install date from now  npm install ngx-moment --save

export type ProductblogObject={
  id: number,
  img: string,
  description: string,
  title:string,
  date: string,
  cat: string,
  userId: number
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() data: any;
  dark$:Observable<boolean>
  calculateRelative=this.productService.calculateRelativeTime.bind(this.productService)
  constructor(
    private productService: ProductService , 
    private darkMode:DarkService
    
    ) {
      this.dark$=this.darkMode.isdark$
    }

  ngOnInit(): void {

  }

  
  
}
