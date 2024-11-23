import { Component, OnInit, ElementRef } from '@angular/core';
import { SizeMastService } from "../../Services/Masters/size-mast.service";
import { ShapeMastService } from "../../Services/Masters/shape-mast.service";
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

export interface MaterialList {
  Name: string;
  M_Name: string[];
}

@Component({
  selector: 'app-size-mast',
  templateUrl: './size-mast.component.html',
  styleUrls: ['./size-mast.component.css']
})
export class SizeMastComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  material: any = '';
  MaterialArray = [];
  MaterialList = [];
  MaterialName: any = "";
  materialcat = [];
  CODE: any = '';
  SCODE: any = '';
  DESC: any = '';
  FROM: number = 0.00;
  TO: number = 0.00;
  Material = new FormControl();
  chkIsActive: boolean = false;
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  gridshow: boolean = false;

  constructor(
    public dialog: MatDialog,
    private SizeMastSer: SizeMastService,
    private ShapeMastSer: ShapeMastService,
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
      PAGENAME: "SizeMast.aspx"
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
        field: "SIZE_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Description",
        field: "SIZE_DESC",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "From",
        field: "F_SIZE",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "To",
        field: "T_SIZE",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Material",
        field: "Material_Name",
        cellStyle: { "text-align": "center" },
        width: 300
      },
      // {
      //   headerName: "IsActive",
      //   field: "IsActive",
      //   cellStyle: { "text-align": "center" },
      //   width: 126
      // },
      {
        headerName: "Action",
        field: "M_CAT_Code",
        width: 270,
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

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.CODE = eve.data.SIZE_SORTNAME;
      this.DESC = eve.data.SIZE_DESC;
      this.SCODE = eve.data.SIZE_CODE;
      this.Material = new FormControl(eve.data.Material);
      this.chkIsActive = eve.data.IsActive;
      this.FROM = eve.data.F_SIZE;
      this.TO = eve.data.T_SIZE;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.S_Name + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            SIZE_CODE: eve.data.SIZE_CODE
          }
          this.SizeMastSer.SizeMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.SIZE_CODE, PageName: 'SizeMast.aspx' } })
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
    if (this.MaterialName) {
      this.gridshow = true;
    } else {
      this.gridshow = false;
    }
    this.chkIsActive = false;
    this.CODE = "";
    this.DESC = "";
    if (this.NEWADD == true) {
      this.SCODE = 0;
    }
    this.FROM = 0;
    this.TO = 0;
  }

  LoadGridData() {
    if (this.MaterialName) {
      this.spinner.show();
      this.SizeMastSer.SizeMastFill({ Material: this.MaterialName }).subscribe(Result => {
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
        }
      });
    }
  }
  Save() {
    if (this.DESC.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Name");
      return;
    }
    if (this.CODE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Code");
      return;
    }
    if (this.Material.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Material");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      SIZE_CODE: this.SCODE == 0 ? 0 : this.SCODE,
      SIZE_DESC: this.DESC,
      F_SIZE: this.FROM,
      T_SIZE: this.TO,
      USERID: this.DESC,
      SIZE_SORTNAME: this.CODE,
      Material: this.Material.value.toString(),
      IsActive: this.chkIsActive
    };
    this.SizeMastSer.SizeMastSave(ResulObj).subscribe(Result => {
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

  MaterialChange() {
    this.spinner.show();
    const toSelect2 = this.MaterialArray.find(c => c.M_Code == this.Material.value.toString());
    this.MaterialName = toSelect2.M_Name;
    this.SizeMastSer.SizeMastFill({ Material: toSelect2.M_Name }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridshow = true;
          this.gridApi.setRowData(Result.Data);
          this.CheckCode();
          this.Clear();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
      }
    });
  }

  CheckCode() {
    if (this.CODE.trim() != "" && this.Material.value != null) {
      this.SizeMastSer.SizeMastCheck({ SIZE_SORTNAME: this.CODE, Material: this.Material.value.toString() }).subscribe(Result => {
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
  }
}