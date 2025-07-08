import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserExam } from '../../../models/exam-models';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-sample-user-exams',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sample-user-exams.html',
  styleUrl: './sample-user-exams.css'
})
export class SampleUserExams {
  userExams: UserExam[] = [];
  userId: number = 0;

  constructor(private examService: ExamService, private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.userId;

    const userId = this.userId; // Replace with actual user ID
    this.examService.getUserExams(userId).subscribe((data) => {
      this.userExams = data;
    });
  }

  resumeExam(examId: number): void {
    this.router.navigate(['/exam'], { state: { examId }, queryParams: { examId } });
  }
  
}
