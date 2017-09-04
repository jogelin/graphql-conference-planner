import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { unsubscribeAll } from '../../utils';
import { Router } from '@angular/router';
import { AuthenticationValidators } from '../authentication.validators';
import 'rxjs/add/observable/empty';
import { Apollo } from 'apollo-angular';
import { RegisterUserMutation } from 'app/authentication/authentication.apollo-query';


@Component({
  selector: 'cp-register-component',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {

  publicName: string;
  alreadyExist = false;
  subscriptions: Subscription[] = [];
  registerForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, private apollo: Apollo) {
  }

  ngOnInit(): void {
    const defaultValue = '';
    const validatePasswordConfirmation = AuthenticationValidators.validatePasswordConfirmation;

    this.registerForm = this.fb.group({
      username: [defaultValue, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      publicName: [defaultValue, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      picture: [defaultValue, [Validators.required, Validators.maxLength(250), Validators.pattern(/^http/)]],
      email: [defaultValue, [Validators.required, Validators.maxLength(100), Validators.email]],
      password: [defaultValue, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      passwordConfirmation: [defaultValue, [Validators.required, Validators.maxLength(250), validatePasswordConfirmation]],
      bio: [defaultValue, [Validators.required]],
    });
  }

  submit() {
    const {passwordConfirmation, ...userData} = this.registerForm.value;

    const registerUserMutation$ = this.apollo.mutate({
      mutation: RegisterUserMutation,
      variables: {
        ...userData,
        authProvider: {
          email: {
            email: userData.email,
            password: passwordConfirmation
          }
        }
      }
    }).subscribe(({data}) => {
      this.alreadyExist = false;
      this.publicName = this.registerForm.get('publicName').value;
      this.navigateToHome();
    }, error => {
      this.alreadyExist = true;
    });

    this.subscriptions = this.subscriptions.concat(registerUserMutation$);
  }

  navigateToHome() {
    this.router.navigate(['/authentication/login']);
  }


  ngOnDestroy(): void {
    unsubscribeAll(this.subscriptions);
  }
}
