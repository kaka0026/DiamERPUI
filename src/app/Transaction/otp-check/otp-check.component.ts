import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from 'src/app/Services/login.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-check',
  templateUrl: './otp-check.component.html',
  styleUrls: ['./otp-check.component.css']
})
export class OtpCheckComponent implements OnInit {
  timer: number;
  destroy = new Subject();
  rxjsTimer = timer(1000, 1000);
  resend = false;
  TIMER = true;
  emailotp: any = "";
  otp: string;
  showOtpComponent = true;
  EMAIL = "";
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private LoginSer: LoginService,
    private _mdr: MatDialogRef<OtpCheckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.emailotp = data.OTP;
    this.EMAIL = data.EMAIL;
    this.LoginSer.SendOTPNumberEmail({ OTP: this.emailotp, email1: this.EMAIL }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.info("OTP Send SuccessFully");
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => {
            this.timer = val;
            if (this.timer === 60) {
              this.destroy.next();
              this.emailotp = "";
              this.TIMER = false;
              this.resend = true
            }
          })
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
  }
  onOtpChange(otp) {
    this.otp = otp;
  }
  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  setVal(val) {
    this.ngOtpInput.setValue(val);
  }
  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  RESEND() {
    this.resend = false;
    this.TIMER = true;
    this.emailotp = Math.floor(1000 + Math.random() * 9000);
    this.LoginSer.SendOTPNumberEmail({ OTP: this.emailotp, email1: this.EMAIL }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.info("OTP Send SuccessFully");
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => {
            this.timer = val;

            if (this.timer === 60) {
              this.destroy.next();
              this.destroy.complete();
              this.emailotp = "";
              this.TIMER = false;
              this.resend = true
            }
          })
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }
  close() {
    this._mdr.close('false');
  }
  Verify() {
    if (this.otp == this.emailotp) {
      this._mdr.close('true');
      this.destroy.next();
      this.destroy.complete();
    } else {
      this.toastr.info("OTP Not match");
    }
  }
}
