import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private router : Router) {}

  doSearch(keyword : string ) {
    console.log(keyword);
    this.router.navigateByUrl(`search/${keyword}`);

  }

}
