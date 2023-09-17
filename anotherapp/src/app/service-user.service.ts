import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { userWithPosts, usersType } from './store/user/user.actions';
import { DetailUserComponent } from './admin/detail-user/detail-user.component';
import { typeedituser } from './store/product.actions';
type typeCount={
  fieldCounts:any[]
}
@Injectable({
  providedIn: 'root'
})

export class ServiceUserService  implements OnInit{
  weekendTable:string[]=['dimanche','lundi',"mardi","mercredi","jeudi","vendredi","samedi"]
  constructor(
    private http:HttpClient,
    private dialog: MatDialog
  ) { }
  // get all users
  getAllUsers(querry:string):Observable<usersType[]>{
    
     const checkquerry=querry!==""?querry:""
    return this.http.get<usersType[]>(`/api/user?name=${checkquerry}`)
  }
  getOneUser(id:number):Observable<userWithPosts>{
 return this.http.get<userWithPosts>(`/api/user/post/${id}`)
  }
  getCountCategorie():Observable<typeCount>{
  return this.http.get<typeCount>('/api/count')
  }
  deleteUser(id:number){
   return  this.http.delete(`/api/user/delete/${id}`)
  }
  upDateuser(data:typeedituser,id:number):Observable<usersType>{
  return this.http.put<usersType>(`/api/user/update/${id}`,data)
  }
  openProductModal(product: any): void {
   
    
    this.dialog.open(DetailUserComponent, {
      data: {product},
    });
  }
  getDate(createdAt:any){
  
   
    const getDay=new Date(createdAt).getDay()
    const duration=new Date().getTime()-new Date(createdAt).getTime()
    const getSecond=Math.floor(new Date(duration).getSeconds())
    const getMinute=Math.floor(new Date(duration).getMinutes())
    const Hours=Math.floor((new Date(duration).getHours()))-1
   
     const day=(duration/(1000*3600*24))
  
    
     if (getSecond<60&&getMinute<1&&Hours<1&&day<0.95) {
   
      return ` il ya ${getSecond} Second`
    }
    else if (getMinute<60&&Hours<1&&day<0.95) {

      return ` il ya ${getMinute} Minute`
    }
    else if (Hours<24&&day<0.95) {
     
      return ` il ya ${Hours} Heure`  
    }
    else if(day>0.95&&day<1.95)  {
     
      return ` hier à ${createdAt?.substring(11,16)}`   
    }
    else{
      return `${this.weekendTable[getDay]} à ${createdAt.substring(11,16)}`
    }
    }
 
ngOnInit(): void {

}
}
