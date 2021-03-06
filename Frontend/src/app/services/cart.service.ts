import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class CartService {

	cartItems: CartItem[] = [];

	//Subject is a subclass of Observable. Used to publish events to all the subscribers
	totalPrice: Subject<number> = new BehaviorSubject<number>(0);
	totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

	//Store cart data in browser storage.
	//sessionStorage - reference to web browsers session storage.
	//storage: Storage = sessionStorage; Stores data in session which is limited to that particular tab
	storage: Storage = localStorage; //localStorage is stored in browser data. Can be accessed in new tabs/restarts

	constructor() {
		//read data from browser storage
		//JSON.parse reads JSON string and converts to object
		let data = JSON.parse(this.storage.getItem('cartItems'));

		if(data != null) {
			this.cartItems = data;

			//compute totals based on data read from storage
			this.computeCartTotals();
		}

	}

	//Add item to cart
	addToCart(theCartItem: CartItem) {
		let alreadyExistsInCart: boolean = false;
		let existingCartItem: CartItem = undefined;

		if (this.cartItems.length > 0) {

			//Find if item exists in cart
			//Arrays.find(), return first matched element from the array else undefined
			existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

			//check if we found it
			alreadyExistsInCart = (existingCartItem != undefined);
		}

		//if item already exists then increment the quantity else add it in the array
		if (alreadyExistsInCart) {
			existingCartItem.quantity++;
		} else {
			this.cartItems.push(theCartItem);
		}

		//Compute total price and total quantity in cart
		this.computeCartTotals();
	}

	computeCartTotals() {

		let totalPriceValue: number = 0;
		let totalQuantityValue: number = 0;

		for (let currentCartItem of this.cartItems) {

			totalPriceValue = totalPriceValue + currentCartItem.quantity * currentCartItem.unitPrice;
			totalQuantityValue = totalQuantityValue + currentCartItem.quantity;
		}

		//Publish values to all subscribers
		this.totalPrice.next(totalPriceValue);
		this.totalQuantity.next(totalQuantityValue);

		//log cart data
		this.logCartData(totalPriceValue, totalQuantityValue);

		//persist cart data
		this.persistCartItems();
	}

	//store cart items in browser storage
	 persistCartItems() {
		this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
	}

	logCartData(totalPriceValue: number, totalQuantityValue: number) {

		console.log(`-----------`);
		console.log("Contents of the cart...");

		for (let tempCartItem of this.cartItems) {

			const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

			console.log(`Name: ${tempCartItem.name}, Quantity: ${tempCartItem.quantity}, Unit Price: $${tempCartItem.unitPrice}, Total Price: $${subTotalPrice}`);
		}

		console.log(`Total Price: $${totalPriceValue.toFixed(2)}, Total Quantity: ${totalQuantityValue}`);
		console.log(`-----------`);
	}

	//Decrement item quantity from the cart
	decrementQuantity(theCartItem: CartItem) {
		theCartItem.quantity--;

		//Remove item from cart if quantity is 0
		if (theCartItem.quantity === 0) {
			this.remove(theCartItem);
		} else {
			this.computeCartTotals();
		}
	}

	//Remove item from the cart
	remove(theCartItem: CartItem) {

		//Get index of the cart item
		const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

		//Remove the item if found
		if (itemIndex > -1) {
			this.cartItems.splice(itemIndex, 1);
			this.computeCartTotals();
		}
	}
}
