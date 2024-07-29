import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notificacion.service';

@Component({
  selector: 'alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrl: './alert-notification.component.css'
})
export class AlertNotificationComponent implements OnInit {
  errorMessage: string | null = null;
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.errorMessage$.subscribe(message => {
      this.errorMessage = message;
    });

  }

}
