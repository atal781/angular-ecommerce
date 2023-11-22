import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutFormGroup!: FormGroup;
  countries!: Country[];

  shippingAddressState!: State[];
  billingAddressState!: State[];


  creditCardMonth: number[] | undefined;
  creditCardYear: number[] | undefined;

  constructor(private formBuilder: FormBuilder, private checkoutFormService: CheckoutFormService) { }

  ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstname: [""],
        lastName: [""],
        email: [""]
      }),
      shippingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipcode: [""]
      }),
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipcode: [""]
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""]
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.checkoutFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        this.creditCardMonth = data;
      });

    this.checkoutFormService.getCreditCardYear().subscribe(data => {
      this.creditCardYear = data;
    })

    this.checkoutFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressState = this.shippingAddressState;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressState=[];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        this.creditCardMonth = data;
      }
    )


  }


  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressState = data;
        }
        else
        this.billingAddressState = data;
      });   
}
}
