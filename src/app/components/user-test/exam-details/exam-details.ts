import { Component, Input } from '@angular/core';
import { ExamResponse } from '../../../models/exam-models';
import { ExamService } from '../../../services/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './exam-details.html',
  styleUrls: ['./exam-details.css']
})
export class ExamDetails {
  examDetails: ExamResponse | null = null;
  @Input() examId: number = 0;
  @Input() showIsCorrectChoice = false;
  score: number = 0;
  isPassed: boolean = false;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.examService.getExamDetails(this.examId).subscribe((data) => {
      this.examDetails = data;
      this.calculateScore();
    });
  }

  calculateScore(): void {
    if (this.examDetails && this.examDetails.questions.length > 0) {
      const correctAnswers = this.examDetails.questions.filter(q => q.isCorrect).length;
      this.score = Math.round((correctAnswers / this.examDetails.questions.length) * 100);
      this.isPassed = this.score >= 60;
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge bg-success';
      case 'in progress':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  getDifficultyBadge(level: string): string {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'badge bg-primary';
      case 'intermediate':
        return 'badge bg-info text-dark';
      case 'advance':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
