import { Component, OnInit, ElementRef } from '@angular/core';
import { TreatmentMastService } from "../../Services/Masters/treatment-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { FormControl } from "@angular/forms";
import { TrackMastComponent } from '../track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";

@Component({
  selector: 'app-treatment-mast',
  templateUrl: './treatment-mast.component.html',
  styleUrls: ['./treatment-mast.component.css']
})
export class TreatmentMastComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  MaterialList: any[] = [];
  CODE: any = "";
  SCODE: any = 0;
  TYPE: any = "";
  Material = new FormControl();
  chkIsActive: boolean = false;
  materl: any = '';
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;

  constructor(
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private PermissionSer: PermissionService,
    private TreatmentMastSer: TreatmentMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "TreatmentMaster.aspx"
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
        field: "T_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Type",
        field: "T_TYPE",
        cellStyle: { "text-align": "center" },
        width: 300
      },

      {
        headerName: "Material",
        field: "Material_Name",
        cellStyle: { "text-align": "center" },
        width: 400
      },
      {
        headerName: "Action",
        field: "T_CODE",
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
    this.fillMaterial();
  }
  fillMaterial() {
    this.spinner.show();
    this.TreatmentMastSer.MaterialMastDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {

          this.MaterialList = Result.Data.map(item => {
            let a = item.M_Name.split("/");
            return {
              Name: a[0],
              M_Name: a[1],
              M_Code: item.M_Code.toString()
            }
          });
          this.MaterialList = this.groupByArray(this.MaterialList, "Name", "M_Name");
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
  groupByArray(xs, key, sortKey) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find(r => r && r.key === v);

      if (el) {
        el.values.push(x);
        el.values.sort(function (a, b) {
          return a[sortKey].toLowerCase().localeCompare(b[sortKey].toLowerCase());
        });
      } else {
        rv.push({ key: v, values: [x] });
      }

      return rv;
    }, []);
  }

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.CODE = eve.data.T_SORTNAME;
      this.TYPE = eve.data.T_TYPE;
      this.SCODE = eve.data.T_CODE;

      this.Material = new FormControl(
        eve.data.Material ? eve.data.Material.split(",") : ""
      );
      this.chkIsActive = eve.data.IsActive;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.T_SORTNAME + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            T_CODE: eve.data.T_CODE
          };
          this.TreatmentMastSer.TreatmentMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.T_CODE, PageName: 'TreatmentMaster.aspx' } })
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
    this.MaterialList = [];
    this.fillMaterial();
    this.chkIsActive = false;
    this.CODE = "";
    this.TYPE = "";
    this.Material.setValue('');
    this.materl = undefined;
    if (this.NEWADD == true) {
      this.SCODE = 0;
    }
  }
  LoadGridData() {
    this.spinner.show();
    this.TreatmentMastSer.TreatmentMastFill({}).subscribe(Result => {
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
    if (this.TYPE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Type");
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
      T_CODE: this.SCODE == 0 ? 0 : this.SCODE,
      T_TYPE: this.TYPE,
      T_SortName: this.CODE,
      Material: this.Material.value.toString(),
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.TreatmentMastSer.TreatmentMastSave(ResulObj).subscribe(Result => {
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
  CheckCode() {
    if (this.CODE.trim() != "") {
      this.TreatmentMastSer.TreatmentMastCheck({ T_SORTNAME: this.CODE }).subscribe(Result => {
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
      for (let i = 0; i < group.values.length; i++) {
        states.push(group.values[i].M_Code)
      }
    } else {
      group.values.forEach((x: string) => states.splice(states.indexOf(x), 1));
    }
    this.Material = new FormControl(
      states.join().split(','));
  }
}