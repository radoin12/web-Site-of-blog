import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { countNotifyType, notificationTypeDatas } from './notify.actions';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {



  constructor(
    private http:HttpClient
  ) { }
  // list of  notification
  getListNotification():Observable<notificationTypeDatas[]>{
  return  this.http.get<notificationTypeDatas[]>('/api/notification')
  
  }
  // count notification
  getcountNotification():Observable<countNotifyType>{
    return  this.http.get<countNotifyType>('/api/notification/count')
    
    }
    readbleNotification(id:number):Observable<number>{
 return this.http.put<number>(`/api/notification/read/${id}`,{})
    }
    deleteNotification(id:number):Observable<number>{
      return this.http.delete<number>(`/api/notification/delete/${id}`)
    }

}
