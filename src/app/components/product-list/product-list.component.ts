import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/service/product.service';

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

  thePageNumber : number= 1;
  thePageSize: number = 10;
  theTotalElements : number = 0;



  products: Product[] =[]; 
 

  constructor(private productService: ProductService,private activeRoute: ActivatedRoute) { }

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

  this.productService.searchForProducts(theKeyword).subscribe(
    data => {
      this.products = data;
    }
  )

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

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(
      (data) => {
        this.thePageNumber = data.page.number +1;
        this.thePageSize =data.page.size;
        this.theTotalElements=data.page.totalElements;
        this.products=data._embedded.products;
      }
    )
}



}

