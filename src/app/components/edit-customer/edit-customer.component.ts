import { Component, Input, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css',
})
export class EditCustomerComponent implements OnInit {
  @Input() customer: Customer | undefined;
  customerForm: FormGroup | any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  displayAllInputs: boolean = true;

  constructor(
    private service: CustomerService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    //used the breakpoint observer to change the display based on the screen's width
    //used a flag, and based on it the column will be displayed or hidden
    this.breakpointObserver
      .observe(['(max-width: 750px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.displayAllInputs = false;
        } else {
          this.displayAllInputs = true;
        }
      });

    //subscribe to the observable each time the value changes
    this.service.selectedCustomer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.customer = res;
          //pass the new values to the formGroup each time we select a new customer
          //we can either initialize the formGroup here or initialize it in the constructor and use patchValue here
          this.customerForm = this.fb.group({
            firstname: [this.customer?.firstname, [Validators.required]],
            lastname: [this.customer?.lastname, [Validators.required]],
            email: [
              this.customer?.email,
              [Validators.required, Validators.email],
            ],
            birthday: [this.customer?.birthday, [Validators.required]],
            picture: [this.customer?.picture, [Validators.required]],
          });
        },
        error: (err) => {
          //handle error as needed, we can show a toast that contains an error message for example
        },
      });
  }

  updateCustomer() {
    //Here we will update the selected customer
    console.log(this.customerForm.value);
  }
}
