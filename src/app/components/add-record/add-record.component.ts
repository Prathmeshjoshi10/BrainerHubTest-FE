import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from 'src/app/services/record.service';

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
  @Output() deleteEvent = new EventEmitter();

  isEditable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    this.addRecordForm = this.formBuilder.group({
      // _id: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      // image: [null],
    });

    if (this.isEditMode) {
      this.isEditable = this.isEditMode;
      this.setFormDataForEdit();
    }
  }

  setFormDataForEdit() {
    this.addRecordForm.patchValue(this.recordData);
  }

  async onSubmit() {
    if (this.addRecordForm.valid) {
      const formData = this.addRecordForm.value;
      console.log('formData:::', formData);

      if (this.isEditMode) {
        (await this.recordService.editRecord(formData)).subscribe(
          (response: any) => {
            this.addRecordForm.reset();
            this.isEditMode = false;
            this.cancelEvent.emit(true);
            console.log('updated Record Data:', response);
          },
          (error: any) => {
            console.error('error:', error);
          }
        );
        console.log('Edited Record Data:', formData);
      } else {
        (await this.recordService.addRecord(formData)).subscribe(
          (response: any) => {
            this.cancelEvent.emit(true);
            console.log('New Record Data:', response);
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
}
