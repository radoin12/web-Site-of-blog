import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { userWithPosts } from 'src/app/store/user/user.actions';


@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  initialPage:number=0
  pageSize:number=1
  paginationPost:any=[]
  nbrPage:number=this.data.product.post.length/this.pageSize


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  ) {}
  
 
  nextPage(){
    this.initialPage+=1
     this.updateItem()
  }
  previousPage(){
    this.initialPage-=1
    this.updateItem()
  }
  updateItem(){
    const start=this.initialPage*this.pageSize 
    const end=(this.initialPage+1)*this.pageSize
     this.paginationPost=this.data.product.post.slice(start,end)
  }
ngOnInit(): void {
this.updateItem()
 

}
}
