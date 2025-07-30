import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../service/contact-service';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss']
})
export class EnquiryComponent implements OnInit {
  enquiries: any[] = [];
  page: number = 1;
  size: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  selectedEnquiry: any = null;
  updatedStatus: string = '';
  updatedRemark: string = '';
  remarkCharCount: number = 0;
  isLoading: boolean = false;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.getEnquiries();
  }

  getEnquiries(): void {
    this.isLoading = true;
    const backendPage = this.page - 1;

    this.contactService.getAllContacts(backendPage, this.size).subscribe({
      next: (res) => {
        this.enquiries = res.data || [];
        this.totalItems = res.totalRecords || 0;
        this.totalPages = Math.ceil(this.totalItems / this.size);
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load enquiries');
        this.isLoading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.getEnquiries();
  }

  viewEnquiry(enquiry: any): void {
    this.selectedEnquiry = enquiry;
    this.updatedStatus = enquiry.status || 'PENDING';
    this.updatedRemark = enquiry.remark || '';
    this.remarkCharCount = this.updatedRemark.length;
  }

  closeView(): void {
    const hasUnsavedChanges =
      this.updatedStatus !== this.selectedEnquiry.status ||
      this.updatedRemark !== (this.selectedEnquiry.remark || '');

    if (hasUnsavedChanges && !confirm('You have unsaved changes. Close anyway?')) {
      return;
    }

    this.selectedEnquiry = null;
    this.updatedStatus = '';
    this.updatedRemark = '';
    this.remarkCharCount = 0;
  }

  onRemarkChangeTextArea(): void {
    this.updatedRemark = this.updatedRemark.slice(0, 200);
    this.remarkCharCount = this.updatedRemark.length;
  }

  updateStatusAndRemark(): void {
    if (!this.selectedEnquiry) return;

    this.contactService.updateStatusAndRemark(
      this.selectedEnquiry.id,
      this.updatedStatus,
      this.updatedRemark
    ).subscribe({
      next: () => {
        // Update local values to avoid unsaved changes popup
        this.selectedEnquiry.status = this.updatedStatus;
        this.selectedEnquiry.remark = this.updatedRemark;

        //  No alert here
        this.closeView();
        this.getEnquiries();
      },
      error: () => {
        // Show alert only if something goes wrong
        alert('Failed to update.');
      }
    });
  }
}