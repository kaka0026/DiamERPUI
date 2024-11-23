import { Component, OnInit, ElementRef } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import Swal, * as _swal from "sweetalert2";
import { EmployeeService } from "../../Services/HR/employee.service";
import { TrackMastComponent } from '../../Masters/track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Lot {
  name: string;
  code: string;
}

export interface Lot1 {
  name: string;
  code: string;
}

export interface Lot2 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  Department: FormControl;
  filteredlots: Observable<any[]>;
  DepartmentCode: any = "";
  lots: Lot[] = [];
  lotName: any = '';

  Designation: FormControl;
  filteredDesignation: Observable<any[]>;
  DesignationCode: any = "";
  lots1: Lot1[] = [];
  DesignationName: any = '';

  Category: FormControl;
  hideEmp = true;
  filteredCategory: Observable<any[]>;
  CategoryCode: any = "";
  lots2: Lot2[] = [{ code: 'SA', name: "SUPER ADMIN" }, { code: 'A', name: "ADMIN" }, { code: 'U', name: "USER" }];
  CategoryName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  NAME: any = '';
  chkIsActive: boolean = false;
  ECODE: number = 0;
  CODE: any = '';
  EMAIL: any = '';
  PASS: any = '';
  DepartmentArr = [];
  DesignationArr = [];
  CatName: any = '';
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  CategoryFlag: boolean = false;
  DesignationFlag: boolean = false;
  DepartmentFlag: boolean = false;

  constructor(
    private EmployeeSer: EmployeeService,
    private PermissionSer: PermissionService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {

    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.Department = new FormControl();
    this.Designation = new FormControl();
    this.Category = new FormControl();
    this.filteredCategory = this.Category.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredCategorys(lot) : this.lots2.slice()))
    );
    this.Category.valueChanges.subscribe(value => this.autocompletevalidation("Category"));
    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "EmpMast.aspx"
    }
    let _edit;
    let _delete;
    let _track;
    this.PermissionSer.PageWisePermissionFill(ObjResult).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].ISNEWADD == "False") {
            this.NEWADD = false;
          } else {
            this.NEWADD = true;
          }
          if (Result.Data[0].ISEDIT == "False") {
            this.EDIT = false;
          } else {
            this.EDIT = true;
          }
          _edit = this.EDIT;
          if (Result.Data[0].ISDELETE == "False") {
            this.DELETE = false;
          } else {
            this.DELETE = true;
          }
          _delete = this.DELETE;
          if (Result.Data[0].ISVIEW == "False") {
            $("#grid").hide();
          }
          if (Result.Data[0].ISACTIVEDEACTIVE == "False") {
            this.CHECK = false;
          } else {
            this.CHECK = true;
          }
          if (Result.Data[0].ISTRACK == "False") {
            this.TRACK = false;
          } else {
            this.TRACK = true;
          }
          _track = this.TRACK;
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });
    this.columnDefs = [
      {
        headerName: "Code",
        field: "Emp_Code",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Name",
        field: "Emp_Name",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Email",
        field: "Emp_Email",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "DepartMent",
        field: "Dept_Name",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Designation",
        field: "Designation_Name",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Action",
        field: "Dept_Code",
        width: 300,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">';
          if (params.data.IsActive == true) {
            if (_edit == true) {
              html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';
            }
            if (_delete == true) {
              html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
            }
            html += '<div class="check"><button type="button" title="activate" class="la la-check" value="Check" disabled></button></div>';
            if (_track == true) {
              html += '<div class="Track"><button type="button" title="view track" class="la la-road" value="Track" data-action-type="TrackUser"></button></div>'
            }
            return html + '</div>';
          }
          else {
            if (_edit == true) {
              html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';
            }
            if (_delete == true) {
              html += '<div style="color: #f44336;" class="delete"><button type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div> '
            }
            html += '<div class="check"><button type="button" title="deactivate" class="la la-remove" value="Check" disabled></button></div>';
            if (_track == true) {
              html += '<div class="Track"><button type="button" title="view track" class="la la-road" value="Track" data-action-type="TrackUser"></button></div>'
            }
            return html + '</div>';
          }
        }
      }
    ];

    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {
    this.spinner.show();
    this.EmployeeSer.DepartmentFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.lots = Result.Data.map(item => {
            return {
              code: item.Dept_Id,
              name: item.Dept_Name,
              sortname: item.Dept_Code
            };
          });
          this.filteredlots = this.Department.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filterlots(lot) : this.lots.slice()))
          );
          this.Department.valueChanges.subscribe(value => this.autocompletevalidation("Department"));
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.clear();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.EmployeeSer.DesignationFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.lots1 = Result.Data.map(item => {
            return {
              code: item.Designation_Id,
              name: item.Designation_Name,
              sortname: item.Designation_Code
            };
          });
          this.filteredDesignation = this.Designation.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filterDesignations(lot) : this.lots1.slice()))
          );
          this.Designation.valueChanges.subscribe(value => this.autocompletevalidation("Designation"));
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.clear();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.clear();
        this.toastr.error(err);
      }
    });
  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#addcontrol1").css("display", "block");
      $("#add").css("display", "none");
      $("#code").attr("disabled", "true");
      $("#pass").attr("disabled", "true");
      this.ECODE = eve.data.Emp_Id;
      this.CODE = eve.data.Emp_Code;
      this.NAME = eve.data.Emp_Name;
      this.EMAIL = eve.data.Emp_Email;
      this.chkIsActive = eve.data.IsActive;
      this.DepartmentCode = eve.data.Dept_Name;
      this.DesignationCode = eve.data.Designation_Name;
      if (eve.data.Cat == "A") {
        this.CategoryCode = "Admin";
      } else if (eve.data.Cat = "SA") {
        this.CategoryCode = "Super Admin";
      } else {
        this.CategoryCode = "User";
      }
      //this.Category = new FormControl(eve.data.Cat);
      $("#text").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.Emp_Code + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            Emp_Id: eve.data.Emp_Id
          }
          this.EmployeeSer.EmployeeDelete(resultObj).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.toastr.success("Deleted Successfully", "SUCCESS");
                this.LoadGridData();
              } else {
                this.spinner.hide();
                this.toastr.clear();
                this.toastr.info("Data not found");
              }
            } catch (err) {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.LoadGridData();
        }
      });
    }
    if (actionType == "TrackUser") {
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.Emp_Id, PageName: 'EmpMast.aspx' } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData();
    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-viewport');
    const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-horizontal-scroll-viewport');
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    if (agBodyHorizontalViewport) {
      const ps = new PerfectScrollbar(agBodyHorizontalViewport);
      ps.update();
    }
  }
  LoadGridData() {
    this.spinner.show();
    this.EmployeeSer.EmployeeFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  add() {
    $("#addcontrol").css("display", "block");
    $("#addcontrol1").css("display", "flex");
    $("#add").css("display", "none");
  }
  List() {
    $("#addcontrol").css("display", "none");
    $("#addcontrol1").css("display", "none");
    $("#add").css("display", "block");
  }
  autocompletevalidation(auto) {
    if (auto == "Category") {
      const country = this.lots2.find(c => c.name == this.Category.value);
      if (country) {
        this.CategoryFlag = true;
      } else {
        this.CategoryFlag = false;
      }
    }
    if (auto == "Designation") {
      const country = this.lots1.find(c => c.name == this.Designation.value);
      if (country) {
        this.DesignationFlag = true;
      } else {
        this.DesignationFlag = false;
      }
    }
    if (auto == "Department") {
      const country = this.lots.find(c => c.name == this.Department.value);
      if (country) {
        this.DepartmentFlag = true;
      } else {
        this.DepartmentFlag = false;
      }
    }
  }
  Save() {
    if (this.CODE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Code");
      return;
    }

    if (this.NAME.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Name");
      return;
    }

    if (this.EMAIL.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Email");
      return;
    }
    if (this.Department.value.toString() == "" || this.Department.value == null || this.DepartmentFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Department");
      return;
    }
    if (this.Designation.value.toString() == "" || this.Designation.value == null || this.DesignationFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Designation");
      return;
    }
    if (this.Category.value.toString() == "" || this.Category.value == null || this.CategoryFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Catogry");
      return;
    }
    if (this.Category.value.toString() == "Admin") {
      this.CatName = "A";
    } else if (this.Category.value.toString() == "Super Admin") {
      this.CatName = "SA";
    } else {
      this.CatName = "U";
    }
    this.spinner.show();
    let ResulObj = {
      Emp_Id: this.ECODE == 0 ? 0 : this.ECODE,
      Emp_Code: this.CODE,
      Emp_Name: this.NAME,
      Emp_Email: this.EMAIL,
      Designation_Name: this.Designation.value.toString(),
      Dept_Name: this.Department.value.toString(),
      Cat: this.CatName,
      Emp_Pass: this.PASS,
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.EmployeeSer.EmployeeSave(ResulObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.Clear();
          this.toastr.clear();
          this.toastr.success("Saved SuccessFully");
          this.LoadGridData();
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
  Clear() {
    $("#code").removeAttr("disabled");
    $("#pass").removeAttr("disabled");
    this.CODE = "";
    this.NAME = "";
    this.EMAIL = "";
    this.Department.setValue("");
    this.Designation.setValue("");
    this.Category.setValue("");
    this.PASS = "";
    this.CatName = "";
    this.chkIsActive = false;
    if (this.NEWADD == true) {
      this.ECODE = 0;
    }
  }
  CheckCode() {
    if (this.CODE != "") {
      this.EmployeeSer.EmployeeCheck({ Emp_Code: this.CODE }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            Swal.fire({
              title: "Already this code exists!",
              icon: "warning",
              confirmButtonText: "OK"
            }).then(result => {
              if (result.value) {
                this.CODE = "";
              }
            });
          }
        } catch (err) {
          this.toastr.clear();
          this.toastr.error(err);
        }
      });
    }
  }
  filterlots(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Department.setValue("");
      this.DepartmentCode = ""
    }
    return a;
  }

  filterDesignations(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots1.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Designation.setValue("");
      this.DesignationCode = ""
    }
    return a;
  }

  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots2.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Category.setValue("");
      this.CategoryCode = ""
    }
    return a;
  }
  validEmailcheck() {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.toastr.clear();
    if (re.test(this.EMAIL)) {
    } else {
      this.toastr.warning("Enter Valid Email Address", "E-maill");
      this.EMAIL = "";
    }
  }
}
