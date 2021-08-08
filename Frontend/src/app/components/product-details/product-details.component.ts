import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

	product: Product = new Product();

	constructor(private productService: ProductService,
				private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(() => {
			this.handleProductDetails();
		})
	}

	//get id param string and convert to number
	handleProductDetails() {
		const theProductId: number = Number(this.route.snapshot.paramMap.get('id'));

		this.productService.getProduct(theProductId).subscribe(
			data => {
				this.product = data;
			}
		)
	}
}
