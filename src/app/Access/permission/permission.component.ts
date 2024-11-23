import { Component, OnInit, ElementRef } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
import { EmployeeService } from "../../Services/HR/employee.service";
import { PermissionService } from "../../Services/Access/permission.service";
import { FormControl } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import PerfectScrollbar from "perfect-scrollbar";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
  Employee: FormControl;
  filteredEmployee: Observable<any[]>;
  EmployeeCode: any = "";
  lots: Lot1[] = [];
  EmployeeName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  EmpArr = [];
  userid: any = '';

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public getRowNodeId;
  public noRowsTemplate;
  public loadingTemplate;

  constructor(
    private elementRef: ElementRef,
    private EmployeeSer: EmployeeService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.Employee = new FormControl();


    this.columnDefs = [
      {
        headerName: "Page Name",
        field: "DISPLAYNAME",
        cellStyle: { "text-align": "center" },
        width: 350
      },
      {
        headerName: "Add",
        field: "ISNEWADD",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          if (params.data.ISNEWADD == true) {
            return '<input type="checkbox" checked data-action-type="Add">';
          } else {
            return '<input type="checkbox" data-action-type="Add">';
          }
        }
      },
      {
        headerName: "Edit",
        field: "ISEDIT",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          if (params.data.ISEDIT == true) {
            return '<input type="checkbox" checked data-action-type="Edit">';
          } else {
            return '<input type="checkbox" data-action-type="Edit">';
          }
        }
      },
      {
        headerName: "Delete",
        field: "ISDELETE",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          if (params.data.ISDELETE == true) {
            return '<input type="checkbox" checked data-action-type="Delete">';
          } else {
            return '<input type="checkbox" data-action-type="Delete">';
          }
        }
      },
      {
        headerName: "View",
        field: "ISVIEW",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          if (params.data.ISVIEW == true) {
            return '<input type="checkbox" checked data-action-type="View">';
          } else {
            return '<input type="checkbox" data-action-type="View">';
          }
        }
      },
      {
        headerName: "Active",
        field: "ISACTIVE",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          if (params.data.ISACTIVE == true) {
            return '<input type="checkbox" checked data-action-type="Active">';
          } else {
            return '<input type="checkbox" data-action-type="Active">';
          }
        }
      },
      {
        headerName: "Process",
        field: "ISPROCESS",
        cellStyle: { "text-align": "center" },
        width: 200,
        headerCellRenderer: this.selectAllRenderer,
        cellRenderer: function (params) {
          if (params.data.ISPROCESS == true) {
            return '<input type="checkbox" checked data-action-type="Process">';
          } else {
            return '<input type="checkbox" data-action-type="Process">';
          }
        }
      },
    ];

    this.defaultColDef = {
      angularCompileHeaders: true,
      resizable: true,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {
    this.spinner.show();
    this.EmployeeSer.EmployeeFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.lots = Result.Data.map(item => {
            return {
              code: item.Emp_Code,
              name: item.Emp_Name
            };
          });

          this.filteredEmployee = this.Employee.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredEmployees(lot) : this.lots.slice()))
          );
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

  selectAllRenderer(params) {
    var cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');

    var eHeader = document.createElement('label');
    var eTitle = document.createTextNode(params.colDef.headerName);
    eHeader.appendChild(cb);
    eHeader.appendChild(eTitle);

    cb.addEventListener('change', function (e) {
      if ($(this)[0].checked) {
        params.api.selectAll();
      } else {
        params.api.deselectAll();
      }
    });
    return eHeader;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
  LoadGrid(e: any) {
    this.spinner.show();
    this.PermissionSer.PermissionFill({ USERID: e }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
          this.userid = e;
          $("#addcontrol").css("display", "block");
          $("#addcontrol1").css("display", "block");
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
    if (eve.event.target !== undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");
      if (actionType == "Add") {
        let dataObj = eve.data;
        dataObj.ISNEWADD = !dataObj.ISNEWADD;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: false })
      }
      if (actionType == "Process") {
        let dataObj = eve.data;
        dataObj.ISPROCESS = !dataObj.ISPROCESS;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      }
      if (actionType == "Edit") {
        let dataObj = eve.data;
        dataObj.ISEDIT = !dataObj.ISEDIT;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      }
      if (actionType == "Delete") {
        let dataObj = eve.data;
        dataObj.ISDELETE = !dataObj.ISDELETE;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      }
      if (actionType == "Active") {
        let dataObj = eve.data;
        dataObj.ISACTIVE = !dataObj.ISACTIVE;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      }
      if (actionType == "View") {
        let dataObj = eve.data;
        dataObj.ISVIEW = !dataObj.ISVIEW;
        eve.node.setData(dataObj)
        eve.api.refreshCells({ force: true })
      }
    }
  }

  Save() {
    this.spinner.show();
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    this.PermissionSer.PermissionSave(
      {
        per: rowData.map((item) => {
          return {
            PAGEID: item.PAGEID,
            ISACTIVE: item.ISACTIVE == true ? 1 : 0,
            ISEDIT: item.ISEDIT == true ? 1 : 0,
            ISDELETE: item.ISDELETE == true ? 1 : 0,
            ISPROCESS: item.ISPROCESS == true ? 1 : 0,
            ISVIEW: item.ISVIEW == true ? 1 : 0,
            ISNEWADD: item.ISNEWADD == true ? 1 : 0,
            USERID: this.userid,
            CreatedBy: this.decodedTkn.UserId
          }

        })
      }).subscribe(Result => {
        try {
          if (Result[0].Success == 1) {
            this.LoadGrid(this.userid);
            this.toastr.clear();
            this.toastr.success("Saved SuccessFully");
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.clear();
            this.toastr.error("Somthing Went Wrong");
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      });

  }
  Clear() {
    this.Employee.setValue('');
    $("#addcontrol").css("display", "none");
    $("#addcontrol1").css("display", "none");
  }
  filteredEmployees(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Employee.setValue("");
      this.EmployeeCode = ""
    }
    return a;
  }
}
