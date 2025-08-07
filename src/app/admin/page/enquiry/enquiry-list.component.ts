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

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.getEnquiries();
  }

  getEnquiries(): void {
    this.isLoading = true;
    const backendPage = this.page - 1;

    this.contactService.getAllContacts(backendPage, this.size).subscribe({
      next: (res) => {
        // Sort enquiries by submitted_on in descending order (newest first)
        this.enquiries = (res.data || []).sort((a: any, b: any) => {
          const dateA = new Date(a.submitted_on || a.createdAt).getTime();
          const dateB = new Date(b.submitted_on || b.createdAt).getTime();
          return dateB - dateA;
        });

        this.totalItems = res.totalRecords || 0;
        this.totalPages = Math.ceil(this.totalItems / this.size);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to load enquiries.', 'error');
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
        this.selectedEnquiry.status = this.updatedStatus;
        this.selectedEnquiry.remark = this.updatedRemark;

        this.closeView();
        this.getEnquiries();
        this.showMessage('Enquiry updated successfully.', 'success');
      },
      error: () => {
        this.showMessage('Failed to update enquiry. Please try again.', 'error');
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000); // Hide after 3 seconds
  }
}