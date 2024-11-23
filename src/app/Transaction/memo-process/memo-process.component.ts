import { Component, OnInit, ElementRef } from "@angular/core";
import { MemoInService } from "../../Services/Transaction/memo-in.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import PerfectScrollbar from "perfect-scrollbar";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { MemoProcessFormComponent } from "../memo-process-form/memo-process-form.component";

@Component({
  selector: "app-memo-process",
  templateUrl: "./memo-process.component.html",
  styleUrls: ["./memo-process.component.css"]
})
export class MemoProcessComponent implements OnInit {
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  constructor(
    private MemoInSer: MemoInService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef
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
        valueFormatter: function (params) {
          return moment(params.value).format("DD/MM/YYYY");
        }
      },
      {
        headerName: "Supplier",
        field: "Supplier",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Broker",
        field: "Broker",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Sr No",
        field: "SrNo",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Cat",
        field: "M_CAT_SortName",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Material",
        field: "M_SortName",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Shape",
        field: "S_SortName",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Sieve/Gague Range",
        field: "Gague",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Colour",
        field: "ColorName",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Clarity",
        field: "ClarityName",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Pcs",
        field: "Pcs",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Weight",
        field: "Weight",
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          if (params.data.Unit == "CTS") {
            return params.value.toFixed(2);
          } else if (params.data.Unit == "GMS") {
            return params.value.toFixed(3);
          }
        }
      },
      {
        headerName: "Unit",
        field: "Unit",
        cellStyle: { "text-align": "center" }
      },
      {
        headerName: "Price",
        field: "Price",
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "Amount",
        field: "Amount",
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          return params.value.toFixed(2);
        }
      },
      {
        headerName: "CVD Chk",
        field: "CVDFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {

          if (params.data.CVDFLAG == true) {
            return (
              '<input type="checkbox" title="CVDDate: ' +
              params.data.CVDDATE +
              '"  checked data-action-type="CVDChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="CVDDate: ' +
              params.data.CBDDATE +
              '" data-action-type="CVDChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "DownSize Chk",
        field: "DOWNSIZEFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {

          if (params.data.DOWNSIZEFLAG == true) {
            return (
              '<input type="checkbox" title="DownSizeDate: ' +
              params.data.DOWNSIZEDATE +
              '"  checked data-action-type="DownSizeChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="DownSizeDate: ' +
              params.data.DOWNSIZEDATE +
              '" data-action-type="DownSizeChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "Shape Chk",
        field: "SHAPEFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {

          if (params.data.SHAPEFLAG == true) {
            return (
              '<input type="checkbox" title="ShapeDate: ' +
              params.data.SHAPEDATE +
              '"  checked data-action-type="ShapeChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="ShapeDate: ' +
              params.data.SHAPEDATE +
              '" data-action-type="ShapeChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "Flo Chk",
        field: "FLOFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          if (params.data.FLOFLAG == true) {
            return (
              '<input type="checkbox" title="FloDate: ' +
              params.data.FLODATE +
              '"  checked data-action-type="FloChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="FloDate: ' +
              params.data.FLODATE +
              '" data-action-type="FloChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "Guage Chk",
        field: "GUAGEFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {

          if (params.data.GUAGEFLAG == true) {
            return (
              '<input type="checkbox" title="GuageDate: ' +
              params.data.GUAGEDATE +
              '"  checked data-action-type="GuageChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="GuageDate: ' +
              params.data.GUAGEDATE +
              '" data-action-type="GuageChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "Make Chk",
        field: "MAKEFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {

          if (params.data.MAKEFLAG == true) {
            return (
              '<input type="checkbox" title="MakeDate: ' +
              params.data.MAKEDATE +
              '"  checked data-action-type="MakeChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="MakeDate: ' +
              params.data.MAKEDATE +
              '" data-action-type="MakeChk">'
            );
          }
        },
        headerClass: "text-center"
      },
      {
        headerName: "Col/Qua Chk",
        field: "COLFLAG",

        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          if (params.data.COLFLAG == true) {
            return (
              '<input type="checkbox" title="ColDate: ' +
              params.data.COLDATE +
              '"  checked data-action-type="ColChk">'
            );
          } else {
            return (
              '<input type="checkbox" title="ColDate: ' +
              params.data.COLDATE +
              '" data-action-type="ColChk">'
            );
          }
        },
        headerClass: "text-center"
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
  }

  LoadGrid() {
    this.spinner.show();
    this.MemoInSer.MemoInProcess({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.gridColumnApi.autoSizeAllColumns();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
        }
        const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
          ".ag-body-viewport"
        );
        const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
          ".ag-body-horizontal-scroll-viewport"
        );
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

  onGridRowClicked(eve: any) {
    if (eve.event.target != undefined) {
      let actionType = eve.event.target.getAttribute("data-action-type");
      let colType = eve.event.target.getAttribute("Col-id");
      if (actionType == "CVDChk") {
        let dataObj = eve.data;
        dataObj.CVDFLAG = !dataObj.CVDFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "DownSizeChk") {
        let dataObj = eve.data;
        dataObj.DOWNSIZEFLAG = !dataObj.DOWNSIZEFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "ShapeChk") {
        let dataObj = eve.data;
        dataObj.SHAPEFLAG = !dataObj.SHAPEFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "FloChk") {
        let dataObj = eve.data;
        dataObj.FLOFLAG = !dataObj.FLOFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "GuageChk") {
        let dataObj = eve.data;
        dataObj.GUAGEFLAG = !dataObj.GUAGEFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "MakeChk") {
        let dataObj = eve.data;
        dataObj.MAKEFLAG = !dataObj.MAKEFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (actionType == "ColChk") {
        let dataObj = eve.data;
        dataObj.COLFLAG = !dataObj.COLFLAG;
        eve.node.setData(dataObj);
        eve.api.refreshCells({ force: false });
      }
      if (colType == "FLOFLAG" || colType == "CVDFLAG" || colType == "DOWNSIZEFLAG" || colType == "SHAPEFLAG" || colType == "GUAGEFLAG" || colType == "MAKEFLAG" || colType == "COLFLAG") {
        var a = colType.substring(0, colType.length - 4)
        const PRF = this.dialog.open(MemoProcessFormComponent, {
          width: "50%",
          data: {
            TrnNo: eve.data.TrnNo,
            Srno: eve.data.SrNo.split('_')[1],
            Name: colType.substring(0, colType.length - 4)
          }
        });
        PRF.afterClosed().subscribe(result => {

        });
      }
    }
  }

  Save() {
    this.spinner.show();
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    this.MemoInSer.UpdateMemoInProcess(
      {
        per: rowData.map((item) => {
          return {
            SrNo: item.SrNo,
            CVDFLAG: item.CVDFLAG == true ? true : false,
            DOWNSIZEFLAG: item.DOWNSIZEFLAG == true ? true : false,
            SHAPEFLAG: item.SHAPEFLAG == true ? true : false,
            GUAGEFLAG: item.GUAGEFLAG == true ? true : false,
            MAKEFLAG: item.MAKEFLAG == true ? true : false,
            FLOFLAG: item.FLOFLAG == true ? true : false,
            COLFLAG: item.COLFLAG == true ? true : false,
            FINUSER: item.FINUSER
          }
        })
      }).subscribe(Result => {
        try {
          if (Result[0].Success == 1) {
            this.LoadGrid();
            this.toastr.clear();
            this.toastr.success("Saved SuccessFully");
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
}
