import { Component, OnInit, ElementRef } from '@angular/core';
import { StyleMastService } from "../../Services/DesignMast/style-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { TrackMastComponent } from '../../Masters/track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-style-mast',
  templateUrl: './style-mast.component.html',
  styleUrls: ['./style-mast.component.css']
})
export class StyleMastComponent implements OnInit {

  Category: FormControl;
  filteredCategory: Observable<any[]>;
  CategoryCode: any = "";
  lots: Lot1[] = [];
  CategoryName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  CategoryFillArr = [];
  chkIsActive: boolean = false;
  CODE: any = "";
  NAME: any = "";
  CATCODE: any = "";
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  Flag: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private PermissionSer: PermissionService,
    public dialog: MatDialog,
    private StyleMastSer: StyleMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.Category = new FormControl();

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "StyleMaster.aspx"
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
        headerName: "Category Name",
        field: "CATEGORY_NAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Style Name",
        field: "NAME",
        cellStyle: { "text-align": "center" },
        width: 600
      },
      {
        headerName: "Action",
        field: "M_CAT_Code",
        width: 400,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">';
          if (params.data.ISACTIVE == true) {
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
            html += '<div class="check"><button type="button" class="la la-remove" title="deactivate" value="Check" disabled></button></div>';
            if (_track == true) {
              html += '<div class="Track"><button type="button" class="la la-road" title="view track" value="Track" data-action-type="TrackUser"></button></div>'
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
    this.StyleMastSer.CatagoryFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.lots = Result.Data.map(item => {
            return {
              code: item.Category_Name,
              name: item.Category_Name,
              sortname: item.Initial
            };
          });
          this.filteredCategory = this.Category.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredCategorys(lot) : this.lots.slice()))
          );
          this.Category.valueChanges.subscribe(value => this.autocompletevalidation());
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.CATCODE = eve.data.STYLE_ID;
      this.CategoryCode = eve.data.CATEGORY_NAME;
      this.NAME = eve.data.NAME;
      this.chkIsActive = eve.data.ISACTIVE;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.NAME + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            STYLE_ID: eve.data.STYLE_ID
          }
          this.StyleMastSer.StyleMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.STYLE_ID, PageName: 'StyleMaster.aspx' } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
    }
  }
  autocompletevalidation() {
    const country = this.lots.find(c => c.name == this.Category.value);
    if (country) {
      this.Flag = true;
    } else {
      this.Flag = false;
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
      this.CATCODE = 0;
    }
    this.Category.setValue("");
  }
  LoadGridData() {
    this.spinner.show();
    this.StyleMastSer.StyleMastFill({}).subscribe(Result => {
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
    if (this.Category.value == null || this.Flag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Category");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      USERID: this.decodedTkn.UserId,
      NAME: this.NAME,
      STYLE_ID: this.CATCODE == 0 ? 0 : this.CATCODE,
      CATEGORY_NAME: this.Category.value.toString(),
      ISACTIVE: this.chkIsActive
    };
    this.StyleMastSer.StyleMastSave(ResulObj).subscribe(Result => {
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
  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Category.setValue("");
      this.CategoryCode = ""
    }
    return a;
  }
}
