import { Component, OnInit, ElementRef } from '@angular/core';
import { OrderEntryService } from "../../Services/Transaction/order-entry.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import PerfectScrollbar from "perfect-scrollbar";
import { DashboardService } from '../../Services/dashboard.service';
import Swal, * as _swal from "sweetalert2";
import { PermissionService } from 'src/app/Services/Access/permission.service';

@Component({
  selector: 'app-order-entry-edit',
  templateUrl: './order-entry-edit.component.html',
  styleUrls: ['./order-entry-edit.component.css']
})
export class OrderEntryEditComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  EDIT: boolean = false;
  DELETE: boolean = false;

  constructor(
    private OrderEntrySer: OrderEntryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private DashboardServ: DashboardService,
    private PermissionSer: PermissionService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "OrderMast.aspx"
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
        headerName: "O.No",
        field: "OrderNo",
        cellStyle: { "text-align": "center" },
        width: 100

      },
      {
        headerName: "Client Name",
        field: "ClientName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Description",
        field: "Description",
        cellStyle: { "text-align": "center" },
        width: 180
      },
      {
        headerName: "Category",
        field: "CategoryName",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "SubCategoryName",
        field: "SubCategoryName",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "KT",
        field: "FromKTCode",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "F.Color",
        field: "FromColor",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "T.Color",
        field: "ToColor",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "F.Cla",
        field: "FromCla",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "T.Cla",
        field: "ToCla",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Comment",
        field: "Comment",
        cellStyle: { "text-align": "center" },
        width: 180
      },
      {
        headerName: "Entry By",
        field: "EnteryBy",
        cellStyle: { "text-align": "center" },
        width: 115
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

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      localStorage.removeItem('OrderNo');
      localStorage.setItem('OrderNo', eve.data.OrderNo);
      this.DashboardServ.setData("OrderEntryUpdate (" + eve.data.OrderNo + ")");
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete ?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.OrderEntrySer.OrderEntryDelete({ OrderNo: eve.data.OrderNo }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGrid();
                this.toastr.success("Deleted Successfully", "SUCCESS");
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
          this.LoadGrid();
        }
      });
    }
  }
  LoadGrid() {
    this.spinner.show();
    this.OrderEntrySer.GetOderEntryFill({ OrderNo: 0 }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
        }
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
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
}
