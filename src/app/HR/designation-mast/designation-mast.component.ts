import { Component, OnInit, ElementRef } from '@angular/core';
import { DesignationMastService } from "../../Services/HR/designation-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { TrackMastComponent } from '../../Masters/track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";

@Component({
  selector: 'app-designation-mast',
  templateUrl: './designation-mast.component.html',
  styleUrls: ['./designation-mast.component.css']
})
export class DesignationMastComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  CODE: any = "";
  SCODE: any = 0;
  NAME: any = "";
  chkIsActive: boolean = false;
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;

  constructor(
    public dialog: MatDialog,
    private DesignationMastSer: DesignationMastService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "DesignationMast.aspx"
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
        field: "Designation_Code",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Name",
        field: "Designation_Name",
        cellStyle: { "text-align": "center" },
        width: 600
      },
      {
        headerName: "Action",
        field: "Designation_Id",
        width: 400,
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
  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.CODE = eve.data.Designation_Code;
      this.NAME = eve.data.Designation_Name;
      this.SCODE = eve.data.Designation_Id;
      this.chkIsActive = eve.data.IsActive;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.Designation_Name + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            Designation_Id: eve.data.Designation_Id
          };
          this.DesignationMastSer.DesignationDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.Designation_Id, PageName: 'DesignationMast.aspx' } })
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
  add() {
    $("#addcontrol").css("display", "block");
    $("#add").css("display", "none");
  }
  List() {
    $("#addcontrol").css("display", "none");
    $("#add").css("display", "block");
  }
  Clear() {
    this.chkIsActive = false;
    this.CODE = "";
    this.NAME = "";
    if (this.NEWADD == true) {
      this.SCODE = 0;
    }
  }
  LoadGridData() {
    this.spinner.show();
    this.DesignationMastSer.DesignationFill({}).subscribe(Result => {
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
  Save() {

    if (this.NAME.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Name");
      return;
    }
    if (this.CODE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Code");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      Designation_Id: this.SCODE == 0 ? 0 : this.SCODE,
      Designation_Name: this.NAME,
      Designation_Code: this.CODE,
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.DesignationMastSer.DesignationSave(ResulObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.Clear();
          this.toastr.clear();
          this.toastr.success("Saved SuccessFully");
          this.LoadGridData();
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
  CheckCode() {
    if (this.CODE.trim() != "") {
      this.DesignationMastSer.DesignationCheck({ Designation_Code: this.CODE }).subscribe(Result => {
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
}
