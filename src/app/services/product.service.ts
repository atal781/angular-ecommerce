import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable, map, pipe } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";


  constructor(private httpClient: HttpClient) { }

  // productList: Product[] = [];

  getProduct(productId: number): Observable<Product> {

    const prductUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(prductUrl);

  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage : number , thePageSize : number , theCategoryId: number) : Observable<GetResponseProducts> {
         
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(url);
  
  }

  searchForProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);

  }

  searchProductsPaginate(thePage : number , thePageSize : number ,keyword: string) : Observable<GetResponseProducts> {
         
    const url = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  
  }


  getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products));
  }

  getProductCateories() {
    return this.httpClient.get<getResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
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

interface getResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
