import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchAll, switchMap } from 'rxjs';

import { selectUsers, seletcAll } from 'src/app/store/product.selector';
import { AppState } from 'src/app/store/product.state';
import { countLoad } from 'src/app/store/user/user.actions';



export type SideBarType={
  name:string,
  icon:string,
  path:string |null,
  open:boolean,
  list:{
    name:string,
    icon:string,
    path:string
  }[]|null
}[]
export const SideBar:SideBarType=[{
  name:"dashboad",
  icon:'home',
  path:'/admin',
  open:false,
  list:null
},
{
  name:"settings",
  icon:'settings',
  path:'/settings',
  open:false,
  list:null
},
{
  name:'list',
  icon:'list',
  path:null,
  open:false,
  list:[
    {
      name:"user",
      icon:"perm_identity",
      path:'/user',
    },
    {
      name:"product",
      icon:"shopping_cart",
      path:'/product'
    }
  ]
}
]

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  public sideBarData:SideBarType=SideBar||[]
  count$:any=[]
  getkey:any=[]
  constructor(
    private store:Store<AppState>
  ){}
   convetObject(data:any[]){
       data.map((item:any)=>
       this.count$.push({name:Object.keys(item)[0],val:Object.values(item)[0]})
       )
   }
  ngOnInit(): void {
    this.store.dispatch(countLoad())
    this.store.select(selectUsers).subscribe(
      state=>{
      this.convetObject(state.count)
        
      }
    )
 
  }
}
