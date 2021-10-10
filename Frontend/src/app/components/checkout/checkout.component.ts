import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

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

	constructor(private formBuilder: FormBuilder) {
	}

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
	}

	onSubmit() {
		console.log("Purchase button clicked");
		console.log(this.checkoutFormGroup.get('customer').value);
		console.log("Last Name: " + this.checkoutFormGroup.get('customer').value.lastName);
		console.log("Total Quantity: " + this.totalQuantity);
		console.log("Total Price: " + this.totalPrice);
	}

	copyShippingAddressToBillingAddress(event) {

		//If checkbox is checked then copy values from shipping address to billing address
		if(event.target.checked) {
			this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
		}

		//else clear billing address
		else {
			this.checkoutFormGroup.controls.billingAddress.reset();
		}
	}
}
