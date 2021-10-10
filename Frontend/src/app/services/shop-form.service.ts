import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class ShopFormService {

	constructor() {
	}

	getCreditCardMonths(startMonth: number): Observable<number[]> {

		let data: number[] = [];

		//Build an array for "Month" dropdown
		//Loop from current month until end
		for (let theMonth = startMonth; theMonth <= 12; theMonth++)
			data.push(theMonth);

		//of() ( reactive javascript ) wraps an object as an observable
		return of(data);
	}

	getCreditCardYears(): Observable<number[]> {

		let data: number[] = [];

		//Build an array for "Year" dropdown
		//Start from current year and loop to next 10 years
		const startYear: number = new Date().getFullYear();
		const endYear: number = startYear + 10;

		for (let theYear = startYear; theYear <= endYear; theYear++)
			data.push(theYear);

		//of() ( reactive javascript ) wraps an object as an observable
		return of(data);
	}


}
