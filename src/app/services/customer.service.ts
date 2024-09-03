import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  //used replaySubject to transfer data between two components
  private _selectedCustomer : ReplaySubject<Customer>= new ReplaySubject<Customer>(1)

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<Customer[]>{
    return this.http.get<Customer[]>('/assets/testdata.json');
  }

  public selectedCustomer(customer:Customer){
    this._selectedCustomer.next(customer)
  }

  //we're getting the selectedCustomer asObservable so we can subscribe to it each time the value changes
  get selectedCustomer$(){
    return this._selectedCustomer.asObservable()
  }
}
