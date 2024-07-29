import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  showError(message: string) {
    this.errorMessageSubject.next(message);
    setTimeout(() => this.clearError(), 7000);
  }

  clearError() {
    this.errorMessageSubject.next(null);
  }
}
