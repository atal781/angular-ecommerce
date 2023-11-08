import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/commmon/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  currentCategoryId : number = 1;

  products: Product[] =[]; 

  constructor(private productService: ProductService,private activeRoute: ActivatedRoute) { }

  ngOnInit() {
   this.activeRoute.paramMap.subscribe(() =>
   this.listProduct());
  }


 listProduct() {

  const hasCategoryId: boolean = this.activeRoute.snapshot.paramMap.has('id');

  if(hasCategoryId) {
    this.currentCategoryId = +this.activeRoute.snapshot.paramMap.get('id')!;
  }

  this.productService.getProductList(this.currentCategoryId).subscribe(
    (data) => this.products = data );
}


}

