import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ExamService } from '../../../services/exam.service';
import {
  ExamMetaData,
  QuestionDetails,
  QuestionStatus,
  StartExamRequest,
  UpdateUserQuestionChoice,
  UserExamQuestions,
} from '../../../models/exam-models';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { VideoScroll } from '../../video-scroll/video-scroll';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Course } from '../../../models/course';
import { CoursesService } from '../../../services/courses.service';
import hljs from 'highlight.js';

@Component({
  selector: 'app-start-exam',
  imports: [FormsModule, CommonModule, VideoScroll],
  templateUrl: './start-exam.html',
  styleUrls: ['./start-exam.css'],
})
export class StartExam implements OnInit, OnChanges, AfterViewChecked {
  showWarning = false;
  @Input() courseId: number = 0;
  @Input() existingExamId: number = 0;
  userId: number = 0;
  examMetaData: ExamMetaData | null = null; //has only examid and highlevel meta data, no questionids
  @Input() selectedCourse: Course | undefined | null = null;

  questionStatuses: QuestionStatus[] = [];

  userExamQuestions: UserExamQuestions[] = []; // we fill this based on questionid

  currentQuestionIndex: number = 0;
  selectedChoice: number | null = null;
  currentQuestionDetails: QuestionDetails | null = null;
  markForReview: boolean = false;
  isCodeChecked: boolean = false;

  selectedChoiceText: string = '';
  constructor(
    private loginService: LoginService,
    private examService: ExamService,
    private router: Router,
    private toastr: ToastrService,
    private courseService: CoursesService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectedChoiceText();
    if (this.existingExamId > 0) {
      this.getExamMetaData();
    }
  }

  ngOnInit(): void {
    this.loginService.claims$.subscribe(() => {
      this.userId = this.loginService.userId;

      if (this.existingExamId === 0) {
        this.startExam();
      } else {
        this.getExamMetaData();
      }
    });
  }

  getCourses() {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.selectedCourse = courses.find(
        (course) => course.courseId === this.examMetaData?.courseId
      );
    });
  }

  getExamMetaData() {
    this.examService
      .getExamMetaData(this.existingExamId)
      .pipe(
        catchError((error) => {
          console.error('Error retrieving exam metadata:', error);
          if (error.status === 404 || error.status === 403) {
            // Redirect to user-exams on specific errors
            this.router.navigate(['/user-exams']);
          }
          // Return an empty observable or alternative data to complete the stream
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Exam retrieved successfully!', response);
          this.examMetaData = response;
          this.getCourses();
          if (!this.examMetaData.finishedOn) {
            this.loadExamQuestions();
          } else {
            const config: Partial<IndividualConfig> = {
              closeButton: false,
              progressBar: true,
              positionClass: 'toast-top-full-width',
            };
            this.toastr.info(
              'Your Exam has completed already!.',
              'Exam Completed',
              config
            );
            this.router.navigate(['/user-exams']);
            //dont need to collect feedback of finished exam
            // this.router.navigate(['/exam/feedback'], {
            //   queryParams: { examId: this.examMetaData?.examId },
            // });
          }
        }
      });
  }

  get currentQuestion() {
    return this.userExamQuestions &&
      this.currentQuestionIndex >= 0 &&
      this.currentQuestionIndex < this.userExamQuestions.length
      ? this.userExamQuestions[this.currentQuestionIndex]
      : null;
  }

  startExam() {
    const request: StartExamRequest = {
      userId: this.userId,
      courseId: this.courseId,
    };

    //todo, handle errors and put user back to user-exams page or home page
    this.examService.startExam(request).subscribe((response) => {
      console.log('Exam started successfully!', response);
      this.examMetaData = response;
      this.loadExamQuestions();
    });
  }

  initializeQuestionStatuses() {
    this.questionStatuses = this.userExamQuestions.map((question) => ({
      questionId: question.questionId,
      status: question?.selectedChoiceId > 0 ? 'Answered' : 'Not Started',
    }));
  }

  loadExamQuestions() {
    const examIdToLoad: number =
      this.existingExamId > 0
        ? this.existingExamId
        : this.examMetaData?.examId || 0;
    if (examIdToLoad < 1) return;

    this.examService
      .getUserExamQuestions(examIdToLoad)
      .subscribe((response) => {
        this.userExamQuestions = response; // this holds the questions associated with that particular exam.
        console.log('Loaded user exam questions:', response);
        this.initializeQuestionStatuses();
        this.loadQuestion(
          this.userExamQuestions[this.currentQuestionIndex].questionId
        ); //we pass questionid to get its choices and question details
      });
  }

  loadQuestion(questionId: number) {
    if (!questionId || !this.userExamQuestions) return;

    const question = this.userExamQuestions.find(
      (q) => q.questionId === questionId
    );

    this.examService.getQuestionAndChoice(questionId).subscribe((response) => {
      this.currentQuestionDetails = response;

      //we need to wirte logic later to update this based on user choice // TODO
      this.selectedChoice = null;
      this.markForReview = false;

      if (question) {
        // Load the stored state for the question
        this.selectedChoice = question.selectedChoiceId ?? null;
        this.markForReview = question.reviewLater ?? false;
      }

      const questionStatus = this.questionStatuses.find(
        (qs) =>
          qs.questionId ===
          this.userExamQuestions[this.currentQuestionIndex].questionId
      );

      //if (questionStatus) questionStatus.status = 'In Progress';
    });
  }

  goToPreviousQuestion() {
    // Save current user's choice before navigating
    this.saveCurrentQuestionState();

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion(
        this.userExamQuestions[this.currentQuestionIndex].questionId
      );
    }
  }

  saveCurrentQuestionState() {
    // Save the current state of the question to the `userExamQuestions` array
    if (this.userExamQuestions[this.currentQuestionIndex]) {
      this.userExamQuestions[this.currentQuestionIndex].selectedChoiceId =
        this.selectedChoice || 0;
      this.userExamQuestions[this.currentQuestionIndex].reviewLater =
        this.markForReview;
    }
  }

  // submitAndNext() {
  //   if (!this.selectedChoice) {
  //     this.showWarning = true;
  //     return;
  //   }
  //   this.showWarning = false;

  //   if (this.selectedChoice !== null && this.examMetaData) {
  //     const userChoice: UpdateUserQuestionChoice = {
  //       examId: this.examMetaData.examId,
  //       examQuestionId:
  //         this.userExamQuestions[this.currentQuestionIndex].examQuestionId,
  //       selectedChoiceId: this.selectedChoice,
  //       reviewLater: this.markForReview,
  //     };

  //     this.examService.updateUserChoice(userChoice).subscribe(() => {
  //       //const currentStatus = this.markForReview ? 'Review Later' : 'Answered';
  //       const questionStatus = this.questionStatuses.find(
  //         (qs) =>
  //           qs.questionId ===
  //           this.userExamQuestions[this.currentQuestionIndex].questionId
  //       );

  //       if (questionStatus) questionStatus.status = 'Answered';

  //       this.saveCurrentQuestionState();

  //       if (this.currentQuestionIndex < this.userExamQuestions.length - 1) {
  //         this.currentQuestionIndex++;
  //         this.loadQuestion(
  //           this.userExamQuestions[this.currentQuestionIndex].questionId
  //         );
  //       } else {
  //         this.toastr.info('Exam completed. Submit for evaluation!');
  //         console.log('Exam completed. Submit for evaluation!');
  //         // Navigate to feedback page
  //         this.router.navigate(['/exam/feedback'], {
  //           queryParams: { examId: this.examMetaData?.examId },
  //         });
  //       }
  //     });
  //   }
  // }

  submitAndNext() {
    if (!this.selectedChoice) {
      // If no choice is selected, just move to the next question without updating
      this.showWarning = false; // Hide warning
      this.moveToNextQuestion();
      return;
    }
  
    this.showWarning = false;
  
    if (this.selectedChoice !== null && this.examMetaData) {
      const userChoice: UpdateUserQuestionChoice = {
        examId: this.examMetaData.examId,
        examQuestionId:
          this.userExamQuestions[this.currentQuestionIndex].examQuestionId,
        selectedChoiceId: this.selectedChoice,
        reviewLater: this.markForReview,
      };
  
      this.examService.updateUserChoice(userChoice).subscribe(() => {
        const questionStatus = this.questionStatuses.find(
          (qs) =>
            qs.questionId ===
            this.userExamQuestions[this.currentQuestionIndex].questionId
        );
  
        if (questionStatus) questionStatus.status = 'Answered';
  
        this.saveCurrentQuestionState();
        this.moveToNextQuestion();
      });
    }
  }
  
  private moveToNextQuestion() {
    if (this.currentQuestionIndex < this.userExamQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion(
        this.userExamQuestions[this.currentQuestionIndex].questionId
      );
    } else {
      this.toastr.info('Exam completed. Submit for evaluation!');
      console.log('Exam completed. Submit for evaluation!');
      this.router.navigate(['/exam/feedback'], {
        queryParams: { examId: this.examMetaData?.examId },
      });
    }
  }

  
  checkReviewStatus(questionId: number): boolean {
    return this.userExamQuestions.filter((f) => f.questionId === questionId)[0]
      .reviewLater;
  }

  splitQuestionText(questionText: string): { text: string; isCode: boolean }[] {
    const regex = /```([\s\S]*?)```/g;
    let result = [];
    let lastIndex = 0;

    questionText.replace(regex, (match, code, index) => {
      if (lastIndex < index) {
        result.push({
          text: questionText.substring(lastIndex, index),
          isCode: false,
        });
      }
      result.push({ text: code, isCode: true });
      lastIndex = index + match.length;
      return match;
    });

    if (lastIndex < questionText.length) {
      result.push({ text: questionText.substring(lastIndex), isCode: false });
    }

    return result;
  }

  isCodeQuestion(questionText: string | undefined): boolean {
    if (!questionText) return false;
    return questionText.includes('<code>') || questionText.includes('```');
  }

  ngAfterViewChecked(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }

updateSelectedChoiceText() {
    const selected = this.currentQuestionDetails?.choices.find(
        (c: any) => c.choiceId === this.selectedChoice
    );
    this.selectedChoiceText = selected ? selected.choiceText : '';
}

}
