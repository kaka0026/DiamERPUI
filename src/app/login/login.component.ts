import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginService } from '../Services/login.service';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide = true;

  constructor(
    private LoginServ: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    if (localStorage.getItem("token") != null) {
      this.router.navigateByUrl('dashboard');
    } else {
      this.router.navigateByUrl('login');
    }
    this.loginForm = new FormGroup({
      UserId: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  ngOnInit(): void {
    this.spinner.hide();
  }

  onSubmit() {
    this.spinner.show();
    this.LoginServ.Login({ UserId: this.loginForm.value.UserId, Password: this.loginForm.value.password }).subscribe(LoginRes => {
      try {
        if (LoginRes.Success == 1) {
          localStorage.setItem('token', LoginRes.Data);
          this.spinner.hide();
          this.router.navigateByUrl('dashboard');
        } else if (LoginRes.Success == 2) {
          this.toastr.info('UserName or Password invalid');
          this.spinner.hide();
        } else if (LoginRes.Success == 3) {
          this.toastr.info('Please Enter Valid password');
          this.spinner.hide();
        } else if (LoginRes.Success == 4) {
          this.toastr.info('Sorry, Your Id Is DeActivated.');
          this.spinner.hide();
        } else if (LoginRes.Success == 5) {
          this.toastr.info('Username not found');
          this.spinner.hide();
        } else {
          this.toastr.info('UserName or Password invalid');
          this.spinner.hide();
        }
      } catch (err) {
        this.toastr.error(err);
        this.spinner.hide();
      }
    })
  }
}
