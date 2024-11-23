import { Component, OnInit, ElementRef } from '@angular/core';
import { PurchaseService } from "../../Services/Transaction/purchase.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import PerfectScrollbar from "perfect-scrollbar";

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.css']
})
export class PurchaseViewComponent implements OnInit {

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  constructor(
    private PurchaseSer: PurchaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.columnDefs = [
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
        headerName: "Sr No",
        field: "SrNo",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Cat",
        field: "M_CAT_SortName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Material",
        field: "M_SortName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Shape",
        field: "S_SortName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Size",
        field: "SizeName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "F.Gague",
        field: "FromGague",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "T.Gague",
        field: "ToGague",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "Color",
        field: "ColorName",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Clarity",
        field: "ClarityName",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Pcs",
        field: "Pcs",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Weight",
        field: "Weight",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "Unit",
        field: "Unit",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Price",
        field: "Price",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "Amount",
        field: "Amount",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          return params.value.toFixed(2);
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
  }
  onGridReady(params) {
    this.spinner.show();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.PurchaseSer.PurchaseView({ TrnNo: '' }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          params.api.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          params.api.setRowData();
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
