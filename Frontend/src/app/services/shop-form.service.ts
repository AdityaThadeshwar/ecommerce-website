import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GetResponseCountries} from "../interfaces/get-response-countries";
import {Country} from "../common/country";
import {map} from "rxjs/operators";
import {State} from "../common/state";
import {GetResponseStates} from "../interfaces/get-resonse-states";
import {environment} from "../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ShopFormService {

	private countriesUrl = environment.applicationUrl + '/countries';
	private statesUrl = environment.applicationUrl + '/states';

	constructor(private httpClient: HttpClient) {
	}

	//Get countries from spring
	getCountries(): Observable<Country[]> {
		return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
			map(response => response._embedded.countries)
		);
	}

	//Get states from spring
	getStates(theCountryCode: String): Observable<State[]> {

		//State search url by country code
		const stateSearchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

		return this.httpClient.get<GetResponseStates>(stateSearchUrl).pipe(
			map(response => response._embedded.states)
		)
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
