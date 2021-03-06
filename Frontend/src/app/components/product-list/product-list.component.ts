import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list-grid.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	products: Product[] = [];
	currentCategoryId: number = 1;
	previousCategoryId: number = 1;
	searchMode: boolean = false;

	//properties for pagination
	thePageNumber: number = 1;
	thePageSize: number = 5; //number of products displayed in a page
	theTotalElements: number = 0;

	previousKeyword: string = null

	constructor(private productService: ProductService,
				//Injects route. Useful for accessing route parameters
				private route: ActivatedRoute,
				private cartService: CartService) {
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

		//If category is changed then reset the page no to 1
		if(this.previousCategoryId != this.currentCategoryId)
			this.thePageNumber = 1;

		this.previousCategoryId = this.currentCategoryId;
		console.log(`currentCategoryId: ${this.currentCategoryId}, thePageNumber: ${this.thePageNumber}`);

		//Get products for given category id
		// this.productService.getProductList(this.currentCategoryId).subscribe(   //method is invoked once you subscribe
		// 	data => {
		// 		this.products = data; //assigns result to product array
		// 	}
		// );

		//get products based on page size
		this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());

	}

	processResult() {
		return data => {
			this.products = data._embedded.products;
			this.thePageNumber = data.page.number + 1;
			this.thePageSize = data.page.size;
			this.theTotalElements = data.page.totalElements;
		}
	}

	handleSearchProducts() {
		const theKeyword: string = String(this.route.snapshot.paramMap.get('keyword'));

		//If keyword is changed then reset the page no to 1
		if(this.previousKeyword != theKeyword)
			this.thePageNumber = 1;

		this.previousKeyword = theKeyword;

		console.log(`theKeyword: ${theKeyword}, thePageNumber: ${this.thePageNumber}`);

		// this.productService.searchProducts(theKeyword).subscribe(
		// 	data => {
		// 		this.products = data; //assigns result to product array
		// 	}
		// );

		//get products based on page size
		this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult());
	}

	//Method is called when user changes the page size
	updatePageSize(pageSize: number) {
		this.thePageSize = pageSize;
		this.thePageNumber = 1;
		this.listProducts();
	}

	addToCart(theProduct: Product) {
		console.log(`Product added: ${theProduct.name} $${theProduct.unitPrice}`);

		const theCartItem = new CartItem(theProduct);
		this.cartService.addToCart(theCartItem);
	}
}
