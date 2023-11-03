import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from 'src/app/services/record.service';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.css'],
})
export class AddRecordComponent implements OnInit {
  addRecordForm!: FormGroup;
  imagePreview!: string;
  @Input()
  isEditMode: any;
  @Input()
  recordData: any = {};
  @Output() cancelEvent = new EventEmitter();

  isEditable: boolean = false;

  countries: {}[] = [];
  countriesName: any;
  statesData: any;
  citiesData: any;

  selectedCountryCode: any;

  sCountryName: any;
  sStateName: any;
  sCityName: any;

  constructor(
    private formBuilder: FormBuilder,
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.addRecordForm = this.formBuilder.group({
      _id: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      // image: [null],

      /* country: ['', Validators.required],
      state: [{ value: null, disabled: true }, Validators.required],
      city: [{ value: null, disabled: true }, Validators.required], */
    });

    if (this.isEditMode) {
      this.isEditable = this.isEditMode;
      this.setFormDataForEdit();
    }

    /* this.addRecordForm
      .get('country')
      ?.valueChanges.subscribe((selectedCountry) => {
        console.log('selectedCiuntry:::', JSON.stringify(selectedCountry));
        console.log(selectedCountry.name);

        if (selectedCountry) {
          this.statesData = this.getStates(selectedCountry);
        }
      }); */
  }

  setFormDataForEdit() {
    this.addRecordForm.patchValue(this.recordData);
  }

  async onSubmit() {
    if (this.addRecordForm.valid) {
      const formData = this.addRecordForm.value;

      if (this.isEditMode) {
        (await this.recordService.editRecord(formData)).subscribe(
          (response: any) => {
            this.addRecordForm.reset();
            this.isEditMode = false;
            this.cancelEvent.emit(true);
          },
          (error: any) => {
            console.error('error:', error);
          }
        );
      } else {
        delete formData._id;
        (await this.recordService.addRecord(formData)).subscribe(
          (response: any) => {
            this.cancelEvent.emit(true);
          },
          (error: any) => {
            console.error('error:', error);
          }
        );
      }
    }
  }

  /* onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addRecordForm.patchValue({ image: file });
    this.addRecordForm.get('image').updateValueAndValidity();

    // Display a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  } */

  cancelEdit() {
    this.addRecordForm.reset();
    this.isEditMode = false;
    this.cancelEvent.emit(true);
  }

  getCountries() {
    // this.countries.push(Country.getAllCountries());
    const data = Country.getAllCountries();
    const name = data.map((i) => ({
      name: i.name,
      flag: i.flag,
      cCode: i.isoCode,
    }));
    this.countriesName = name;
  }

  /* onCountrySelected(event: any) {
    const selectedCountryCode = event.target.value;
    // Do something with the selectedCountryCode
    console.log('Selected country code:', selectedCountryCode);
    // Call your getStates method here with the selectedCountryCode
    this.getStates(selectedCountryCode);
  } */

  getStates(cCode: any) {
    debugger;
    this.selectedCountryCode = cCode;

    let sCName = Country.getCountryByCode(cCode);
    this.sCountryName = sCName?.name;

    const states = State.getStatesOfCountry(cCode);

    const sData = states.map((i) => ({ name: i.name, sCode: i.isoCode }));
    this.statesData = sData;
  }

  getCities(sCode: any) {
    let countryCode = this.selectedCountryCode;
    let sSName = State.getStateByCodeAndCountry(sCode, countryCode);
    this.sStateName = sSName?.name;
    const cities = City.getCitiesOfState(countryCode, sCode);

    const cData = cities.map((i) => ({ name: i.name }));
    this.citiesData = cData;
  }

  getCity(cityName: any) {
    this.sCityName = cityName;
  }
}
