import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	//Configure spring boot rest API
	private baseUrl = 'http://localhost:8080/api/products';
	private categoryUrl = 'http://localhost:8080/api/product_category';

	constructor(private httpClient: HttpClient) {
	}

	//Get json response and store it in an array
	//Get products based on category id
	getProductList(theCategoryId: number): Observable<Product[]> {

		//url based on category id
		const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

		return this.getProducts(searchUrl);
	}

	getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

		//url based on category id
		const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

		console.log(searchUrl);
		return this.httpClient.get<GetResponseProducts>(searchUrl);
	}

	//get products based on keyword search
	searchProducts(theKeyword: string): Observable<Product[]> {
		const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

		return this.getProducts(searchUrl);
	}

	getProduct(theProductId: number): Observable<Product> {

		//url based on category id
		const searchUrl = `${this.baseUrl}/${theProductId}`;

		return this.httpClient.get<Product>(searchUrl);
	}

	getProductCategories(): Observable<ProductCategory[]> {
		return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
			map(response => response._embedded.productCategory)
		);
	}

	private getProducts(searchUrl: string): Observable<Product[]> {
		return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
			map(response => response._embedded.products)
		);
	}
}

interface GetResponseProducts {
	_embedded: {
		products: Product[];
	},

	page: {
		size: number,
		totalElements: number,
		totalPages: number,
		number: number
	}
}

interface GetResponseProductCategory {
	_embedded: {
		productCategory: ProductCategory[];
	}
}
