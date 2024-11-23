import { Component, OnInit, ElementRef } from '@angular/core';
import { MemoInService } from '../../Services/Transaction/memo-in.service';
import { PurchaseService } from '../../Services/Transaction/purchase.service';
import { LocationMastService } from '../../Services/HR/location-mast.service';
import { MaterialMastService } from '../../Services/Masters/material-mast.service';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import PerfectScrollbar from "perfect-scrollbar";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColourdStoneComponent } from '../Memo/colourd-stone/colourd-stone.component';
import { CSIMMComponent } from '../Memo/csimm/csimm.component';
import Swal, * as _swal from "sweetalert2";
declare let $: any;
import { MatDialog } from "@angular/material/dialog";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PearlsComponent } from '../Memo/pearls/pearls.component';
import { ImmitationComponent } from '../Memo/immitation/immitation.component';
import { OtherDiamondsComponent } from '../Memo/other-diamonds/other-diamonds.component';
import { CertiDiamondsComponent } from '../Memo/certi-diamonds/certi-diamonds.component';

export interface Lot1 {
  name: string;
  code: string;
}

export interface Lot {
  name: string;
  code: string;
}

export interface Lot2 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-memo-new',
  templateUrl: './memo-new.component.html',
  styleUrls: ['./memo-new.component.css']
})
export class MemoNewComponent implements OnInit {

  Supplier: FormControl;
  filteredSupplier: Observable<any[]>;
  SupplierCode: any = "";
  SupplierArr: Lot1[] = [];
  SupplierName: any = '';

  Broker: FormControl;
  filteredBroker: Observable<any[]>;
  BrokerCode: any = "";
  BrokerArr: Lot1[] = [];
  BrokerName: any = '';

  Location: FormControl;
  filteredLocation: Observable<any[]>;
  LocationCode: any = "";
  LocationArr: Lot1[] = [];
  LocationName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  tomorrow = new Date();

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  Id: number = 0;
  Flag: boolean = false;
  TRNNO: any = "";
  //DATE = formatDate(new Date().getTime(),'dd/MM/yyyy','en_US');
  DATE = new Date((new Date().getTime()));
  USERNAME: any = this.decodedTkn.UserId;
  SUPMEMONO: any = "";
  TYPE_GOOD: any = "";
  COMMENT: any = "";
  NOOFPCK: any = "0";
  TAMOUNT: any = "0.00";
  TWEIGHT: any = "0.00";
  closeResult: string;
  MaterialPopArr = [];
  SortName: any = "";
  ID: any = "";
  SupplieFlag: boolean = false;

  constructor(
    private MemoInSer: MemoInService,
    private PurchaseSer: PurchaseService,
    private LocationMastSer: LocationMastService,
    private MaterialMastSer: MaterialMastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    public dialog: MatDialog,
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.Supplier = new FormControl();
    this.Broker = new FormControl();
    this.Location = new FormControl();

    this.PurchaseSer.SupplierFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SupplierArr = Result.Data.map(item => {
            return {
              code: item.Name,
              name: item.Name,
              sortname: item.ClientID
            };
          });
          this.filteredSupplier = this.Supplier.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredSuppliers(lot) : this.SupplierArr.slice()))
          );
          this.Supplier.valueChanges.subscribe(value => this.autocompletevalidation());
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.PurchaseSer.BrokerFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.BrokerArr = Result.Data.map(item => {
            return {
              code: item.Name,
              name: item.Name,
              sortname: item.ClientID
            };
          });
          this.filteredBroker = this.Broker.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredBrokers(lot) : this.BrokerArr.slice()))
          );
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.LocationMastSer.LocationFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.LocationArr = Result.Data.map(item => {
            return {
              name: item.Location_Name,
              code: item.Location_Code
            };
          });
          this.filteredLocation = this.Location.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredLocations(lot) : this.LocationArr.slice()))
          );

        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.MaterialMastSer.MaterialDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialPopArr = Result.Data.map(item => {
            return {
              M_CAT_SortName: item.M_CAT_SortName,
              M_CAT_Name: item.M_CAT_Name,
              Type_Good: item.Type_Good
            };
          });
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });


    this.columnDefs = [
      {
        headerName: "Sr No.",
        field: "SrNo",
        cellStyle: { "text-align": "center" },
        width: 70
      },
      {
        headerName: "Cat",
        field: "M_CAT_SortName",
        cellStyle: { "text-align": "center" },
        width: 75
      },
      {
        headerName: "Material",
        field: "M_SortName",
        cellStyle: { "text-align": "center" },
        width: 85
      },
      {
        headerName: "Shape",
        field: "S_SortName",
        cellStyle: { "text-align": "center" },
        width: 75
      },
      {
        headerName: "Origin",
        field: "O_SORTNAME",
        cellStyle: { "text-align": "center" },
        width: 80
      },
      {
        headerName: "Color",
        field: "ColorName",
        cellStyle: { "text-align": "center" },
        width: 75
      },
      {
        headerName: "Clarity",
        field: "ClarityName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Drill Status",
        field: "DrStatus",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Size",
        field: "SizeDESC",
        cellStyle: { "text-align": "center" },
        width: 75
      },
      {
        headerName: "Sieve\Gague",
        field: "Gague",
        cellStyle: { "text-align": "center" },
        width: 140
      },
      {
        headerName: "Pcs",
        field: "Pcs",
        cellStyle: { "text-align": "center" },
        width: 50
      },
      {
        headerName: "Weight",
        field: "Weight",
        cellStyle: { "text-align": "center" },
        width: 65,
        cellRenderer: function (params) {
          if (params.data.Unit == "CTS") {
            return params.value.toFixed(2);
          }
          else if (params.data.Unit == "GMS") {
            return params.value.toFixed(3);
          }
        }
      },
      {
        headerName: "Unit",
        field: "Unit",
        cellStyle: { "text-align": "center" },
        width: 60
      },
      {
        headerName: "Price",
        field: "Price",
        cellStyle: { "text-align": "center" },
        width: 65
      },
      {
        headerName: "AvgWt",
        field: "AvgWt",
        cellStyle: { "text-align": "center" },
        width: 70
      },
      {
        headerName: "P/PC OR P/WT",
        field: "PPW",
        cellStyle: { "text-align": "center" },
        width: 125
      },
      {
        headerName: "Amount",
        field: "Amount",
        cellStyle: { "text-align": "center" },
        width: 80
      },
      {
        headerName: "Purpose",
        field: "Purpose",
        cellStyle: { "text-align": "center" },
        width: 80
      },
      {
        headerName: "Action",
        field: "SrNo",
        width: 80,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">';

          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>';

          html += '<div class="delete"> <button  type="button" class="la la-trash" title="click here for delete record" value="Delete" data-action-type="DeleteUser"></button></div>'

          return html + '</div>';
        }
      },
    ];

    this.defaultColDef = {
      resizable: true,
      sortable: true
    };

    if (localStorage.getItem("MemoTrnNo") && localStorage.getItem("MemoID")) {
      this.TRNNO = localStorage.getItem("MemoTrnNo");
      this.ID = localStorage.getItem("MemoID");
      localStorage.removeItem("MemoTrnNo");
      localStorage.removeItem("MemoID");
      this.MemoInSer.MemoHInViewById({ TrnNo: this.TRNNO, ID: this.ID }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            var d = new Date(Result.Data[0].TrnDate);
            let Fromdate =
              ("0" + (d.getMonth() + 1)).slice(-2) +
              "/" +
              ("0" + d.getDate()).slice(-2) +
              "/" +
              +d.getFullYear();
            this.DATE = new Date(Fromdate)
            this.Id = Result.Data[0].ID;
            this.USERNAME = Result.Data[0].CreateBy;
            this.Supplier.setValue(Result.Data[0].SupplierName);
            this.SUPMEMONO = Result.Data[0].SupMemoNo;
            this.Broker.setValue(Result.Data[0].BrokerName);
            this.COMMENT = Result.Data[0].Comment;
            this.Location.setValue(Result.Data[0].LocationName);
            this.Flag = true;
            this.SupplieFlag = true;
            this.Calculation();
            this.LoadGridData();
          } else {
            this.toastr.info("Data not found");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    } else {
      this.MemoInSer.GetNewTrnNo({}).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.TRNNO = Result.Data[0].TrnNo_New;
            this.ID = "";
          } else {
            this.toastr.info("Data not found");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }
  ngOnInit(): void {

  }
  Calculation() {
    this.MemoInSer.MemoCalculation({ TrnNo: this.TRNNO }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.TWEIGHT = Result.Data[0].TotalWeight;
          this.TAMOUNT = Result.Data[0].TotalAmount;
          this.NOOFPCK = Result.Data[0].TotalPck;
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }
  open(content) {
    if (this.DATE.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Date", "DATE")
      return;
    }
    if (this.Supplier.value == null || this.SupplieFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.SupplierCode == "") {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    this.spinner.show();
    var d = new Date(this.DATE);
    let Fromdate =
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + d.getDate()).slice(-2) +
      "/" +
      +d.getFullYear();
    let ObjRes = {
      ID: this.Id == 0 ? 0 : this.Id,
      TrnNo: this.TRNNO,
      TrnDate: this.DATE,
      Supplier: this.Supplier.value.toString(),
      Location: this.Location.value.toString(),
      Terms: "",
      Broker: this.Broker.value.toString(),
      SupMemoNo: this.SUPMEMONO,
      Comment: this.COMMENT,
      TotalWeight: this.TWEIGHT == "" ? "0.00" : this.TWEIGHT,
      TotalSelection: "0.00",
      TotalRate: this.NOOFPCK == "" ? "0" : this.NOOFPCK,
      TotalAmount: this.TAMOUNT == "" ? "0.00" : this.TAMOUNT,
      CreateBy: this.USERNAME,
    };
    this.MemoInSer.MemoHSave(ObjRes).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.spinner.hide();
          this.Flag = true;
          this.toastr.success("Saved SuccessFully!!!!");
        } else if (Result.Success == 0) {
          this.spinner.hide();
          this.toastr.info("Something Went Wrong");
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      if (reason == "Save click") {
        this.OpenMemo(this.TYPE_GOOD, this.SortName, 0);
      }
      else if (reason == 0) {
        return
      }
    });
  }
  OpenMemo(e, n, m) {
    if (e) {
      if (e == "COLOURED STONES") {

        const PRF = this.dialog.open(ColourdStoneComponent, { width: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      } else if (e == "PEARL") {

        const PRF = this.dialog.open(PearlsComponent, { width: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m } })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      } else if (e == "IMMITATION") {

        const PRF = this.dialog.open(ImmitationComponent, { width: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m } })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      } else if (e == "OTHER DIAMONDS") {

        const PRF = this.dialog.open(OtherDiamondsComponent, { width: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m } })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      } else if (e == "CERTIFIED DIAMONDS") {

        const PRF = this.dialog.open(CertiDiamondsComponent, { width: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m } })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      }
      else {
        const PRF = this.dialog.open(CSIMMComponent, { width: '80%', data: { sortname: e, trnno: this.TRNNO, SrNo: m } })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      }
    }
  }
  changeclass(n, m) {
    $("*").removeClass("ChangeColor");
    $("#" + m).addClass("ChangeColor");
    this.SortName = m;
    this.TYPE_GOOD = n;
  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      this.OpenMemo(eve.data.Type_Good, eve.data.M_CAT_SortName, eve.data.SrNo);
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
          this.MemoInSer.MemoLDelete({ SrNo: eve.data.SrNo, TrnNo: eve.data.SrNo }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.toastr.success("Deleted Successfully", "SUCCESS");
                this.LoadGridData();
              } else {
                this.spinner.hide();
                this.toastr.clear();
                this.Calculation();
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
  }
  LoadGridData() {
    this.spinner.show();
    this.MemoInSer.GetMemoFill({ TrnNo: this.TRNNO }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.Calculation();
          this.spinner.hide();
        } else if (Result.Success == 0) {
          this.Calculation();
          this.gridApi.setRowData();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.Calculation();
        }
      } catch (err) {
        this.spinner.hide();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.LoadGridData();
    }, 1000);
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
  autocompletevalidation() {
    const country = this.SupplierArr.find(c => c.name == this.Supplier.value);
    if (country) {
      this.SupplieFlag = true;
    } else {
      this.SupplieFlag = false;
    }
  }
  Save() {
    if (this.DATE.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Date", "DATE")
      return;
    }
    if (this.Supplier.value == null || this.SupplieFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.SupplierCode == "") {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    this.spinner.show();
    var d = new Date(this.DATE);
    let Fromdate =
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + d.getDate()).slice(-2) +
      "/" +
      +d.getFullYear();
    let ObjRes = {
      ID: this.Id == 0 ? 0 : this.Id,
      TrnNo: this.TRNNO,
      TrnDate: this.DATE,
      Supplier: this.Supplier.value.toString(),
      Location: this.Location.value.toString(),
      Terms: "",
      Broker: this.Broker.value.toString(),
      SupMemoNo: this.SUPMEMONO,
      Comment: this.COMMENT,
      TotalWeight: this.TWEIGHT == "" ? "0.00" : this.TWEIGHT,
      TotalSelection: "0.00",
      TotalRate: this.NOOFPCK == "" ? "0" : this.NOOFPCK,
      TotalAmount: this.TAMOUNT == "" ? "0.00" : this.TAMOUNT,
      CreateBy: this.USERNAME,
    };
    this.MemoInSer.MemoHSave(ObjRes).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.spinner.hide();
          this.Flag = true;
          this.toastr.success("Saved SuccessFully!!!!");
        } else if (Result.Success == 0) {
          this.spinner.hide();
          this.toastr.info("Something Went Wrong");
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  filteredLocations(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LocationArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredBrokers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.BrokerArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredSuppliers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.SupplierArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
}
