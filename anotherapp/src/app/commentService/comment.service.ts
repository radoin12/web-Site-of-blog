import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { commentType, typeCreateComment } from '../store/type/comment.type';
import { SocketIOService } from '../soketIo/socket-io.service';


@Injectable({
  providedIn: 'root'
})
export class CommentService implements OnInit {

  constructor(private http:HttpClient,
    private socket:SocketIOService
    
    ) { }
  // comment request
   getProductWithComments(id:number):Observable<commentType[]>{
    return this.http.get<commentType[]>(`/api/comments/${id}`)
   }
   addComment(id:number,data:typeCreateComment):Observable<commentType>{
    return this.http.post<commentType>(`/api/addComment/${id}`,data)
   }
   deleteComment(id:number):Observable<number>{
     return this.http.delete<number>(`/api/deletecomment/${id}`)
   }
 
  ngOnInit(): void {
    
  }
}
