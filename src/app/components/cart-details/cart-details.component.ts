import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {
  cartItems : CartItem[] =[];
  totalPrice!: number;
  totalQantity!: number;

  constructor(private cartService:CartService) {}

  ngOnInit() {
     this.listCartDetails();
  }
  listCartDetails() {
      this.cartItems = this.cartService.cartItems;
      
      this.cartService.totalPrice.subscribe(
        data => {
          this.totalPrice =data;
        });
        this.cartService.totalQuantity.subscribe(
          data => {
            this.totalQantity =data;
          });

          this.cartService.computeCartTotal();
   }
 


   incrementQuantity(tempItem: CartItem) {
    this.cartService.addtoCart(tempItem);
    }


    decrementQuantity(tempItem: CartItem) {
     this.cartService.decrementQuantity(tempItem);    }

removeItem(tempItem : CartItem) {
     this.cartService.removeItem(tempItem);
  }
}