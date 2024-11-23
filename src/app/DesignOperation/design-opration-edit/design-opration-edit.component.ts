import { Component, OnInit, ElementRef } from '@angular/core';
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import PerfectScrollbar from "perfect-scrollbar";
import { DashboardService } from '../../Services/dashboard.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import { TrackMastComponent } from '../../Masters/track-mast/track-mast.component';
import { MatDialog } from "@angular/material/dialog";
import * as $ from "jquery";
import { PermissionService } from "../../Services/Access/permission.service";
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-design-opration-edit',
  templateUrl: './design-opration-edit.component.html',
  styleUrls: ['./design-opration-edit.component.css']
})
export class DesignOprationEditComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;
  private ImageUrl = environment.ImageUrl;

  DELETE: boolean = false;
  TRACK: boolean = false;
  EDIT: boolean = false;

  mval: any = '';

  constructor(
    public dialog: MatDialog,
    private DesignOprationSer: DesignOprationService,
    private spinner: NgxSpinnerService,
    private PermissionSer: PermissionService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private DashboardServ: DashboardService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "NewBlackWhiteDesign.aspx"
    }
    let _edit;
    let _delete;
    let _track;
    let Url = this.ImageUrl;
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
    let i = 0;
    this.columnDefs = [
      {
        headerName: "Design Code",
        field: "DesigneCode",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Selected Date",
        field: "SelectedDate",
        cellStyle: { "text-align": "center" },
        width: 120,
        valueFormatter: function (params) {
          return moment(params.value).format("MM/DD/YYYY");
        }
      },
      {
        headerName: "Designer Name",
        field: "Emp_Name",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Category",
        field: "Category_Name",
        cellStyle: { "text-align": "center" },
        width: 145
      },
      {
        headerName: "Sub Category",
        field: "Sub_Category_Name",
        cellStyle: { "text-align": "center" },
        width: 145
      },
      {
        headerName: "Orintation",
        field: "Orintation_Name",
        cellStyle: { "text-align": "center" },
        width: 145
      },
      {
        headerName: "Image",
        field: "DesigneImage",
        cellStyle: { "text-align": "center", "cursor": "pointer", "color": "#2e3192" },
        width: 150,
        onCellClicked: this.makeCellClicked.bind(this),
      },
      {
        headerName: "Action",
        field: "Id",
        cellStyle: { "text-align": "center" },
        width: 150,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          if (_edit == true) {
            html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          } if (_delete == true) {
            html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
          } if (_track == true) {
            html += '<div class="Track"><button type="button" title="view track" class="la la-road" value="Track" data-action-type="TrackUser"></button></div>'
          }
          return html + '</div>';
        }
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

  makeCellClicked(e) {
    $(document).ready(function () {
      $('#purl').on('error', function () {
        $('#purl').attr('src', './../../../assets/images/No-Image.jpg');
      });
    });
    this.mval = e.value;

    if (this.mval == '') {
      this.mval = 'no-image.jpeg';
    } else {
      this.mval = e.value;
    }

    Swal.fire({
      title: e.data.DesigneCode + ' Image',
      html:
        '<img id="purl" name="a" style="height:10%;width:40%;" src="' + this.ImageUrl +
        this.mval +
        '">'
    });
  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      localStorage.removeItem('Id')
      localStorage.setItem('Id', eve.data.Id)
      this.DashboardServ.setData("DesignEditById (" + eve.data.Id + ")");
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.DesigneCode + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.DesignOprationSer.BlackWhiteDelete({ Id: eve.data.Id, USERID: this.decodedTkn.UserId }).subscribe(Result => {
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
      const PRF = this.dialog.open(TrackMastComponent, { width: '80%', data: { O_id: eve.data.Id, PageName: 'NewBlackWhiteDesign.aspx' } })
      PRF.afterClosed().subscribe(result => {
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
    }
  }
  count: number = 0;
  LoadGridData() {
    this.spinner.show();
    this.DesignOprationSer.BlackWhiteFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.count = Result.Data.length;
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
}
