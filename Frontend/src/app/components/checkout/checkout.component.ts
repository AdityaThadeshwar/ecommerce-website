import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";

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

	constructor(private formBuilder: FormBuilder,
				private shopFormService: ShopFormService) { }

	ngOnInit(): void {
		this.checkoutFormGroup = this.formBuilder.group({
			customer: this.formBuilder.group({
				firstName: [''],
				lastName: [''],
				email: ['']
			}),
			shippingAddress: this.formBuilder.group({
				country: [''],
				street: [''],
				city: [''],
				state: [''],
				zipCode: ['']
			}),
			billingAddress: this.formBuilder.group({
				country: [''],
				street: [''],
				city: [''],
				state: [''],
				zipCode: ['']
			}),
			creditCard: this.formBuilder.group({
				cardType: [''],
				nameOnCard: [''],
				cardNumber: [''],
				securityCode: [''],
				expirationMonth: [''],
				expirationYear: ['']
			})
		});

		//Populate credit card months
		const startMonth: number = new Date().getMonth() + 1;
		console.log("startMonth: " + startMonth);

		this.shopFormService.getCreditCardMonths(startMonth).subscribe(
			data => {
				console.log("Retrieved Credit Card Months: " + JSON.stringify(data));
				this.creditCardMonths = data;
			}
		);

		//Populate credit card years
		this.shopFormService.getCreditCardYears().subscribe(
			data => {
				console.log("Retrieved Credit Card Years: " + JSON.stringify(data));
				this.creditCardYears = data;
			}
		)

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
		console.log(this.checkoutFormGroup.get('customer').value);
		console.log("Last Name: " + this.checkoutFormGroup.get('customer').value.lastName);
		console.log("Total Quantity: " + this.totalQuantity);
		console.log("Total Price: " + this.totalPrice);
		console.log(`Shipping Address Country/State: ${this.checkoutFormGroup.get('shippingAddress').value.country.name}/${this.checkoutFormGroup.get('shippingAddress').value.state.name}`);
		console.log(`Billing Address Country/State: ${this.checkoutFormGroup.get('billingAddress').value.country.name}/${this.checkoutFormGroup.get('billingAddress').value.state.name}`)
	}

	copyShippingAddressToBillingAddress(event) {

		//If checkbox is checked then copy values from shipping address to billing address
		if(event.target.checked) {
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

		if(currentYear === selectedYear)
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

				if(formGroupName === 'shippingAddress')
					this.shippingAddressStates = data;

				else if(formGroupName === 'billingAddress')
					this.billingAddressStates = data;

				else
					console.log("No formGroupName found for country");

				//select first state by default
				formGroup.get('state').setValue(data[0]);
				console.log(formGroup.get('state'));
			}
		)
	}
}
