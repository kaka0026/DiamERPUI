import { Component, OnInit, ElementRef } from "@angular/core";
import { InclusionMastService } from "../../Services/Masters/inclusion-mast.service";
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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Lot1 {
  name: string;
  code: string;
}

export interface MaterialList {
  Name: string;
  M_Name: string[];
}

@Component({
  selector: "app-inclusion-master",
  templateUrl: "./inclusion-master.component.html",
  styleUrls: ["./inclusion-master.component.css"]
})
export class InclusionMasterComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  Category: FormControl;
  filteredCategory: Observable<any[]>;
  CAT: any = "";
  CategoryArr: Lot1[] = [];
  CategoryName: any = '';

  MaterialList: any[] = [];
  CODE: any = "";
  SCODE: any = 0;
  TYPE: any = "";
  Material = new FormControl();
  chkIsActive: boolean = false;
  materl: any = "";
  NEWADD: boolean = false;
  CHECK: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  TRACK: boolean = false;
  Flag: boolean = false;

  INC_CAT: any = [];

  constructor(
    public dialog: MatDialog,
    private PermissionSer: PermissionService,
    private elementRef: ElementRef,
    private InclusionMastSer: InclusionMastService,
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
      PAGENAME: "InclusionMaster.aspx"
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
        field: "INC_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Type",
        field: "INC_NAME",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Category",
        field: "INC_CAT_NAME",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Material",
        field: "Material_Name",
        cellStyle: { "text-align": "center" },
        width: 400
      },
      {
        headerName: "Action",
        field: "INC_CODE",
        width: 300,
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
    this.InclusionMastSer.IncCatFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CategoryArr = Result.Data.map(item => {
            return {
              code: item.INC_CAT_CODE,
              name: item.INC_CAT_NAME,
              sortname: item.INC_CAT_SORTNAME
            };
          });
          this.filteredCategory = this.Category.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredCategorys(lot) : this.CategoryArr.slice()))
          );
          this.Category.valueChanges.subscribe(value => this.autocompletevalidation());
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

    this.fillMaterial();
  }

  fillMaterial() {
    this.spinner.show();
    this.InclusionMastSer.MaterialMastDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialList = Result.Data.map(item => {
            let a = item.M_Name.split("/");
            return {
              Name: a[0],
              M_Name: a[1],
              M_Code: item.M_Code.toString()
            };
          });
          this.MaterialList = this.groupByArray(
            this.MaterialList,
            "Name",
            "M_Name"
          );
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
          return a[sortKey]
            .toLowerCase()
            .localeCompare(b[sortKey].toLowerCase());
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
      this.CODE = eve.data.INC_SORTNAME;
      this.TYPE = eve.data.INC_NAME;
      this.CAT = eve.data.INC_CAT_NAME;
      this.SCODE = eve.data.INC_CODE;
      this.Flag = true;
      this.Material = new FormControl(
        eve.data.Material ? eve.data.Material.split(",") : ""
      );
      this.Category = new FormControl(eve.data.INC_CAT);
      this.chkIsActive = eve.data.IsActive;
      $("#code").focus();
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.INC_NAME + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          let resultObj = {
            USERID: this.decodedTkn.UserId,
            INC_CODE: eve.data.INC_CODE
          };
          this.InclusionMastSer.IncMastDelete(resultObj).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.INC_CODE, PageName: 'InclusionMaster.aspx' } })
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
    this.CAT = "";
    this.Material.setValue("");
    if (this.NEWADD == true) {
      this.SCODE = 0;
    }
    this.Category.setValue("");
  }
  LoadGridData() {
    this.spinner.show();
    this.InclusionMastSer.IncMastFill({}).subscribe(Result => {
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
  autocompletevalidation() {
    const country = this.CategoryArr.find(c => c.name == this.Category.value);
    if (country) {
      this.Flag = true;
    } else {
      this.Flag = false;
    }
  }
  Save() {
    if (this.TYPE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Type");
      return;
    }

    if (this.CAT == "") {
      this.toastr.clear();
      this.toastr.warning("Select category");
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
    if (this.Category.value.toString() == "" || this.Category.value == null || this.Flag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Catogry");
      return;
    }
    this.spinner.show();
    let ResulObj = {
      INC_CODE: this.SCODE == 0 ? 0 : this.SCODE,
      INC_NAME: this.TYPE,
      INC_CAT_CODE_NAME: this.Category.value.toString(),
      INC_SORTNAME: this.CODE,
      Material_CODE: this.Material.value.toString(),
      USERID: this.decodedTkn.UserId,
      IsActive: this.chkIsActive
    };
    this.InclusionMastSer.IncMastSave(ResulObj).subscribe(Result => {
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
      this.InclusionMastSer.IncMastCheck({ INC_SORTNAME: this.CODE }).subscribe(Result => {
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

  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.CategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Category.setValue("");
      this.CAT = ""
    }
    return a;
    return this.CategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
