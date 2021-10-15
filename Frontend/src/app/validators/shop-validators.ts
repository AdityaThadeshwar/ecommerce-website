import {FormControl, ValidationErrors} from "@angular/forms";

export class ShopValidators {

	//whitespace validation
	//ValidationErrors is a map which contains errors
	static notOnlyWhiteSpace(control: FormControl): ValidationErrors {

		//Validation fails. String only contains whitespace
		//notOnlyWhiteSpace this key is used in html to check whether to display the error message or not
		if( (control.value != null) && (control.value.trim().length === 0))
			return { 'notOnlyWhiteSpace': true }

		//Validation passes
		else
			return null;


	}
}
