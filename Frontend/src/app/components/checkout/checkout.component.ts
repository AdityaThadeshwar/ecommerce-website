import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ShopValidators} from "../../validators/shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

	//FormGroup is collection of FormControls or FormElements or other groups
	checkoutFormGroup: FormGroup;

	totalPrice: number = 0;
	totalQuantity: number = 0;

	creditCardYears: number[] = [];
	creditCardMonths: number[] = [];

	countries: Country[] = [];

	shippingAddressStates: State[] = [];
	billingAddressStates: State[] = [];

	storage: Storage = sessionStorage;

	// Initialize Stripe API
	stripe = Stripe(environment.stripePublishableKey);

	paymentInfo: PaymentInfo = new PaymentInfo();
	cardElement: any;
	displayError: any = "";

	// disable purchase button handling
	isDisabled: boolean = false;

	constructor(private formBuilder: FormBuilder,
				private shopFormService: ShopFormService,
				private cartService: CartService,
				private checkoutService: CheckoutService,
				private router: Router) {
	}

	ngOnInit(): void {

		// setup stripe form
		this.setupStripePaymentForm();

		//Get cart totals/quantity
		this.reviewCartDetails()

		//Read user's email from browser storage
		const theEmail = JSON.parse(this.storage.getItem('userEmail'));

		this.checkoutFormGroup = this.formBuilder.group({
			customer: this.formBuilder.group({
				firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
				lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
				email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), ShopValidators.notOnlyWhiteSpace])
			}),
			shippingAddress: this.formBuilder.group({
				country: new FormControl('', [Validators.required]),
				street: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidators.notOnlyWhiteSpace]),
				city: new FormControl('', [Validators.required, Validators.minLength(3), ShopValidators.notOnlyWhiteSpace]),
				state: new FormControl('', [Validators.required]),
				zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}'), ShopValidators.notOnlyWhiteSpace])
			}),
			billingAddress: this.formBuilder.group({
				country: new FormControl('', [Validators.required]),
				street: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidators.notOnlyWhiteSpace]),
				city: new FormControl('', [Validators.required, Validators.minLength(3), ShopValidators.notOnlyWhiteSpace]),
				state: new FormControl('', [Validators.required]),
				zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}'), ShopValidators.notOnlyWhiteSpace])
			}),
			creditCard: this.formBuilder.group({
				// cardType: new FormControl('', [Validators.required]),
				// nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
				// cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), ShopValidators.notOnlyWhiteSpace]),
				// securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), ShopValidators.notOnlyWhiteSpace]),
				// expirationMonth: [''],
				// expirationYear: ['']
			})
		});

		//Populate credit card months
		// const startMonth: number = new Date().getMonth() + 1;
		// console.log("startMonth: " + startMonth);
		//
		// this.shopFormService.getCreditCardMonths(startMonth).subscribe(
		// 	data => {
		// 		console.log("Retrieved Credit Card Months: " + JSON.stringify(data));
		// 		this.creditCardMonths = data;
		// 	}
		// );
		//
		// //Populate credit card years
		// this.shopFormService.getCreditCardYears().subscribe(
		// 	data => {
		// 		console.log("Retrieved Credit Card Years: " + JSON.stringify(data));
		// 		this.creditCardYears = data;
		// 	}
		// )


		//Populate countries
		this.shopFormService.getCountries().subscribe(
			data => {
				console.log("Countries retrieved: " + JSON.stringify(data));
				this.countries = data;
			}
		);
	}

	onSubmit() {
		console.log("Purchase button clicked");

		if (this.checkoutFormGroup.invalid) {
			this.checkoutFormGroup.markAllAsTouched();
			return;
		}

		// console.log("Last Name: " + this.checkoutFormGroup.get('customer').value.lastName);
		// console.log("Total Quantity: " + this.totalQuantity);
		// console.log("Total Price: " + this.totalPrice);
		// console.log(`Shipping Address Country/State: ${this.checkoutFormGroup.get('shippingAddress').value.country.name}/${this.checkoutFormGroup.get('shippingAddress').value.state.name}`);
		// console.log(`Billing Address Country/State: ${this.checkoutFormGroup.get('billingAddress').value.country.name}/${this.checkoutFormGroup.get('billingAddress').value.state.name}`)

		// setup order
		let order = new Order();
		order.totalQuantity = this.totalQuantity;
		order.totalPrice = this.totalPrice;

		// get cart items
		const cartItems = this.cartService.cartItems;

		//create orderItems from cartItems

		/*
		let orderItems: OrderItem[] = [];
		for(let i = 0; i < cartItems.length; i++) {
		orderItems[i] = new OrderItem(cartItems[i]);
		}
		*/

		let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

		// set up purchase
		let purchase = new Purchase();

		// populate purchase - customer
		purchase.customer = this.checkoutFormGroup.controls['customer'].value;

		// populate purchase - shippingAddress
		purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
		const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
		const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
		purchase.shippingAddress.state = shippingAddressState.name;
		purchase.shippingAddress.country = shippingAddressState.name;

		// populate purchase - billingAddress
		purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
		const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
		const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
		purchase.billingAddress.state = billingAddressState.name;
		purchase.billingAddress.country = billingAddressState.name;

		// populate purchase - order and orderItems
		purchase.order = order;
		purchase.orderItems = orderItems;

		// compute payment info
		this.paymentInfo.amount = Math.round(this.totalPrice * 100);
		this.paymentInfo.currency = "USD";

		// call REST api via CheckoutService
		// this.checkoutService.placeOrder(purchase).subscribe({
		// 		next: response => {
		// 			alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);
		//
		// 			//reset cart
		// 			this.resetCart();
		// 		},
		// 		error: err => {
		// 			alert(`There was an error: ${err.message}`);
		// 		}
		// 	}
		// )

		// if valid form then
		// - create payment intent
		// - confirm card payment
		// - place order

		if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

			//Disable purchase button
			this.isDisabled = true;

			//REST API call
			this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
				(paymentIntentResponse) => {
					this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
						{
							payment_method: {
								card: this.cardElement,
								billing_details: {
									email: purchase.customer.email,
									name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
									address: {
										line1: purchase.billingAddress.street,
										city: purchase.billingAddress.city,
										state: purchase.billingAddress.state,
										postal_code: purchase.billingAddress.zipCode,
										country: this.billingAddressCountry.value.country
									}
								}
							}
						}, {handleActions: false})
						.then(function (result) {
							if (result.error) {
								//inform there was an error
								alert(`There was an error: ${result.error.message}`);

								// enable submit button
								// @ts-ignore
								this.isDisabled = false;
							} else {
								//Call REST API via CheckoutService
								// @ts-ignore
								this.checkoutService.placeOrder(purchase).subscribe({
									next: response => {
										alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);

										//reset card
										// @ts-ignore
										this.resetCart();

										// enable submit button
										// @ts-ignore
										this.isDisabled = false;
									},
									error: err => {
										alert(`There was an error: ${err.message}`);

										// enable submit button
										// @ts-ignore
										this.isDisabled = false;
									}
								})
							}

						}.bind(this));
				}
			);
		} else {
			this.checkoutFormGroup.markAllAsTouched();
			return;
		}

	}

	copyShippingAddressToBillingAddress(event) {

		//If checkbox is checked then copy values from shipping address to billing address
		if (event.target.checked) {
			this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

			//copy states
			this.billingAddressStates = this.shippingAddressStates;
		}

		//else clear billing address on uncheck
		else {
			this.checkoutFormGroup.controls.billingAddress.reset();

			this.billingAddressStates = [];
		}
	}

	//Handle months and years on changing year from UI in cc field
	handleMonthsAndYears() {

		const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

		const currentYear: number = new Date().getFullYear();
		const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

		let startMonth: number;

		if (currentYear === selectedYear)
			startMonth = new Date().getMonth() + 1;

		else
			startMonth = 1;

		this.shopFormService.getCreditCardMonths(startMonth).subscribe(
			data => {
				console.log("Retrieved credit card months: " + JSON.stringify(data));
				this.creditCardMonths = data;
			}
		)
	}

	//Get states based on country selected in the form
	getStates(formGroupName: string) {

		//Get appropriate formGroup (shippingAddress or billingAddress)
		const formGroup = this.checkoutFormGroup.get(formGroupName);

		const countryCode = formGroup.value.country.code;

		console.log(`${formGroupName} country code: countryCode`);

		this.shopFormService.getStates(countryCode).subscribe(
			data => {

				if (formGroupName === 'shippingAddress')
					this.shippingAddressStates = data;

				else if (formGroupName === 'billingAddress')
					this.billingAddressStates = data;

				else
					console.log("No formGroupName found for country");

				//select first state by default
				formGroup.get('state').setValue(data[0]);
				console.log(formGroup.get('state'));
			}
		)
	}

	reviewCartDetails() {

		//subscribe to cartService.totalQuantity
		this.cartService.totalQuantity.subscribe(
			data => this.totalQuantity = data
		);

		//subscribe to cartService.totalPrice
		this.cartService.totalPrice.subscribe(
			data => this.totalPrice = data
		);
	}

	//Getter methods used for validation
	get firstName() {
		return this.checkoutFormGroup.get('customer.firstName');
	}

	get lastName() {
		return this.checkoutFormGroup.get('customer.lastName');
	}

	get email() {
		return this.checkoutFormGroup.get('customer.email');
	}

	get shippingAddressStreet() {
		return this.checkoutFormGroup.get('shippingAddress.street');
	}

	get shippingAddressCity() {
		return this.checkoutFormGroup.get('shippingAddress.city');
	}

	get shippingAddressZipCode() {
		return this.checkoutFormGroup.get('shippingAddress.zipCode');
	}

	get shippingAddressState() {
		return this.checkoutFormGroup.get('shippingAddress.state');
	}

	get shippingAddressCountry() {
		return this.checkoutFormGroup.get('shippingAddress.country');
	}

	get billingAddressStreet() {
		return this.checkoutFormGroup.get('billingAddress.street');
	}

	get billingAddressCity() {
		return this.checkoutFormGroup.get('billingAddress.city');
	}

	get billingAddressZipCode() {
		return this.checkoutFormGroup.get('billingAddress.zipCode');
	}

	get billingAddressState() {
		return this.checkoutFormGroup.get('billingAddress.state');
	}

	get billingAddressCountry() {
		return this.checkoutFormGroup.get('billingAddress.country');
	}

	get creditCardType() {
		return this.checkoutFormGroup.get('creditCard.cardType')
	}

	get creditCardNameOnCard() {
		return this.checkoutFormGroup.get('creditCard.nameOnCard')
	}

	get creditCardNumber() {
		return this.checkoutFormGroup.get('creditCard.cardNumber')
	}

	get creditCardSecurityCode() {
		return this.checkoutFormGroup.get('creditCard.securityCode')
	}

	// reset cart once the purchase is made
	resetCart() {

		// reset cart data
		this.cartService.cartItems = [];
		this.cartService.totalPrice.next(0); // publish 0 to all subscribers
		this.cartService.totalQuantity.next(0);
		this.cartService.persistCartItems(); //empty cart data in browser storage after checkout by saving blank cart

		// reset form data
		this.checkoutFormGroup.reset();

		// navigate to products page
		this.router.navigateByUrl("/order-history");

	}

	setupStripePaymentForm() {

		// get a handle of stripe element
		var elements = this.stripe.elements();

		// create a card element and hide zipcode field
		this.cardElement = elements.create('card', {hidePostalCode: true});

		// add an instance of card UI component into the 'card-element' div in html page
		this.cardElement.mount('#card-element');

		// add event binding for the 'change' event on the card element
		this.cardElement.on('change', (event) => {

			// get a handle of card-errors element
			this.displayError = document.getElementById('card-errors');

			if (event.complete) {
				this.displayError.textContent = "";
			} else if (event.error) {

				// show validation error
				this.displayError.textContent = event.error.message;
			}
		});

	}
}
