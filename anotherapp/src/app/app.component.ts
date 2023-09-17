import { Component, OnInit } from '@angular/core';
import { DecodeType, LocalstorageService } from './localstorage.service';
import jwtDecode from 'jwt-decode';


import { Router, NavigationEnd } from '@angular/router';
import { AdminservService } from './adminserv.service';
import { SocketIOService } from './soketIo/socket-io.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
 
 constructor(private localService:LocalstorageService
  ,private route:Router,
  public adminservice:AdminservService ,
  private socketService:SocketIOService
  ){
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateUserRole();
      }
    });
 }
 restartSocket() {
   this.socketService.closeSocket(); // Close the existing socket
  this.socketService = new SocketIOService(); // Re-initialize the service and create a new socket
}
 ngOnInit(): void {
  this.updateUserRole();


}
 private updateUserRole(): void {
  const decodedToken:DecodeType|null = this.localService.getItem('userToken')?jwtDecode(this.localService.getItem('userToken')):null;
  if (decodedToken && decodedToken.isAdmin) {
   this.adminservice.setAdminStatus(true)
  } else {
   this.adminservice.setAdminStatus(false)
  }
}
 
}