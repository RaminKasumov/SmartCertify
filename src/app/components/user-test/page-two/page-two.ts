import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-page-two',
  imports: [],
  templateUrl: './page-two.html',
  styleUrl: './page-two.css',
})
export class PageTwo {
  @Input() course: Course | undefined | null = null;
  @Output() pageOneAccepted = new EventEmitter<number>();
  
  goBack(): void {
    this.pageOneAccepted.emit(1);
    console.log('Navigating back to the previous page');
    // Add navigation logic
  }

  startExam(): void {
    //trigger next page to start the exam
    this.pageOneAccepted.emit(3);
    console.log('Starting the exam');
    // Add navigation to the exam page logic
  }
}
