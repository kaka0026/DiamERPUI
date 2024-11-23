import { Component, OnInit, ElementRef } from '@angular/core';
import { BrokerServiceService } from "../../Services/Transaction/broker-service.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import PerfectScrollbar from "perfect-scrollbar";
import { PermissionService } from "../../Services/Access/permission.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { BrokerViewFormComponent } from "../broker-view-form/broker-view-form.component"
import * as $ from 'jquery';
import { DashboardService } from '../../Services/dashboard.service';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  DELETE: boolean = false;
  VIEW: boolean = false;
  EDIT: boolean = false;
  NEWADD: boolean = false;
  NAME: any = "";
  CLIENTID: any = "";

  constructor(
    private DashboardServ: DashboardService,
    public dialog: MatDialog,
    private BrokerServiceSer: BrokerServiceService,
    private spinner: NgxSpinnerService,
    private PermissionSer: PermissionService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "BrokerList.aspx"
    }
    let _edit;
    let _delete;
    let _view;
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

          if (Result.Data[0].ISVIEW == "False") {
            this.VIEW = false;
          } else {
            this.VIEW = true;
          }
          _view = this.VIEW;
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
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 150,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          if (_edit == true) {
            html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          } if (_view == true) {
            html += '<div class="View"><button type="button" class="la la-eye icn" title="click here for view record" value="View" data-action-type="ViewUser"></button></div>'
          }
          if (_delete == true) {
            html += '<div class="delete"> <button  type="button" class="la la-trash" title="click here for delete record" value="Delete" data-action-type="DeleteUser"></button></div>'
          }
          return html + '</div>';
        }
      },
      {
        headerName: "ClientID",
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Name",
        field: "Name",
        cellStyle: { "text-align": "center" },
        width: 80
      },
      {
        headerName: "Mobile1 CC Code",
        field: "Mobile_1_CC_Code",
        cellStyle: { "text-align": "center" },
        width: 120
      },

      {
        headerName: "Mobile No1",
        field: "Mobile_1_NO",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Mobile2 CC Code",
        field: "Mobile_2_CC_Code",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Mobile No2",
        field: "Mobile_2_NO",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Email1",
        field: "Email1",
        cellStyle: { "text-align": "center" },
        width: 180
      },
      {
        headerName: "Email2",
        field: "Email2",
        cellStyle: { "text-align": "center" },
        width: 180
      },
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
      localStorage.removeItem('BrokerClientID')
      localStorage.setItem('BrokerClientID', eve.data.ClientID)
      this.DashboardServ.setData("BrokerUpdate (" + eve.data.ClientID + ")");
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.ClientID + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.BrokerServiceSer.BrokerDelete({ ClientID: eve.data.ClientID }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.toastr.success("Deleted Successfully", "SUCCESS");
                this.LoadGrid();
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
    if (actionType == "ViewUser") {
      const PRF = this.dialog.open(BrokerViewFormComponent, { width: '80%', data: { CLIENTID: eve.data.ClientID, NAME: eve.data.Name } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
        if (agBodyViewport) {
          const ps = new PerfectScrollbar(agBodyViewport);
          ps.update();
        }
      });
    }
  }
  LoadGrid() {
    this.spinner.show();
    let ResObj = {
      ClientID: this.CLIENTID,
      Name: this.NAME,
      C_Type: "B"
    };
    this.BrokerServiceSer.BrokerFill(ResObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.gridApi.setRowData();
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  add() {
    this.DashboardServ.setData("Brokernew");
  }

}
