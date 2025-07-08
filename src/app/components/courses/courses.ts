import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { TechFilter } from '../tech-filter/tech-filter';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, TechFilter],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  courses: Course[] = [];
  onlyAvailableTest = false;
  userId: number = 0;
  technologySelected: string = 'Azure'; // Default selected technology
  techData = [
    { name: 'Angular', image: '../../../assets/technologies/angular.svg' },
    { name: 'React', image: '../../../assets/technologies/react.svg' },
    { name: 'Azure', image: '../../../assets/technologies/azure.svg' },
    {
      name: '.Net Core',
      image: '../../../assets/technologies/dotnet-core.svg',
    },
    {
      name: 'Javascript',
      image: '../../../assets/technologies/javascript.svg',
    },
    { name: 'Java', image: '../../../assets/technologies/java.svg' },
    { name: 'SQL', image: '../../../assets/technologies/sql.svg' },
    {
      name: 'React Native',
      image: '../../../assets/technologies/react-native.svg',
    },
    { name: 'AWS', image: '../../../assets/technologies/aws.svg' },
    { name: 'Docker', image: '../../../assets/technologies/docker.svg' },
  ]; // List of technologies with names and images
  filteredCourses: Course[] = [];

  constructor(
    private courseService: CoursesService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.userId = this.loginService.userId;
  }

  onTechSelected(tech: string): void {
    console.log(`${tech} selected`);
    this.technologySelected = tech;
    this.applyFilters();
  }

  applyFilters(): void {
    // Base filter: Filter courses by selected technology
    let filtered = this.courses.filter((course) =>
      course.title
        .toLocaleLowerCase()
        .startsWith(this.technologySelected.toLocaleLowerCase())
    );

    // Additional filter: Show only available tests if toggle is active
    if (this.onlyAvailableTest) {
      filtered = filtered.filter((course) => course.questionsAvailable);
    }

    this.filteredCourses = filtered;
  }

  getCoursesForTech(tech: string): Course[] {
    return this.courses.filter((course) =>
      course.title.toLocaleLowerCase().startsWith(tech.toLocaleLowerCase())
    );
  }

  filterAvailableTests() {
    if (this.onlyAvailableTest) {
      this.filteredCourses = this.courses.filter(
        (course) =>
          course.questionsAvailable == this.onlyAvailableTest &&
          course.title
            .toLocaleLowerCase()
            .startsWith(this.technologySelected.toLocaleLowerCase())
      );
    }
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
      this.applyFilters(); // Initialize filtered courses
    });
  }

  startTest(courseId: number): void {
    console.log(`Start test for course ID: ${courseId}`);

    // Store data in session storage or local storage
    sessionStorage.setItem('userId', this.userId.toString());
    sessionStorage.setItem('courseId', courseId.toString());

    // Navigate to the start-a-test route
    this.router.navigate(['/exam/start']);
  }
}
