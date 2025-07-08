import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { ExamFeedback } from '../../../models/exam-models';
import { ExamService } from '../../../services/exam.service';
import { ExamDetails } from "../exam-details/exam-details";

@Component({
  selector: 'app-view-result',
  imports: [ExamDetails],
  templateUrl: './view-result.html',
  styleUrl: './view-result.css'
})
export class ViewResult {
  examId: number = 0;
  showCertificate = false;

  constructor(
    private route: ActivatedRoute
  ) {
    // Get examId from query parameters
    this.route.queryParams.subscribe((params) => {
      this.examId = params['examId'];
    });
  }

}
