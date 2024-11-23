import { Component, OnInit, ElementRef } from '@angular/core';
import { MemoInService } from "../../Services/Transaction/memo-in.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import PerfectScrollbar from "perfect-scrollbar";
import { DashboardService } from '../../Services/dashboard.service';
import Swal, * as _swal from "sweetalert2";
import { PermissionService } from 'src/app/Services/Access/permission.service';

@Component({
  selector: 'app-memo-edit',
  templateUrl: './memo-edit.component.html',
  styleUrls: ['./memo-edit.component.css']
})
export class MemoEditComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  DELETE: boolean = false;
  NEWADD: boolean = false;
  EDIT: boolean = false;

  constructor(
    private DashboardServ: DashboardService,
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private PermissionSer: PermissionService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "MemoIn.aspx"
    }
    let _edit;
    let _delete;
    this.PermissionSer.PageWisePermissionFill(ObjResult25).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].ISEDIT == "False") {
            this.EDIT = false;
          } else {
            this.EDIT = true;
          }
          if (Result.Data[0].ISNEWADD == "False") {
            this.NEWADD = false;
          }
          else {
            this.NEWADD = true;
          }
          _edit = this.EDIT;
          if (Result.Data[0].ISDELETE == "False") {
            this.DELETE = false;
          } else {
            this.DELETE = true;
          }
          _delete = this.DELETE;
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
        headerName: "Action",
        field: "TrnNo",
        width: 200,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">';
          if (_edit == true) {
            html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';
          }
          if (_delete == true) {
            html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
          }
          return html + '</div>';
        }
      },
      {
        headerName: "Trn No.",
        field: "TrnNo",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Trn Date",
        field: "TrnDate_Edit",
        cellStyle: { "text-align": "center" },
        width: 130,
      },
      {
        headerName: "Supplier",
        field: "Supplier",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Broker",
        field: "Broker",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Sup Memo No.",
        field: "SupMemoNo",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Comment",
        field: "Comment",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Location",
        field: "LocationName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Weight",
        field: "TotalWeight",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Rate",
        field: "TotalRate",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Amount",
        field: "TotalAmount",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Create By",
        field: "CreateBy",
        cellStyle: { "text-align": "center" },
        width: 120
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


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGrid();
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

  LoadGrid() {
    this.spinner.show();
    this.MemoInSer.MemoHInView({ TrnNo: '', ID: 0 }).subscribe(Result => {
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
      localStorage.removeItem('MemoTrnNo');
      localStorage.setItem('MemoTrnNo', eve.data.TrnNo);
      localStorage.removeItem('MemoID');
      localStorage.setItem('MemoID', eve.data.ID);
      this.DashboardServ.setData("MemoUpdate (" + eve.data.TrnNo + ")");
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.TrnNo + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.MemoInSer.MemoHDelete({ TrnNo: eve.data.TrnNo }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGrid();
                this.toastr.success("Deleted Successfully", "SUCCESS");
              } else {
                this.toastr.clear();
                this.LoadGrid();
                this.toastr.info("Data not found");
              }
            } catch (err) {
              this.LoadGrid();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.spinner.hide();
        }
      });
    }
  }

  add() {
    this.DashboardServ.setData("MemoNew");
  }
}
