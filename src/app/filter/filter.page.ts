import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DfuseService } from '../services/dfuse.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  public filterForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    public dfuse: DfuseService,
    ) { 
    this.filterForm = formBuilder.group({
      to: new FormControl('', Validators.required),
      from: new FormControl('', Validators.required)
    });
  }

  filter(): void {
    this.dfuse.addFilter(this.filterForm.value);
  }
  
  ngOnInit() {

  }

}
