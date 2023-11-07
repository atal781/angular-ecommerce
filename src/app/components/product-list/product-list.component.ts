import { Component } from '@angular/core';
import { Product } from 'src/app/commmon/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] =[]; 

  constructor(private productService: ProductService) { }

  ngOnInit() {
   this.listProduct();
  }


 listProduct() {
  this.productService.getProductList().subscribe(
    (data) => this.products = data );
}


}

