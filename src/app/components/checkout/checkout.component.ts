import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutFormValidations } from 'src/app/validators/checkout-form-validations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  totalQuantity!: number;
  totalPrice!: number;

  checkoutFormGroup!: FormGroup;
  countries!: Country[];

  shippingAddressStates!: State[];
  billingAddressStates!: State[];


  creditCardMonth: number[] | undefined;
  creditCardYear: number[] | undefined;

  constructor(private formBuilder: FormBuilder, private checkoutFormService: CheckoutFormService , private cartService : CartService) { }

  ngOnInit() {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        lastName: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        email: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipcode: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipcode: new FormControl("", [Validators.required, Validators.minLength(2), CheckoutFormValidations.notOnlyWhiteSpaces])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl("", [Validators.required]),
        nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2)]),
        cardNumber: new FormControl("", [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl("", [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl("", [Validators.required]),
        expirationYear: new FormControl("", [Validators.required]),
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

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName') }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName') }
  get email() { return this.checkoutFormGroup.get('customer.email') }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipcode') }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipcode') }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear') }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth') }


  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value);


      this.billingAddressStates = this.shippingAddressStates;

      // this.checkoutFormGroup.controls['billingAddress.state'].setValue(
      // this.checkoutFormGroup.controls['shippingAddress.state'].value)
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
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
          this.shippingAddressStates = data;
        }
        else
          this.billingAddressStates = data;
      });
  }

  reviewCartDetails() {

    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice=data;
      });
  this.cartService.totalQuantity.subscribe(
    data => {
      this.totalQuantity=data;
    })
}
}
