import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private countriesUrl  = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient : HttpClient) { }

  getCountries() : Observable<Country[]> {
      return this.httpClient.get<getResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries));
  }

  getStates(countryCode : string) : Observable<State[]>{
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseState>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }



  getCreditCardMonth(startMonth : number): Observable<number[]> {
    let months: number[] = [];
    for (let index = startMonth; index <= 12; index++) {
      months.push(index);
    }
    return of(months);
  }

  getCreditCardYear(): Observable<number[]> {

    let years: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let index = startYear; index < endYear; index++) {
      years.push(index);
    }
    return of(years);
  }
}


interface getResponseCountries {
 _embedded : {
  countries : Country[];
 }
}

interface GetResponseState {
  _embedded : {
    states : State[];
  }
}