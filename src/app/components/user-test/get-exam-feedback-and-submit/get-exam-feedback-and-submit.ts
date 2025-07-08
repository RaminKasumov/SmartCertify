import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { ExamFeedback } from '../../../models/exam-models';
import { ExamDetails } from "../exam-details/exam-details";

@Component({
  selector: 'app-get-exam-feedback-and-submit',
  imports: [FormsModule, CommonModule, ExamDetails],
  templateUrl: './get-exam-feedback-and-submit.html',
  styleUrl: './get-exam-feedback-and-submit.css',
})
export class GetExamFeedbackAndSubmit {
  feedbackText = '';
  examId: number = 0;
  showCertificate = false;

  constructor(
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Get examId from query parameters
    this.route.queryParams.subscribe((params) => {
      this.examId = params['examId'];
    });
  }

  finishExam() {
    if (this.feedbackText.trim() === '') {
      const config: Partial<IndividualConfig> = {
        positionClass: 'toast-top-full-width', // Custom position for centering
      };

      this.toastr.warning(
        'Please provide your feedback before finishing the exam.',
        'Warning',
        config
      );
      return;
    }

    const feedbackPayload: ExamFeedback = {
      examId: +this.examId,
      feedback: this.feedbackText,
    };

    this.examService.submitFeedback(feedbackPayload).subscribe(
      (response) => {
        this.toastr.info('Thank you for your feedback! Exam completed.');
        
        this.showCertificate = true;
      },
      (error) => {
        this.toastr.error('Error submitting feedback:', error);
      }
    );
  }

  goBackToExam() {
    this.router.navigate(['/exam'], { queryParams: { examId: this.examId } });
  }

  navigateToUserExams(): void {
    this.router.navigate(['/user-exams']); // Replace with the route you want to navigate to
}
}