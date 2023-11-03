import { Component, OnInit } from '@angular/core';
import { RecordService } from 'src/app/services/record.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.css'],
})
export class RecordsListComponent implements OnInit {
  records: any[] = [];

  editableRecord: any;
  addRecord = false;
  editStatus = false;
  constructor(
    private recordsService: RecordService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.recordsService.getRecords().subscribe((data) => {
      this.records = data.records;
      console.log('records --->', this.records);
    });
  }

  editRecord(record: any) {
    this.editableRecord = record;
    this.editStatus = true;
  }

  async deleteRecord(id: number) {
    try {
      this.recordsService.deleteRecord(id).subscribe(
        (response: any) => {
          const index = this.records.findIndex((record) => record.id === id);

          if (index !== -1) {
            this.records.splice(index, 1);
            this.cd.detectChanges();
          }

          console.log('Record with ID', id, 'deleted.');
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } catch (e) {
      console.log('Error:', e);
    }
  }

  closeAdd(event: any) {
    this.addRecord = event.value;
    this.editStatus = event.value;
  }
}
