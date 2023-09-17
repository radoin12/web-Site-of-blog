import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { countNotifyType } from '../notification/notify.actions';
export type typeNotification={
 
  message?:string
  ,type?:string,
  userName?:string,
  imageUser?:string
}
export type typeNotificationuser={
  userId:number|undefined,
  isread?:boolean,
  isdelete?:boolean,
  message?:string
  ,type?:string,
  userName?:string,
  imageUser?:string
}
@Injectable({
  providedIn: 'root'
})

export class SocketIOService implements OnInit{
  private socket: Socket;
  constructor( ) { 
     this.socket = io('http://localhost:3000', {
       withCredentials: true,
       transports: ['websocket'],
       upgrade: false,
       // Add headers to support DELETE method
       extraHeaders: {
         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
       }
     });
  
  

  }
  ngOnInit(): void {
   
  }

  getSocket(): Socket {
    return this.socket
  }
   onCommentAdded() : Observable<any>  {
      return new Observable((observer) => {
        this.socket.on('emitCommentAdd', (data: any) => {
          observer.next(data);
        });
      });
   }

    onRemoveComment():Observable<any>{
     return new Observable((observer)=>{
      this.socket.on('removeComment',(data:any)=>{
        observer.next(data)
      })
     })
    }
    onUpdateProduct():Observable<any>{
      return new Observable((observer)=>{
        this.socket.on('UpDateProduct',(upDateProduct)=>{
          observer.next(upDateProduct)
        })
      })
    }
   onAddProduct():Observable<any>{
       return new Observable((observer)=>{

        this.socket.on('newProduct',(pro:any)=>{
         
         observer.next(pro)
        })
       })
   }
   onAddUser():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('addUser',(addUser)=>{
       
        observer.next(addUser)
      })
    })
   }
   onDeleteUser():Observable<any>{
    return new Observable((observe)=>{
      this.socket.on('DeleteUsers',(deleteUser)=>{
        observe.next(deleteUser)
      })
   
    })
   }
   onUpdateUser():Observable<any>{
    return new Observable((observe)=>{
      this.socket.on('UpdateUser',(updateUser)=>{
        observe.next(updateUser)
      })
    })
   }
   onupdateCount():Observable<countNotifyType>{
    return new Observable((observer)=>{
      this.socket.on('updateCount',(update)=>{
          
        observer.next(update)
      })
    })
   }
 
   onRemovePro():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('RemoveBlog',(deletePro:any)=>{
        console.log('pro',deletePro)
        observer.next(deletePro)
      })
      
    })
   }
  
   closeSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
   onCustomDisconnect(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('disconnect', () => {
        console.log('disconnet')
        observer.next(); // Notify when disconnected

      });
    });
  }
  
}