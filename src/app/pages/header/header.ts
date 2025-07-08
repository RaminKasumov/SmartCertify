import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService,
} from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
  PopupRequest,
  AuthenticationResult,
  InteractionType,
} from '@azure/msal-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Claim } from '../../models/claim';
import { LoginService } from '../../services/login.service';
import { b2cPolicies } from '../../app.config';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isIframe = false;
  loginDisplay = false;
  isAdmin = false;
  private readonly _destroying$ = new Subject<void>();
  claims: Claim[] = [];
  profilePictureUrl = '';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loginService.claims$.subscribe((s: any[]) => {
      const roles = s.filter((f) => f.claim === 'extension_userRoles');

      this.getUserInfo();
      setInterval(() => {
        this.getUserInfo();
      }, 30000);

      if (roles.length && !this.isAdmin) {
        this.isAdmin =
          roles[0].value.split(',').filter((f: string) => f === 'Admin').length > 0;
      }
    });

    this.authService
      .handleRedirectObservable()
      .subscribe((result: AuthenticationResult) => {
        if (result) {
          const redirectStartPage = localStorage.getItem('redirectStartPage'); // Retrieve the URL from local storage
          if (redirectStartPage) {
            this.router.navigate([redirectStartPage]);
            localStorage.removeItem('redirectStartPage'); // Clear the URL from local storage
          }
        }
      });

    //this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    //To subscribe for claims
    this.loginService.claims$.subscribe((c: Claim[]) => {
      this.claims = c;
    });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

  editProfile() {
    let editProfileFlowRequest: RedirectRequest | PopupRequest = {
      authority: b2cPolicies.authorities.editProfile.authority,
      scopes: [],
    };

    this.login(editProfileFlowRequest);
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup({
            ...this.msalGuardConfig.authRequest,
            ...userFlowRequest,
          } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService
          .loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
          ...userFlowRequest,
        } as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  getUserInfo() {
    if (this.loginService.userId && this.loginService.userId > 0) {
      this.userService
        .getUserProfile(this.loginService.userId)
        .subscribe((s: any) => {
          this.profilePictureUrl = s.profileImageUrl ? s.profileImageUrl : '';
        });
    }
  }
}
