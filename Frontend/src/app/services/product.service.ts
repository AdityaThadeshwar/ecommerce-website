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
	getProductList(theCategoryId: number): Observable<Product[]> {

		//url based on category id
		const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

		return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
			map(response => response._embedded.products)
		);
	}

	getProductCategories(): Observable<ProductCategory[]> {
		return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
			map(response => response._embedded.productCategory)
		);
	}

	searchProducts(theKeyword: string): Observable<Product[]> {
		const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

		return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
			map(response => response._embedded.products)
		);
	}
}

interface GetResponseProducts {
	_embedded: {
		products: Product[];
	}
}

interface GetResponseProductCategory {
	_embedded: {
		productCategory: ProductCategory[];
	}
}
