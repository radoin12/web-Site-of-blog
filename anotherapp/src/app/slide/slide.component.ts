import { Component, Input, OnInit } from '@angular/core';
import { ProductBlogType } from '../product/product.service';
import { Observable } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css'],
  
})
export class SlideComponent implements OnInit {

product$?: Observable<ProductBlogType[]> 
isDrak$: Observable<boolean>;
darkMode: DarkService; // Déclarez la propriété darkMode en tant que membre de la classe

constructor(private darkModeService: DarkService) {
  this.isDrak$ = this.darkModeService.isdark$;
  this.darkMode = darkModeService; // Assignez darkModeService à la propriété darkMode
}

toggleDarkMode() {
  this.darkModeService.setData();
}
ngOnInit(): void {
  
}
}
