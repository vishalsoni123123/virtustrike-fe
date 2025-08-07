import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selectedDate: string = '';
  eventText: string = '';
  events: { [key: string]: string } = {};
  showForm: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';
  isEditing: boolean = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('events');
    if (saved) {
      this.events = JSON.parse(saved);
    }
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  saveEvent(): void {
    if (this.selectedDate && this.eventText.trim()) {
      this.events[this.selectedDate] = this.eventText.trim();
      localStorage.setItem('events', JSON.stringify(this.events));
      this.eventText = '';
      this.selectedDate = '';
      this.showForm = false;
      this.isEditing = false;
      this.showMessage('Event saved successfully!', 'success');
    } else {
      this.showMessage('Please select a date and enter event details.', 'error');
    }
  }

  editEvent(date: string): void {
    this.selectedDate = date;
    this.eventText = this.events[date];
    this.showForm = true;
    this.isEditing = true;
  }

  deleteEvent(date: string): void {
    delete this.events[date];
    localStorage.setItem('events', JSON.stringify(this.events));
    this.showMessage('Event deleted successfully.', 'success');
  }

  get allEventDates(): string[] {
    return Object.keys(this.events).sort();
  }
}