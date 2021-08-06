import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list-grid.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	products: Product[] | undefined;
	currentCategoryId: number | undefined;
	searchMode: boolean | undefined;

	constructor(private productService: ProductService,
				private route: ActivatedRoute) { //Injects route. Useful for accessing route parameters
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(() => {    //anytime the parameter value changes and even if the navigation is being done on the same component, paramMap observable will detect and read it
			this.listProducts()
		});
	}

	listProducts() {

		//Coming from path:/search/:keyword route
		this.searchMode = this.route.snapshot.paramMap.has('keyword');

		if (this.searchMode)
			this.handleSearchProducts();

		else
			this.handleListProducts();
	}

	handleListProducts() {

		const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

		//Convert id from string to number
		if (hasCategoryId) {
			this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
		} else
			this.currentCategoryId = 1;

		//Get products for given category id
		this.productService.getProductList(this.currentCategoryId).subscribe(   //method is invoked once you subscribe
			data => {
				this.products = data; //assigns result to product array
			}
		);
	}

	handleSearchProducts() {
		const theKeyword: string = String(this.route.snapshot.paramMap.get('keyword'));

		this.productService.searchProducts(theKeyword).subscribe(
			data => {
				this.products = data; //assigns result to product array
			}
		);
	}
}
