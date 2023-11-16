import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product!: Product;

constructor(private productService: ProductService, private activeRoute : ActivatedRoute){}

ngOnInit() {
  // this.getProduct;

  this.activeRoute.paramMap.subscribe(() => {this.getProduct()});
}
  getProduct() {
   const productId = +this.activeRoute.snapshot.paramMap.get('id')!;
   
   this.productService.getProduct(productId).subscribe(
    data => {
      this.product =data;
    }
   )
  }

}
