import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { loadUser, usersType } from '../store/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/product.state';
import { selectUsers } from '../store/product.selector';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DarkService } from '../darkMode/dark.service';

@Component({
  selector: 'app-serch-user',
  templateUrl: './serch-user.component.html',
  styleUrls: ['./serch-user.component.css']
})
export class SerchUserComponent implements OnInit {
@Input() search?:any 
@Input() othersearch:any
@Output() closeList: EventEmitter<void> = new EventEmitter<void>();
closeListe:boolean=false
dark$:Observable<boolean>
constructor(
  private store :Store<AppState> ,
  private router:Router ,
  private darkService:DarkService
){
  this.dark$=this.darkService.isdark$
}
closeSearchList() {
  // Fermez la liste de recherche en mettant à jour une variable booléenne.
  this.closeList.emit();
}
 routerToUserProfile(userId:number){
  this.router.navigate(['/profile',userId])
 }
 
ngOnInit(): void {
console.log(this.othersearch)
}

}
