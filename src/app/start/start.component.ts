import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit {

  constructor(private customerservice: CustomerService){
    
  }

  customers?: Customer[];

  ngOnInit(): void {
    this.customerservice.getCustomers().subscribe(ret => {
      this.customers= ret;
    });
  }

}
