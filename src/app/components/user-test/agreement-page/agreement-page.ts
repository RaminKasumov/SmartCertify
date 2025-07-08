import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageOne } from '../page-one/page-one';
import { CoursesService } from '../../../services/courses.service';
import { Course } from '../../../models/course';
import { PageTwo } from '../page-two/page-two';
import { StartExam } from "../start-exam/start-exam";

@Component({
  selector: 'app-agreement-page',
  imports: [FormsModule, CommonModule, PageOne, PageTwo, StartExam],
  templateUrl: './agreement-page.html',
  styleUrl: './agreement-page.css',
})
export class AgreementPage implements OnInit {
  userId: number = 0;
  courseId: number = 0;
  courses: Course[] = [];
  selectedCourse: Course | undefined | null = null;
  currentPage = 1;

  ngOnInit(): void {
    this.userId = +(sessionStorage.getItem('userId') || '0');
    this.courseId = +(sessionStorage.getItem('courseId') || '0');
    this.loadCourses();
  }

  modalRef?: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private courseService: CoursesService
  ) {}

  // Proceed to the next page
  proceedToNextPage(): void {
    const userId = this.userId; // Hardcoded user ID for now
    const courseId = 101; // Example course ID
    sessionStorage.setItem('userId', userId.toString());
    sessionStorage.setItem('courseId', courseId.toString());
    this.router.navigate(['/start-a-test']);
  }

  fromPage(pageNumber: any) {
    this.currentPage = +pageNumber;
    console.log(`From page ${+pageNumber}`);
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
      let course = this.courses.find((c) => c.courseId === this.courseId);
      this.selectedCourse = course;
    });
  }
}
