import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})

export class CartStatusComponent {


  constructor(private cartService: CartService) {}

  totalPrice: number = 0.00;
  totalQuantity : number = 0;

  ngOnInit() {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      });
      this.cartService.totalQuantity.subscribe(
        data => {
          this.totalQuantity = data;
        }
      )
  }

}
