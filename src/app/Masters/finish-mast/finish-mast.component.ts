import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FinishMastService } from "../../Services/Masters/finish-mast.service";
import { ShapeMastService } from "../../Services/Masters/shape-mast.service";
import { MMMastService } from "../../Services/Masters/mmmast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { FormControl } from '@angular/forms';
import * as _ from "lodash"
import { TrackMastComponent } from '../track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

export interface Lot {
  id: string;
  name: string;
}

export interface MaterialList {
  Name: string;
  M_Name: string[];
}

@Component({
  selector: 'app-finish-mast',
  templateUrl: './finish-mast.component.html',
  styleUrls: ['./finish-mast.component.css']
})
export class FinishMastComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  MaterialArray = [];
  MaterialList = [];
  ShapeList = [];
  CODE: any = '';
  SCODE: any = '';
  DESC: any = '';
  Material = new FormControl();
  chkIsActive: boolean = false;

  Shapes: Lot[] = [];
  Shape: FormControl = new FormControl();
  ShapeMultiFilterCtrl: FormControl = new FormControl();
  filteredShapeMulti: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;
  _onDestroy = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private FinishMastSer: FinishMastService,
    private MMMastSer: MMMastService,
    private ShapeMastSer: ShapeMastService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.filteredShapeMulti.next(this.Shapes.slice());
    this.ShapeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterShapesMulti();
      });

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "FinishMast.aspx"
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
        field: "CUT_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Description",
        field: "CUT_DESC",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Material",
        field: "Material_Name",
        cellStyle: { "text-align": "center" },
        width: 275
      },
      {
        headerName: "Shape",
        field: "Shape_Name",
        cellStyle: { "text-align": "center" },
        width: 275
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
    this.fillMaterial();
  }
  fillMaterial() {
    this.spinner.show();
    this.ShapeMastSer.MaterialMastDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialArray = Result.Data.map(item => {
            let a = item.M_Name.split('/');
            return { M_Code: item.M_Code.toString(), M_Name: a[1], Group: a[0] };
          });
          this.MaterialList = this.groupByArray(this.MaterialArray, "Group", "M_Name");
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
  groupByArray(xs, Name, sortKey) {
    return xs.reduce(function (rv, x) {
      let v = Name instanceof Function ? Name(x) : x[Name];
      let el = rv.find(r => r && r.Name === v);

      if (el) {
        el.Value.push(x);
        el.Value.sort(function (a, b) {
          return a[sortKey].toLowerCase().localeCompare(b[sortKey].toLowerCase());
        });
      } else {
        rv.push({ Name: v, Value: [x] });
      }

      return rv;
    }, []);
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterShapesMulti() {
    if (!this.Shapes) {
      return;
    }
    let search = this.ShapeMultiFilterCtrl.value;
    if (!search) {
      this.filteredShapeMulti.next(this.Shapes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredShapeMulti.next(
      this.Shapes.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  materialchange() {
    this.spinner.show();
    this.MMMastSer.ShapeMastForMaterial({ MaterialId: this.Material.value.toString() }).subscribe(Result => {

      try {
        if (Result.Success == 1) {
          this.ShapeList = Result.Data.map(item => {
            return { id: item.S_Code.toString(), name: item.S_SortName };
          });
          this.Shapes = this.ShapeList;
          this.filterShapesMulti();
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
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.CODE = eve.data.CUT_SORTNAME;
      this.DESC = eve.data.CUT_DESC;
      this.SCODE = eve.data.CUT_CODE;
      this.Material = new FormControl(eve.data.Material ? eve.data.Material.split(",") : "");
      this.materialchange();
      this.Shape.setValue(eve.data.Shape ? eve.data.Shape.split(",") : "");
      this.chkIsActive = eve.data.IsActive;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.CUT_CODE + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            CUT_CODE: eve.data.CUT_CODE
          }
          this.FinishMastSer.FinishMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.CUT_CODE, PageName: 'FinishMast.aspx' } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
    }
  }
  LoadGridData() {
    this.spinner.show();
    this.FinishMastSer.FinishmastFill({}).subscribe(Result => {
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
    this.MaterialList = [];
    this.fillMaterial();
    this.chkIsActive = false;
    this.CODE = "";
    this.DESC = "";
    this.Material.setValue('');
    if (this.NEWADD == true) {
      this.SCODE = 0;
    }
    this.Shape.setValue('');
  }
  Save() {
    if (this.DESC.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Name");
      return;
    }
    if (this.Material.value.toString() == "" || this.Material.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Material");
      return;
    }
    if (this.Shape.value.toString() == "" || this.Shape.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Shape");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      CUT_CODE: this.SCODE == 0 ? 0 : this.SCODE,
      CUT_DESC: this.DESC,
      CUT_SORTNAME: this.CODE,
      Material: this.Material.value.toString(),
      Shape: this.Shape.value.toString(),
      IsActive: this.chkIsActive,
      USERID: this.decodedTkn.UserId
    };
    this.FinishMastSer.FinishMastSave(ResulObj).subscribe(Result => {
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
      this.FinishMastSer.FinishMastCheck({ CUT_SORTNAME: this.CODE }).subscribe(Result => {
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
  toggleSelection(event: any, group: any) {
    let states = this.Material.value;
    states = states ? states : [];
    if (event.checked) {
      for (let i = 0; i < group.Value.length; i++) {
        states.push(group.Value[i].M_Code)
      }
    } else {
      group.Value.forEach((x: string) => states.splice(states.indexOf(x), 1));
    }
    this.Material = new FormControl(
      states.join().split(','));
    this.materialchange();
  }
}
