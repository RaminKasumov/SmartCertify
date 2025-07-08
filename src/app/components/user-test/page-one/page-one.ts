import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-page-one',
  imports: [],
  templateUrl: './page-one.html',
  styleUrl: './page-one.css',
})
export class PageOne {
  modalRef?: BsModalRef;
  message?: string;
  @Output() pageOneAccepted = new EventEmitter<number>();
  
  constructor(private modalService: BsModalService, private router: Router) {}

  openDisagreeModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  proceedToNextPage() {
    console.log('Proceeding to the next page');
    //Emit event to show second page
    this.pageOneAccepted.emit(2);
  }

  // Handle exiting the application
  exitApplication(): void {
    console.log('User exited the application');
    this.closeDisagreeModal();
    this.router.navigate(['/courses']);
    // Redirect to an exit page or perform any necessary action
  }

  closeDisagreeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

}
