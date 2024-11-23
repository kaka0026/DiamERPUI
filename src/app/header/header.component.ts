import { Component, OnInit, DoCheck } from '@angular/core';
import { DashboardService } from '../Services/dashboard.service';
import { Router } from "@angular/router";
import { PermissionService } from "../Services/Access/permission.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DollarToINRService } from '../Services/Header/dollar-to-inr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from "../Services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  hide = true;
  Newhide = true;
  ReNewhide = true;
  pageTitle: any = "";

  OLDPASS: any = "";
  NEWPASS: any = "";
  REENTERPASS: any = "";

  DolToINR: any = '';

  PERARR = []
  GROUPARR = []

  constructor(
    private router: Router,
    private DollarToINRSer: DollarToINRService,
    private DashboardSer: DashboardService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private LoginSer: LoginService
  ) {
    this.pageTitle = "Dashboard";
  }



  ngOnInit(): void {
    this.DollarToINR();
    this.DashboardSer.sharedPageName$.subscribe((sharedPageName) => {
      try {
        this.pageTitle = sharedPageName ? sharedPageName : 'Dashboard';
      } catch (error) {
      }

    })

    this.PermissionSer.ActivePageWisePermissionFill({ USERID: this.decodedTkn.UserId }).subscribe(Result => {
      this.spinner.show();
      try {
        if (Result.Success == 1) {
          this.PERARR = Result.Data.map(item => {
            return item.PAGENAME;
          });
          this.GROUPARR = Result.Data.map(item => {
            return item.MAIN_PART
          });
          this.GROUPARR = this.GROUPARR.filter((element, i) => i === this.GROUPARR.indexOf(element))
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

  }
  CHECKPER(e: any): boolean {
    if (this.PERARR.filter(x => x == e).length == 0) {
      return false
    } else {
      return true
    }
  }
  CHECKTAB(e: any): boolean {
    if (this.GROUPARR.filter(x => x == e).length == 0) {
      return false
    } else {
      return true
    }
  }
  ngDoCheck() {
    this.spinner.hide();
  }
  AddTab(Page: any) {
    this.pageTitle = Page;
    this.DashboardSer.setData(Page);
  }
  LogOut() {
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }
  DollarToINR() {
    this.DollarToINRSer.GetINR().subscribe(Result => {
      try {
        this.DolToINR = "$ - ₹ :" + Result.rates.INR;
      } catch (error) {
      }

    })
  }
  changepass(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "Cross click") {
        this.OLDPASS = "";
        this.NEWPASS = "";
        this.REENTERPASS = "";
      }
    }, (reason) => {
      if (reason == 0) {
        this.OLDPASS = "";
        this.NEWPASS = "";
        this.REENTERPASS = "";
      }
      else if (reason == "Save click") {
        this.spinner.show();
        if (this.OLDPASS.trim() == "") {

          this.toastr.clear();
          this.toastr.error("Enter Old Password");
          this.spinner.hide();
          return
        }
        else if (this.NEWPASS.trim() == "") {

          this.toastr.clear();
          this.toastr.error("Enter New Password");
          this.spinner.hide();
          return
        }
        else if (this.REENTERPASS.trim() == "") {

          this.toastr.clear();
          this.toastr.error("Enter ReEnter Password");
          this.spinner.hide();
          return
        }

        let ObjResu = {
          UserID: this.decodedTkn.Emp_Email,
          OldPassowrd: this.OLDPASS
        }
        this.LoginSer.OldPasswordCheck(ObjResu).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              let ObjResul = {
                UserID: this.decodedTkn.Emp_Code,
                NewPassowrd: this.NEWPASS
              }
              this.LoginSer.ChangePassword(ObjResul).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.toastr.clear();
                    this.spinner.hide();
                    this.toastr.success("Password Saved SuccessFully!!!!!!");
                    this.OLDPASS = "";
                    this.NEWPASS = "";
                    this.REENTERPASS = "";

                  } else {
                    this.spinner.hide();
                    this.toastr.clear();
                    this.toastr.error("Something Went Wrong");
                  }
                } catch (err) {
                  this.spinner.hide();
                  this.toastr.clear();
                  this.toastr.error(err);
                }
              });

            } else {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error("Old Password Not Match");
            }
          } catch (err) {
            this.spinner.hide();
            this.toastr.clear();
            this.toastr.error(err);
          }
        });
      }
    });
  }
  comparepass() {
    if (this.REENTERPASS != this.NEWPASS) {
      this.spinner.hide();
      this.toastr.clear();
      this.toastr.error("Password Not Match");
      this.REENTERPASS = "";
    }
    this.spinner.hide();
  }
}
