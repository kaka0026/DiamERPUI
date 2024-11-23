import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MaterialMastService } from "../../Services/Masters/material-mast.service";
import { ToastrService } from "ngx-toastr";
import { PermissionService } from "../../Services/Access/permission.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { FormControl } from '@angular/forms';
import { TrackMastComponent } from '../track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

export interface Lot {
  id: string;
  name: string;
}

@Component({
  selector: 'app-material-mast',
  templateUrl: './material-mast.component.html',
  styleUrls: ['./material-mast.component.css']
})
export class MaterialMastComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  chkIsActive: boolean = false;
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  CODE: any = "";
  NAME: any = "";
  CATCODE: any = "";
  CCODE: any = "";
  MaterialCatList = [];

  Materials: Lot[] = [];
  Material: FormControl = new FormControl();
  MaterialMultiFilterCtrl: FormControl = new FormControl();
  filteredMaterialMulti: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;
  _onDestroy = new Subject<void>();

  constructor(
    private PermissionSer: PermissionService,
    public dialog: MatDialog,
    private MaterialMastSer: MaterialMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.filteredMaterialMulti.next(this.Materials.slice());
    this.MaterialMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaterialsMulti();
      });

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "MaterialMast.aspx"
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
        field: "M_SortName",
        cellStyle: { "text-align": "center" },
        width: 80
      },
      {
        headerName: "Name",
        field: "M_Name",
        cellStyle: { "text-align": "center" },
        width: 400
      },
      {
        headerName: "Category",
        field: "M_CAT_Name",
        cellStyle: { "text-align": "center" },
        width: 400
      },
      {
        headerName: "Action",
        field: "M_CAT_Code",
        width: 250,
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
    this.spinner.show();
    this.MaterialMastSer.MaterialDDL({}).subscribe(Result => {

      try {
        if (Result.Success == 1) {
          this.MaterialCatList = Result.Data.map(item => {
            return { name: item.M_CAT_Name, id: item.M_CAT_Code.toString() };
          });
          this.Materials = this.MaterialCatList;
          this.filterMaterialsMulti();
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterMaterialsMulti() {
    if (!this.Materials) {
      return;
    }
    let search = this.MaterialMultiFilterCtrl.value;
    if (!search) {
      this.filteredMaterialMulti.next(this.Materials.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMaterialMulti.next(
      this.Materials.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
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
    this.MaterialMastSer.MaterialFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.gridApi.sizeColumnsToFit();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
          this.gridApi.sizeColumnsToFit();
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
      this.CCODE = eve.data.M_Code;
      this.CODE = eve.data.M_SortName;
      this.NAME = eve.data.M_Name;
      this.chkIsActive = eve.data.IsActive;
      // this.Material = new FormControl(eve.data.M_cat ? eve.data.M_cat.split(",") : "");
      this.Material.setValue(eve.data.M_cat);
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.M_SortName + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            M_Code: eve.data.M_Code
          }
          this.MaterialMastSer.MaterialDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.M_Code, PageName: 'MaterialMast.aspx' } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
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
      this.CCODE = 0;
    }
    this.Material.setValue('');
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
    if (this.Material.value.toString() == "" || this.Material.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Material");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      M_Code: this.CCODE == "" ? "" : this.CCODE,
      M_cat_Text: this.Material.value.toString(),
      M_Name: this.NAME,
      M_SortName: this.CODE,
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.MaterialMastSer.MaterialSave(ResulObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          this.toastr.success("Saved SuccessFully");
          this.Clear();
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

  CheckCode() {
    if (this.CODE.trim() != "") {
      this.MaterialMastSer.MaterialMastCheck({ M_SortName: this.CODE }).subscribe(Result => {
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
