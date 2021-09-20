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

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit(): void {
		this.checkoutFormGroup = this.formBuilder.group({
			customer: this.formBuilder.group({
				firstName: [''],
				lastName: [''],
				email: ['']
			})
		});
	}

	onSubmit() {
		console.log("Purchase button clicked");
		console.log(this.checkoutFormGroup.get('customer').value);
		console.log("Last Name: " + this.checkoutFormGroup.get('customer').value.lastName);
	}

}
