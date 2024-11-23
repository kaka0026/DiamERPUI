import { Component, OnInit, ElementRef } from '@angular/core';
import { OrderEntryService } from "../../Services/Transaction/order-entry.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import PerfectScrollbar from "perfect-scrollbar";

@Component({
  selector: 'app-order-entry-view',
  templateUrl: './order-entry-view.component.html',
  styleUrls: ['./order-entry-view.component.css']
})
export class OrderEntryViewComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  constructor(
    private OrderEntrySer: OrderEntryService,
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
        width: 140
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
    this.spinner.show();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.OrderEntrySer.GetOderEntryFill({ OrderNo: 0 }).subscribe(Result => {
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
