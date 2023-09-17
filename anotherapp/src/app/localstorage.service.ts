import { Injectable } from '@angular/core';


export type DecodeType={
  id:number,
  name:string ,
  img:'',
  email:string ,
  isAdmin:boolean
}|null
@Injectable({
  providedIn: 'root'
})

export class LocalstorageService {

  setItem(key:string,value:any):void{
    localStorage.setItem(key,JSON.stringify(value))
  }
  getItem(key:string):string{
   const value =  localStorage.getItem(key)
  return value?JSON.parse(value):null
  }

  removeItem(key:string):void{
   localStorage.removeItem(key)
  }

  constructor() { }
}
