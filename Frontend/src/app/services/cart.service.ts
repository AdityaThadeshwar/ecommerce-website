import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

	cartItems: CartItem[] = [];

	//Subject is a subclass of Observable. Used to publish events to all the subscribers
	totalPrice: Subject<number> = new Subject<number>();
	totalQuantity: Subject<number> = new Subject<number>();

  	constructor() { }

	addToCart(theCartItem: CartItem) {
  		let alreadyExistsInCart: boolean = false;
  		let existingCartItem: CartItem = undefined;

  		if(this.cartItems.length > 0) {

  			//Find if item exists in cart
			for(let tempCartItem of this.cartItems) {

				if(tempCartItem.id === theCartItem.id) {
					existingCartItem = tempCartItem;
					break;
				}
			}

			//check if we found it
			alreadyExistsInCart = (existingCartItem != undefined);
		}

		//if item already exists then increment the quantity else add it in the array
		if(alreadyExistsInCart) {
			existingCartItem.quantity++;
		}

		else {
			this.cartItems.push(theCartItem);
		}

		//Compute total price and total quantity in cart
		this.computeCartTotals();
	}

	computeCartTotals() {

  		let totalPriceValue: number = 0;
  		let totalQuantityValue: number = 0;

  		for(let currentCartItem of this.cartItems) {

  			totalPriceValue = totalPriceValue + currentCartItem.quantity * currentCartItem.unitPrice;
			totalQuantityValue = totalQuantityValue + currentCartItem.quantity;
		}

  		//Publish values to all subscribers
		this.totalPrice.next(totalPriceValue);
  		this.totalQuantity.next(totalQuantityValue);

  		//log cart data
		this.logCartData(totalPriceValue, totalQuantityValue);
	}

	logCartData(totalPriceValue: number, totalQuantityValue: number) {

		console.log(`-----------`);
  		console.log("Contents of the cart...");

  		for(let tempCartItem of this.cartItems) {

  			const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

  			console.log(`Name: ${tempCartItem.name}, Quantity: ${tempCartItem.quantity}, Unit Price: $${tempCartItem.unitPrice}, Total Price: $${subTotalPrice}`);
		}

  		console.log(`Total Price: $${totalPriceValue.toFixed(2)}, Total Quantity: ${totalQuantityValue}`);
		console.log(`-----------`);
	}
}
