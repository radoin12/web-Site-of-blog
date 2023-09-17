import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { LocalstorageService } from './localstorage.service';
import { Observable } from 'rxjs';
import { usersType } from './store/user/user.actions';


export type UserInfo={
  name:string ,
  email:string ,
  password:string
}
export type loginuser={

  email:string ,
  password:string
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http:HttpClient,private localservice:LocalstorageService) { }
  registerUser(data:UserInfo):Observable<usersType>{
    return this.http.post<usersType>('/api/auth/register',data)
  }
  LoginUser(data:loginuser){
  return this.http.post('/api/auth/login',data)
  }
  LogoutUser(){
    return this.http.post('api/auth/logout',{})
  }
 
}
