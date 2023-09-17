import { Component, OnInit } from '@angular/core';
import { AuthService, loginuser } from '../auth.service';
import { DecodeType, LocalstorageService } from '../localstorage.service';
import{Router} from '@angular/router'
import jwtDecode from 'jwt-decode';
export interface ApiResponse  {
  accessToken: string;
  // Other properties if present in the response
}
type errorType={
  errorEmail:string|null,
  errorPass:string|null
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin:loginuser={
    email:"",
    password:""
  }
  admin:boolean=false
   
  errorReponse:errorType|null={
    errorEmail:"",
    errorPass:""
  }
  errorapi:string|null=null
  
constructor(private loginservice:AuthService
,private userInfoService:LocalstorageService
,private router:Router,
 

){
   
      
} 

ngOnInit():void{

  console.log(this.admin)
 
}
handlerLogin() {
  if (!this.formLogin.email) {
    this.errorReponse={errorEmail:"email is required",errorPass:null}
    return;
  }
  if (!this.formLogin.password) {
    this.errorReponse={errorEmail:null,errorPass:"password is required"}
    return;
  }

  this.loginservice.LoginUser(this.formLogin).subscribe(
    (res) => {
      const Apiresponseuser = res as ApiResponse;

      if (Apiresponseuser.accessToken) {
        this.userInfoService.setItem('userToken', Apiresponseuser.accessToken);
        const token:DecodeType|any=this.userInfoService.getItem('userToken')?jwtDecode(this.userInfoService.getItem('userToken')as string):{}
        this.admin=token?.isAdmin
        
        
        this.formLogin = {
          email: '',
          password: ''
        };
        
       
        this.errorReponse = null;
        this.errorapi=null
        
      }
      if (this.admin) {
       
        this.router.navigate(['/admin'])
      }
      else{
        this.router.navigate(['/home'])
      }
      
 
    },
    (error) => {
      this.errorapi = error.error;
    }
  );
          
}
}
