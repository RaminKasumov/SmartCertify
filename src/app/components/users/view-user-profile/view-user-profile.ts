import { Component, Input, input, OnInit } from '@angular/core';
import { UserModel } from '../../../models/usermodel';
import { UserProfileService } from '../../../services/user-profile.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './view-user-profile.html',
  styleUrl: './view-user-profile.css',
})
export class ViewUserProfile implements OnInit {
  @Input() userId = 0;

  user: UserModel = {
    userId: 0,
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    adObjId: '',
    profileImageUrl: '',
    bio: '',
  };

  constructor(private userService: UserProfileService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.userId$.subscribe((id) => {
      this.userId = id; // Update user ID when login service emits new value
      this.getUserProfile();
    });
  }

  getUserProfile() {
    // Fetch user data, for now using static values for demo
    this.userService.getUserProfile(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.user.bio = this.user.bio?.replace(/\n/g, '<br>');
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
      },
    });
  }
}
