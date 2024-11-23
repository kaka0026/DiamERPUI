import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { TrackMastService } from "../../Services/Masters/track-mast.service";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as _ from "lodash"
import PerfectScrollbar from "perfect-scrollbar";

@Component({
  selector: 'app-track-mast',
  templateUrl: './track-mast.component.html',
  styleUrls: ['./track-mast.component.css']
})
export class TrackMastComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;
  OID: number = 0;
  PAGENAME: any = '';
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mdr: MatDialogRef<TrackMastComponent>,
    private TrackMastSer: TrackMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.OID = data.O_id;
    this.PAGENAME = data.PageName;
    this.columnDefs = [
      {
        headerName: "Field Name",
        field: "FieldName",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Old Value",
        field: "OldValue",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "New Value",
        field: "NewValue",
        cellStyle: { "text-align": "center" },
        width: 300
      },
      {
        headerName: "UserId",
        field: "UserId",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Action Date",
        field: "EntryDate",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Action",
        field: "Action",
        cellStyle: { "text-align": "center" },
        width: 126
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
    this.spinner.show();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.TrackMastSer.TrackMastFill({ O_id: this.OID, PageName: this.PAGENAME }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          params.api.setRowData(Result.Data);
          params.api.sizeColumnsToFit();
          this.spinner.hide();
        } else {
          params.api.setRowData();
          params.api.sizeColumnsToFit();
          this.spinner.hide();
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
  Close() {
    this._mdr.close();
  }
}
