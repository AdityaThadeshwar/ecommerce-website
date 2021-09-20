import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

	cartItems: CartItem[] = [];
	totalQuantity: number = 0;
	totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  	this.listCartDetails();
  }

	listCartDetails() {

  		//Get a handle on cart items
		this.cartItems = this.cartService.cartItems;

		//Subscribe to cart totalPrice
		this.cartService.totalPrice.subscribe(
			data => this.totalPrice = data
		);

		//subscribe to cart totalQuantity
		this.cartService.totalQuantity.subscribe(
			data => this.totalQuantity = data
		);

		//compute cart total price and quantity
		this.cartService.computeCartTotals();

	}

	incrementQuantity(theCartItem: CartItem) {
	  this.cartService.addToCart(theCartItem);
	}

	decrementQuantity(tempCartItem: CartItem) {
		this.cartService.decrementQuantity(tempCartItem);
	}
}
