import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  public cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>;
  totalQuantity: Subject<number> = new Subject<number>;

  addtoCart(cartItem: CartItem) {

    // //Checking if the item already exist
    let alreadyExistInCart: boolean = false;
    // // let existingCartItem : CartItem= undefined;

    if (this.cartItems.length > 0) {

      for (let index = 0; index < this.cartItems.length; index++) {
        if (this.cartItems[index].id === cartItem.id) {
          this.cartItems[index].quantity++;
          alreadyExistInCart = true;
          break;
        }
      }
    }

    if (!alreadyExistInCart) this.cartItems.push(cartItem);


    // this.cartItems.push(cartItem);
    this.computeCartTotal();
  }

  computeCartTotal() {

    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let tempItem of this.cartItems) {
      totalPrice = totalPrice + tempItem.quantity * tempItem.unitPrice;
      totalQuantity += tempItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }

}



