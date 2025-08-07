import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  selectedUser: any = null;
  page: number = 1;
  size: number = 10;
  totalItems: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchCustomers(this.page);
  }

  fetchCustomers(page: number): void {
    const pageNumber = page - 1;
    this.userService.findAllUsers(pageNumber, this.size).subscribe({
      next: (res) => {
        // Sort customers by creation/registration date (latest first)
        this.customers = (res.data || [])
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.registrationDate).getTime();
            const dateB = new Date(b.createdAt || b.registrationDate).getTime();
            return dateB - dateA; // Latest first
          });

        this.totalItems = res.totalRecords || 0;
        this.page = page;
      },
      error: (err) => {
        // console.error('Error fetching customers:', err);
      }
    });
  }

  viewCustomer(user: any): void {
    this.selectedUser = user;
  }

  closeView(): void {
    this.selectedUser = null;
  }

  onPageChange(page: number): void {
    this.fetchCustomers(page);
  }

  get totalPages(): number {
    return this.size > 0 ? Math.ceil(this.totalItems / this.size) : 1;
  }
}