import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];

  // Method to add a notification
  addNotification(message: string): void {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift(); // Remove the notification after a delay
    }, 3000); // Adjust duration as needed
  }

  getNotifications(): string[] {
    return this.notifications;
  }
}
