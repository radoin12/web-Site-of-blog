import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePosteType } from '../add/add.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductdetailComponent } from '../admin/productdetail/productdetail.component';

export type ProductBlogType={
  id: number,
  img: string,
  description: string,
  title:string,
  date: string,
  cat: string,
  userId: number
}
interface apiCreatePost{
  id: number,
  img: string,
  title: string,
  description: string,
  userId: number,
  cat: string
  date: string
}
export type SingleProductJoinUserType={
  
    name?: string,
    description: string,
    title: string,
    img: string,
    date: string,
    image?:string,
    cat: string

}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  constructor(private http:HttpClient,
    private dialog:MatDialog
    ) { }
   calculateRelativeTime(date: string): string {
    
    const timeDifference = Date.now() - new Date(date).getTime();
    const seconds = new Date(Math.floor(timeDifference )).getSeconds();
  
    const days= (Math.round((timeDifference)/(1000*60*60*24)))
    const minutes=new Date(Math.floor(timeDifference)).getMinutes()
    const Hours=Math.round((timeDifference)/(1000*60*60))
    const month= (Math.floor((timeDifference)/(1000*60*60*24*30)))
  
    let  difHours=Hours-(days*24)
  
    let  diffdays=days-(month*30)
  
    if(month>=1 && month<30){
      if (diffdays>0&&difHours>0) {
        return `${month} month ${diffdays} days ${difHours} hours  ago ` 
      }
      if (diffdays>0) {
        return `${month} month ${diffdays} days ago ` 
      }
      return `${month} month   ago `
     }
  
     else if (days>=1&&days<30) {
      
         if (difHours>0) {
          return `${days} days ${difHours} hours ago `; 
         }
         return `${days} days  ago `;
      
     
     
    }
    else if(Hours>=1&&Hours<24){
     
      return `${Hours} hours ${minutes} minutes ago`
     }
    else if(minutes>=1&&minutes<60&&Hours<1){
     return `${minutes} minutes ago`
    }
    else if(seconds>=1 && seconds<60 && Hours<1 && minutes<1){
     return `${seconds} seconds ago `
    }
    
    return''
  
  }
  openModelDetailBlog(blog:apiCreatePost){
    this.dialog.open(ProductdetailComponent,{
     data:{blog}
    })
  }


  
  // ************liste of products***********

  //  operations methode for each request
            // *******get all products******
        getAllProduct(q:string):Observable<ProductBlogType[]>{
                const all=q?`?cat=${q}`:''
               return this.http.get<ProductBlogType[]>(`/api/all${all}`)
        }
        // find one product

        getOneProduct(id:number|null):Observable<SingleProductJoinUserType|null>{
         return this.http.get<SingleProductJoinUserType|null>(`/api/posts/users/${id}`)
        }
        // upload image
        uploadImage(file:any):Observable<any>{
          return this.http.post<any>('/api/uploadimg',file)
        }
        createPost(data:CreatePosteType){
          console.log(data, "data")
             return this.http.post<apiCreatePost>('/api/post',data)
        }
        updatePost(data:any,id:number):Observable<ProductBlogType>{
             return this.http.put<ProductBlogType>(`/api/posts/update/${id}`,data)
        }
        deleteProduct(id:number):Observable<number>{
         
           return this.http.delete<number>(`/api/post/delete/${id}`)
        }
      
      
      
  ngOnInit():void{
 
  }
}
