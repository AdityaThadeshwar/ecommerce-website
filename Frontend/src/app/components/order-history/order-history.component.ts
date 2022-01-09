import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
	selector: 'app-order-history',
	templateUrl: './order-history.component.html',
	styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

	orderHistoryList: OrderHistory[] = [];
	storage: Storage = sessionStorage;

	constructor(private orderHistoryService: OrderHistoryService) {
	}

	ngOnInit(): void {
		this.handleOrderHistory();
	}

	handleOrderHistory(){

		//Read user's email from browser session storage
		const theEmail = JSON.parse(this.storage.getItem('userEmail'));

		//retrieve data from service for the given user based on email
		this.orderHistoryService.getOrderHistory(theEmail).subscribe(
			data => {
				this.orderHistoryList = data._embedded.orders;
			}
		)
	}

}
