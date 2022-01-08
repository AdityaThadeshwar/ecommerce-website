import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetResponseOrderHistory} from "../interfaces/get-response-order-history";

@Injectable({
	providedIn: 'root'
})
export class OrderHistoryService {

	private orderUrl = 'http://localhost:8080/api/orders';

	constructor(private httpClient: HttpClient) {

	}

	getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

		//build url based on customer email
		const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;

		return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
	}
}
