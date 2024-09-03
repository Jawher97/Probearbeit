import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { timeout } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { MatPaginator } from '@angular/material/paginator';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Customer } from '../../model/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    CommonModule,
    EditCustomerComponent,
    MatPaginator,
  ],
  providers: [DatePipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = [
    'picture',
    'firstname',
    'lastname',
    'email',
    'birthday',
    'adress',
  ];
  dataSource: Customer[] = [];
  expandedCustomer: Customer | null = null;
  selectedCustomer!: Customer;

  constructor(
    private customerService: CustomerService,
    private breakpointObserver: BreakpointObserver,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    //used the breakpoint observer to change the displayed columns based on the screen's width
    this.breakpointObserver
      .observe(['(max-width: 750px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.displayedColumns = ['firstname', 'lastname'];
          this.expandedCustomer = null;
        } else {
          this.displayedColumns = [
            'picture',
            'firstname',
            'lastname',
            'email',
            'birthday',
            'adress',
          ];
        }
      });

    this.customerService
      .getCustomers()
      .pipe(timeout(10000))
      .subscribe({
        next: (res) => {
          this.dataSource = res;
          //we can either initialize the selectedCustomer with the first element of the array or we can just initialize it when we click
          // on the column like I did on handleRowClick
          // this.selectedCustomer = this.dataSource[0];
          // this.customerService.selectedCustomer(this.selectedCustomer);
        },
        error: (err) => {},
      });
  }

  sendData(element: Customer) {
    this.selectedCustomer = element;
    //create a new date based on the element.birthday attribute value so we can get and display a correct value in the update form
    this.selectedCustomer.birthday = new Date(element.birthday);
    //send the new customer to the observable so we can get it in the edit-customer-componnet
    this.customerService.selectedCustomer(this.selectedCustomer);
  }

  handleRowClick(element: Customer): void {
    //if the shown customer is the same customer that we clicked on, we're going to set it to null
    //which means we will hide it, otherwise we're gonna show the new selectedelement
    this.expandedCustomer = this.expandedCustomer === element ? null : element;
    //if the customer is expanded, we're going to send the new customer the sendData method
    if (this.expandedCustomer) this.sendData(element);
  }
}
