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
  currentCategoryName: string = "";
  searchMode : boolean = false;

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

  this.productService.getProductList(this.currentCategoryId).subscribe(
    (data) => this.products = data );
}

}

