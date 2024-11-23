import { Component, OnInit, ElementRef } from '@angular/core';
import { MaterialCatService } from "../../Services/Masters/material-cat.service";
import { PermissionService } from "../../Services/Access/permission.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { TrackMastComponent } from '../track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-material-cat',
  templateUrl: './material-cat.component.html',
  styleUrls: ['./material-cat.component.css']
})
export class MaterialCatComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  TypeOfGood: FormControl = new FormControl();
  PurchaseTypeOfGood: FormControl = new FormControl();

  chkIsActive: boolean = false;
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  CODE: any = "";
  NAME: any = "";
  CATCODE: any = "";
  TypeGoodArr = [];
  PurchaseTypeGoodArr = [];

  constructor(
    public dialog: MatDialog,
    private MaterialCatMastSer: MaterialCatService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.MaterialCatMastSer.TypeGoodFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.TypeGoodArr = Result.Data.map(item => {
            return { ID: item.ID, Name: item.Type_Good };
          });
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.MaterialCatMastSer.PurchaseTypeGoodFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.PurchaseTypeGoodArr = Result.Data.map(item => {
            return { ID: item.ID, Name: item.Type_Good };
          });
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "MaterialCategory.aspx"
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
        field: "M_CAT_SortName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Name",
        field: "M_CAT_Name",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Type Of Good",
        field: "Type_Good",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Purchase Type Of Good",
        field: "Purchase_Type_Good",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Action",
        field: "M_CAT_Code",
        width: 400,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">';
          if (params.data.IsActive == true) {
            if (_edit == true) {
              html += '<div class="updateuser"><button type="button" value="Update" title="UPDATE" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';
            }
            if (_delete == true) {
              html += '<div class="delete"> <button  type="button" class="la la-trash" title="DELETE" value="Delete" data-action-type="DeleteUser"></button></div>'
            }
            html += '<div class="check"><button type="button" class="la la-check" title="TRUE" value="Check" disabled></button></div>';
            if (_track == true) {
              html += '<div class="Track"><button type="button" class="la la-road" title="TRACK" value="Track" data-action-type="TrackUser"></button></div>'
            }
            return html + '</div>';
          }
          else {
            if (_edit == true) {
              html += '<div class="updateuser"><button type="button" value="Update" title="UPDATE" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';
            }
            if (_delete == true) {
              html += '<div style="color: #f44336;" class="delete"><button type="button" title="DELETE" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div> '
            }
            html += '<div class="check"><button type="button" class="la la-remove" title="FLASE" value="Check" disabled></button></div>';
            if (_track == true) {
              html += '<div class="Track"><button type="button" class="la la-road" title="TRACK" value="Track" data-action-type="TrackUser"></button></div>'
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
      this.CATCODE = eve.data.M_CAT_Code;
      this.CODE = eve.data.M_CAT_SortName;
      this.NAME = eve.data.M_CAT_Name;
      this.chkIsActive = eve.data.IsActive;
      this.TypeOfGood.setValue(eve.data.Type_Good);
      this.PurchaseTypeOfGood.setValue(eve.data.Purchase_Type_Good);
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.M_CAT_Name + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            M_CAT_Code: eve.data.M_CAT_Code
          }
          this.MaterialCatMastSer.MaterialMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.M_CAT_Code, PageName: 'MaterialCategory.aspx' } })
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
    $("#addcontrol1").css("display", "block");
    $("#add").css("display", "none");
  }
  List() {
    $("#addcontrol").css("display", "none");
    $("#addcontrol1").css("display", "none");
    $("#add").css("display", "block");
  }
  Clear() {
    this.chkIsActive = false;
    if (this.NEWADD == true) {
      this.CATCODE = 0;
    }
    this.CODE = "";
    this.NAME = "";
    this.TypeOfGood.setValue('');
    this.PurchaseTypeOfGood.setValue('');
  }
  LoadGridData() {
    this.spinner.show();
    this.MaterialCatMastSer.MaterialMastFill({}).subscribe(Result => {
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
    if (this.TypeOfGood.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select TypeOfGood");
      return;
    }
    if (this.TypeOfGood.value.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select TypeOfGood");
      return;
    }
    if (this.PurchaseTypeOfGood.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select PurchaseTypeOfGood");
      return;
    }
    if (this.PurchaseTypeOfGood.value.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select PurchaseTypeOfGood");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      USERID: this.decodedTkn.UserId,
      M_CAT_Name: this.NAME,
      M_CAT_Code: this.CATCODE == "" ? "" : this.CATCODE,
      M_CAT_SortName: this.CODE,
      Type_Good: this.TypeOfGood.value.toString(),
      Purchase_Type_Good: this.PurchaseTypeOfGood.value.toString(),
      IsActive: this.chkIsActive
    };
    this.MaterialCatMastSer.MaterialMastSave(ResulObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          this.toastr.success("Saved SuccessFully");
          this.LoadGridData();
          this.Clear();
          this.CATCODE = "";
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
      this.MaterialCatMastSer.MaterialMastCheck({ M_SortName: this.CODE }).subscribe(Result => {
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
