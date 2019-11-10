import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { DfuseService } from '../services/dfuse.service';
import { Filter } from './filter';

export const ethereumAddressValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const forbidden = !/^[A-Za-z0-9]{42}$|^$/.test(control.value);
  return forbidden ? { invalidEthereumAddress: { value: control.value } } : null;
}

export function filterDuplicateValidator(filters: Filter[]): ValidatorFn {
  return (control: FormGroup): ValidationErrors | null => {
    const to = control.get('to').value;
    const from = control.get('from').value;
    for (const filter of filters) {
      if (to === filter.to && from === filter.from) {
        return { duplicateFilter: true };
      }
    }
    return null;
  };
}


export const filterFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const to = control.get('to');
  const from = control.get('from');

  return !(to && to.value) && !(from && from.value) ? { filterForm: true } : null;
};

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  public filterForm: FormGroup;
  filters: Filter[];

  constructor(
    formBuilder: FormBuilder,
    private dfuse: DfuseService,
  ) {
    this.filters = dfuse.filters;
    this.filterForm = formBuilder.group({
      to: new FormControl('', ethereumAddressValidator),
      from: new FormControl('', ethereumAddressValidator)
    });

    this.filterForm.setValidators([filterFormValidator, filterDuplicateValidator(this.filters)])
  }

  filter(): void {
    this.dfuse.addFilter(this.filterForm.value);
    this.filters = this.dfuse.filters;
    this.filterForm.reset({
      to: '',
      from: '',
    });
    this.filterForm.updateValueAndValidity();
  }

  removeFilter(index: number) {
    this.dfuse.removeFilter(index);
    this.filterForm.updateValueAndValidity();
  }

  ngOnInit() {
  }

}
