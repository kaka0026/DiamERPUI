import { Component, OnInit, ElementRef } from '@angular/core';
import { OriginMastService } from "../../Services/Masters/origin-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { FormControl } from '@angular/forms';
import { TrackMastComponent } from '../track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import { ShapeMastService } from "../../Services/Masters/shape-mast.service";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";

@Component({
  selector: 'app-origin-mast',
  templateUrl: './origin-mast.component.html',
  styleUrls: ['./origin-mast.component.css']
})
export class OriginMastComponent implements OnInit {

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
  COUNTRY: any = "";
  CATCODE: any = "";
  OCODE: any = "";
  MaterialCatList = [];
  Material = new FormControl();
  MaterialArray = [];
  MaterialList = [];
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private ShapeMastSer: ShapeMastService,
    public dialog: MatDialog,
    private PermissionSer: PermissionService,
    private OriginMastSer: OriginMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "OriginMaster.aspx"
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
        field: "O_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Country",
        field: "O_COUNTRY",
        cellStyle: { "text-align": "center" },
        width: 300
      },

      {
        headerName: "Material",
        field: "Material_Name",
        cellStyle: { "text-align": "center" },
        width: 400
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
        minWidth: 300,
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
    this.OriginMastSer.OriginFill({}).subscribe(Result => {
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

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      $("#addcontrol").css("display", "block");
      $("#add").css("display", "none");
      this.OCODE = eve.data.O_CODE;
      this.CODE = eve.data.O_SORTNAME;
      this.COUNTRY = eve.data.O_COUNTRY;
      this.chkIsActive = eve.data.IsActive;
      this.Material = new FormControl(eve.data.Material ? eve.data.Material.split(",") : "");
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.O_SORTNAME + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            O_CODE: eve.data.O_CODE
          }
          this.OriginMastSer.OriginDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.O_CODE, PageName: 'OriginMaster.aspx' } })
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
    this.MaterialList = [];
    this.fillMaterial();
    this.chkIsActive = false;
    this.CODE = "";
    this.COUNTRY = "";
    this.Material.setValue('');
    if (this.NEWADD == true) {
      this.OCODE = 0;
    }
  }
  Save() {
    if (this.COUNTRY.trim() == "") {
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
      O_CODE: this.OCODE == "" ? "" : this.OCODE,
      Material: this.Material.value.toString(),
      O_COUNTRY: this.COUNTRY,
      O_SORTNAME: this.CODE,
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.OriginMastSer.OriginSave(ResulObj).subscribe(Result => {
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
      this.OriginMastSer.OriginMastCheck({ O_SORTNAME: this.CODE }).subscribe(Result => {
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
