import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { DataBindings } from './components/data-bindings/data-bindings';
import { Courses } from './components/courses/courses';
import { AgreementPage } from './components/user-test/agreement-page/agreement-page';
import { UserExams } from './components/user-test/user-exams/user-exams';
import { Exam } from './components/user-test/exam/exam';
import { GetExamFeedbackAndSubmit } from './components/user-test/get-exam-feedback-and-submit/get-exam-feedback-and-submit';
import { ViewResult } from './components/user-test/view-result/view-result';
import { VideoList } from './components/video-list/video-list';
import { CreateQuestionChoice } from './components/admin/create-question-choice/create-question-choice';
import { QuestionsList } from './components/admin/questions-list/questions-list';
import { canActivateGuard } from './guards/login.guard';
import { canActivateAdminGuard } from './guards/admin.guard';
import { UpdateProfile } from './components/users/update-profile/update-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./pages/contact-us/contact-us').then(
        (m) => m.ContactUsComponent
      ),
  },
  {
    path: 'courses',
    component: Courses,
  },
  {
    path: 'data-bindings',
    component: DataBindings,
  },
  {
    path: 'exam/start',
    component: AgreementPage,
    canActivate: [canActivateGuard],
  },
  {
    path: 'user-exams',
    component: UserExams,
    canActivate: [canActivateGuard],
  },
  { path: 'user/update-profile', component: UpdateProfile },
  { path: 'exam', component: Exam, canActivate: [canActivateGuard] },
  {
    path: 'exam/feedback',
    component: GetExamFeedbackAndSubmit,
    canActivate: [canActivateGuard],
  },
  {
    path: 'exam/view-result',
    component: ViewResult,
    canActivate: [canActivateGuard],
  },
  { path: 'videos', component: VideoList },
  {
    path: 'admin/question/list',
    component: QuestionsList,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'admin/question/create',
    component: CreateQuestionChoice,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'admin/question/edit/:id',
    component: CreateQuestionChoice,
    canActivate: [canActivateAdminGuard],
  },
  { path: '**', redirectTo: 'home' },
];
