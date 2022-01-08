import {OrderHistory} from "../common/order-history";

export interface GetResponseOrderHistory {
	_embedded: {
		orders: OrderHistory[];
	}
}
