import {ProductCategory} from "../common/product-category";

export interface GetResponseProductCategory {
	_embedded: {
		productCategory: ProductCategory[];
	}
}
