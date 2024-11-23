import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { PurmastService } from 'src/app/Services/Masters/purmast.service';
import * as $ from "jquery";
import Swal, * as _swal from "sweetalert2";
import PerfectScrollbar from "perfect-scrollbar";
import { TrackMastComponent } from '../track-mast/track-mast.component';

@Component({
  selector: 'app-purmast',
  templateUrl: './purmast.component.html',
  styleUrls: ['./purmast.component.css']
})
export class PurmastComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  chkIsActive: boolean = false;
  CODE: any = "";
  NAME: any = "";
  DCODE: number = 0;
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;

  constructor(
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private PermissionSer: PermissionService,
    private PurmastSer: PurmastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "DepartmentMast.aspx"
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
        field: "Purchase_Code",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Name",
        field: "Purchase_Name",
        cellStyle: { "text-align": "center" },
        width: 600
      },
      {
        headerName: "Action",
        field: "Purchase_Code",
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
      this.DCODE = eve.data.Purchase_Id;
      this.CODE = eve.data.Purchase_Code;
      this.NAME = eve.data.Purchase_Name;
      this.chkIsActive = eve.data.IsActive;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.Purchase_Code + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            Purchase_Id: eve.data.Purchase_Id
          }
          this.PurmastSer.PurchaseTypeDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.Purchase_Id, PageName: 'PurTypemast.aspx' } })
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
    this.DCODE = 0;
    if (this.NEWADD == true) {
      this.DCODE = 0;
    }
  }
  LoadGridData() {
    this.spinner.show();
    this.PurmastSer.PurchaseTypeFill({}).subscribe(Result => {
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
      USERID: this.decodedTkn.UserId,
      Purchase_Name: this.NAME,
      Purchase_Id: this.DCODE == 0 ? "" : this.DCODE,
      Purchase_Code: this.CODE,
      IsActive: this.chkIsActive
    };
    this.PurmastSer.PurchaseTypeSave(ResulObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          this.toastr.success("Saved SuccessFully");
          this.LoadGridData();
          this.Clear();
          this.DCODE = 0;
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
      this.PurmastSer.PurchaseTypeCheck({ Purchase_Code: this.CODE }).subscribe(Result => {
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
