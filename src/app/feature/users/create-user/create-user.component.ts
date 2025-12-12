import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './shared/services/users/users.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  @ViewChild('CreateUser', { static: true })
  createUserButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('createUserNameError', { static: true })
  createUserNameError!: ElementRef<HTMLButtonElement>;
  @ViewChild('createUserJobError', { static: true })
  createUserJobError!: ElementRef<HTMLButtonElement>;

  form: FormGroup;
  nameErrorMessage = '';
  jobErrorMessage = '';

  constructor(
    private readonly router: Router,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private userService: UsersService) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      job: new FormControl('', Validators.required),
    });
  }

  checkButtonAvaliabilty() {

    const nameControl = this.form.get('name');
    const jobControl = this.form.get('job');

    if (nameControl.invalid && (nameControl.dirty || nameControl.touched)) {
      if (nameControl.hasError('required')) {
        this.nameErrorMessage = 'Name is required';
      }
    } else {
      this.nameErrorMessage = '';
    }

    if (jobControl && (jobControl.dirty || jobControl.touched) && jobControl.hasError('required')) {
      this.jobErrorMessage = 'Job is required';
    } else {
      this.jobErrorMessage = '';
    }

    if (this.form.valid) {
      this.renderer.removeAttribute(this.createUserButton.nativeElement, 'disabled');
    }
  }

  createUser() {
    this.userService.createUser(
      this.form.get('name')?.value,
      this.form.get('job')?.value
    ).then(() => this.redirectToListUsers());
  }

  /**
   * Este método no se puede modificar
   * */
  public redirectToListUsers(): void {
    this.router.navigateByUrl('/users/list');
  }
}
