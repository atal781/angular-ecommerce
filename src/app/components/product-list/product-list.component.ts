import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {


  currentCategoryId : number = 1;
  previousCategoryId: number =1;
  currentCategoryName: string = "";
  searchMode : boolean = false;

  previousKeyword : string="";

  thePageNumber : number= 1;
  thePageSize: number = 5;
  theTotalElements : number = 0;



  products: Product[] =[]; 
 

  constructor(private productService: ProductService,private activeRoute: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit() {
   this.activeRoute.paramMap.subscribe(() =>
   this.listProduct());
  }


 listProduct() {

    this.searchMode = this.activeRoute.snapshot.paramMap.has("keyword");

     if(this.searchMode){
    this.handleSearchProduct();
     }

     else
     this.handleListProduct();
 }

 
handleSearchProduct() {

  const theKeyword = this.activeRoute.snapshot.paramMap.get('keyword')!;

  if(this.previousKeyword!=theKeyword){
    this.thePageNumber=1;
  }

  this.productService.searchProductsPaginate(this.thePageNumber-1,
     this.thePageSize, 
     theKeyword)
     .subscribe(this.processResult());

}


handleListProduct() {
  const hasCategoryId: boolean = this.activeRoute.snapshot.paramMap.has('id');

  if(hasCategoryId) {
    this.currentCategoryId = +this.activeRoute.snapshot.paramMap.get('id')!;

    // get the "name" param string
    this.currentCategoryName = this.activeRoute.snapshot.paramMap.get('name')!;
  }

  else
  {
    this.currentCategoryId=1;
    this.currentCategoryName = 'Books';
  }

  // this.productService.getProductList(this.currentCategoryId).subscribe(
  //   (data) => this.products = data );

  if(this.previousCategoryId != this.currentCategoryId) {
    this.thePageNumber =1;
  }

  this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult()   )
}

updatePageSize(pageSize: string) {
this.thePageSize = +pageSize;
this.thePageNumber=1;
this.listProduct();

}

 processResult() {
  return (data: any)  => {
    this.thePageNumber = data.page.number +1;
    this.thePageSize =data.page.size;
    this.theTotalElements=data.page.totalElements;
    this.products=data._embedded.products;
  }

}

addProductToCart(tempProduct: Product) {
 console.log(tempProduct)

 const theCartItem = new CartItem(tempProduct);
 
 this.cartService.addtoCart(theCartItem);
  }
}


