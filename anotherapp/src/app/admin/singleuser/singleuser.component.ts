import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { DecodeType, LocalstorageService } from 'src/app/localstorage.service';
import { notifyEventAdd } from 'src/app/notification/notify.actions';

import { ProductBlogType, ProductService } from 'src/app/product/product.service';
import { ServiceUserService } from 'src/app/service-user.service';
import { SocketIOService, typeNotification, typeNotificationuser } from 'src/app/soketIo/socket-io.service';
import { loadProducts, removeProduct } from 'src/app/store/product.actions';
import { selectUsers, seletcAll } from 'src/app/store/product.selector';
import { AppState } from 'src/app/store/product.state';
import { findUser, loadUser, removeUser, userWithPosts, usersType } from 'src/app/store/user/user.actions';

export type typecolumnuser=
  {id:string,label:string}

export type Typeblog={
  id: number,
  img: string,
  description: string,
  title:string,
  date: string,
  cat: string,
  userId: number,
  actions:{
    delete:string|number ,
    view:string|number 
  }
}
export type usersTypes={
  id:number ,
  name: string,
  email: string,

  image:string,
  DateUser:string,
  actions:{
    delete:number,
    view:number
  }
}

@Component({
  selector: 'app-singleuser',
  templateUrl: './singleuser.component.html',
  styleUrls: ['./singleuser.component.css']
  
})
export class SingleuserComponent implements OnDestroy   {


  url:string=''
  id:number=0
  status:boolean=false
  private subscribeUser:Subscription=new Subscription()
  private subscribeProduct:Subscription=new Subscription()
  private stateSubscription: Subscription =new Subscription()
  oneUser:userWithPosts|null=null
  displayedColumns:typecolumnuser [] = [
    {
      id:'id',label:'Id'
    },
    {
      id:'image',label:'Image'
    },
    {
    id:'name',label:'Name'
  },
 
  {
    id:'email',label:'Email'
  },
 
  {
    id:'DateUser',label:'Created At'
  },
  {id:'Actions',label:'Actions'}
];
  displayedColumnsProduct:any[]=[
    {id:'id',label:'id'},
    {id:'img',label:'Image'},
  
    {id:'title',label:'Title'},
    {id:'cat',label:'Category'},

    {id:'date',label:'Created At'},
    {id:'Actions' , label:'Actions'}

    
  ]
  @ViewChild(MatPaginator, { static: true }) 
  paginator!: MatPaginator; // Reference to the paginator
  decode:DecodeType=null
  constructor(
    private store:Store<AppState>,
    private router:Router,
   private  productservice:ProductService,
   private userService:ServiceUserService,
   private servIo:SocketIOService,
   private localStorage:LocalstorageService ,



  ){}
  dataSourceUser: MatTableDataSource<usersTypes> = new MatTableDataSource<usersTypes>();
  dataSourceProduct:MatTableDataSource<Typeblog>=new MatTableDataSource<Typeblog>()
  convertDataToproduct(data:ProductBlogType[]){
   return  data.map((item)=>  ({id:item.id,
      img:`assets/uploads/${item?.img}`,
      description:item.description,
      title:item.title,
      cat:item.cat,
      date:this.productservice.calculateRelativeTime(item.date),
      userId:item.userId,
      actions:{delete:item.id,view:item.id}
    
    })
    )
     
  }
  convertDatatoUser(data:usersType[]){
   return data.map((item)=>({id:item.id,
    image:`assets/uploads/${item.image}`,
    name:item.name,
    email:item.email,
    
    DateUser:this.productservice.calculateRelativeTime(item.DateUser),
    actions:{delete:item.id,view:item.id}
  }
    
   ))
  }
  getColumnIds(columns: any[]): string[] {
    return columns.map(column => column.id);
  }
  // view Product

  ViewProduct(product:any){
   this.productservice.openModelDetailBlog(product)
   
  }

  DeleteProduct(id:number,cat:string,title:string){

    const emitDeleteProduct:typeNotificationuser={
      userId:this.decode?.id,
      message: `is  Delete blog ${title} for category ${cat} `,
      type:'removeBlog',
      userName:this.decode?.name,
      imageUser:this.decode?.img
     }
     this.servIo.getSocket().emit('eventBlog',emitDeleteProduct)
     this.servIo.onRemovePro().subscribe(data=>{
       const{id,...other}=data
      this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}));
     })
      this.store.dispatch(removeProduct({id}))
  
    
  
  }

  // delete user
  DeleteUser(id:number,name:string){
   
    const emitDeleteuser:typeNotificationuser={
      userId:id,
      message: `is  Delete user ${name}  `,
      type:'DeleteUsers',
      userName:this.decode?.name,
      imageUser:this.decode?.img
     }
  
    this.servIo.getSocket().emit('eventUser',emitDeleteuser)
    this.servIo.getSocket().on('deleteUsers',(data)=>{
      console.log(data,'delete')
      const{id,...other}=data

      this.store.dispatch(notifyEventAdd({data:{...other,notification_id:data.id}}));
    })
    this.store.dispatch(removeUser({id}))
  }
  // view user


  
  
  ViewUser(user: usersType, id: number) {
    this.store.dispatch(findUser({ id }));
   
    this.stateSubscription = this.store.select(selectUsers)
      .subscribe((state) => {
        const user = state.getuser;
        if (user &&!state.statusProfile ) {
          this.userService.openProductModal(user);
        }
  
    
      });
     
  }
  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.subscribeProduct.unsubscribe() ;
    this.subscribeUser.unsubscribe()
  }
  // styling table depond on each column
    
  getClassColumn(column:any){
    switch (column) {
      case 'name':
        return 'name-cell';
      case 'email':
        return 'email-cell';
        case 'image':
          return 'image-cell'
        ;
        case 'id' :
          return 'id-cell'
          case 'DateUser' :
            return 'DateUser-cell'
            case 'Actions':
              return 'actions-cell'
          


      default:
        return '';
    }
  }
  actionth(name:string):string{
    if(name==='Action'){
      return '20px'
    }
    return ''
  }
  


  ngOnInit(): void {
   
    this.url=this.router.url.split('/')[1]

    this.store.dispatch(loadUser({name:''}))
    this.store.dispatch(loadProducts({cat:''}))
    this.subscribeUser=this.store.select(selectUsers).subscribe(
      state=>{
        this.oneUser=state.getuser
        this.status=state.status
          const user=this.convertDatatoUser(state.user) 
           this.dataSourceUser.data=user
          if (this.url==='user') {
            this.dataSourceUser.paginator=this.paginator
          }
          
    
      
      }
    )
     this.subscribeProduct= this.store.select(seletcAll).subscribe(
      state=>{
       
       
        this.status=state.status
       
           const transform= this.convertDataToproduct(state.data)
          this.dataSourceProduct.data=transform
        
        
         if (this.url==='product'&&!this.status) {
          this.dataSourceProduct.paginator=this.paginator
         }
     
         
      }
   
     
    )
    
  
   const user=this.localStorage.getItem('userToken')?this.localStorage.getItem('userToken'):null 
   if (user) {
    this.decode=jwtDecode(user)
   }
}

}