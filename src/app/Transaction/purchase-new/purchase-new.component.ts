import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { PurchaseService } from 'src/app/Services/Transaction/purchase.service';
import { PurmastService } from 'src/app/Services/Masters/purmast.service';
import { MatSelect } from '@angular/material/select';
import { LocationMastService } from 'src/app/Services/HR/location-mast.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { MatDialog } from '@angular/material/dialog';
import { PreciousColorstoneComponent } from '../Purchase/precious-colorstone/precious-colorstone.component';
import { CSIMMComponent } from '../Memo/csimm/csimm.component';
import { PearlsComponent } from '../Memo/pearls/pearls.component';
import { ImmitationComponent } from '../Memo/immitation/immitation.component';
import { OtherDiamondsComponent } from '../Memo/other-diamonds/other-diamonds.component';
import { CertiDiamondsComponent } from '../Memo/certi-diamonds/certi-diamonds.component';
import { MaterialMastService } from 'src/app/Services/Masters/material-mast.service';
import PerfectScrollbar from 'perfect-scrollbar';
import Swal from 'sweetalert2';
import { findPhoneNumbersInText } from 'libphonenumber-js';
import { PearlComponent } from '../Purchase/pearl/pearl.component';
import { DiamondCertComponent } from '../Purchase/diamond-cert/diamond-cert.component';
import { PurImmitationComponent } from '../Purchase/immitation/immitation.component';
import { DiamondDossComponent } from '../Purchase/diamond-doss/diamond-doss.component';
import { DiamondSmalComponent } from '../Purchase/diamond-smal/diamond-smal.component';
import { DiamondSpecialComponent } from '../Purchase/diamond-special/diamond-special.component';
import { DateComponent } from 'ag-grid-community/dist/lib/components/framework/componentTypes';

export interface Lot1 {
  name: string;
  code: string;
}
@Component({
  selector: 'app-purchase-new',
  templateUrl: './purchase-new.component.html',
  styleUrls: ['./purchase-new.component.css']
})
export class PurchaseNewComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  tomorrow = new Date();
  OldDate = new Date();
  DATE = new Date((new Date().getTime()));
  DUEDATE = new Date((new Date().getTime()));

  USERNAME: any = this.decodedTkn.UserId;
  TYPE_GOOD: any = "";
  MaterialPopArr = [];
  SortName: any = "";
  TRNNO: any = "";
  ID: any = "";
  Id: number = 0;
  BROKERAGE: any = '';
  DISC1: any = '';
  DISC2: any = '';
  PAYDISC: any = '';
  Flag: boolean = false;
  TERMS: any = ''
  COMMENT: any = ''

  Supplier: FormControl;
  filteredSupplier: Observable<any[]>;
  SupplierCode: any = "";
  SupplierArr: Lot1[] = [];
  SupplierName: any = '';

  MemoNumber: FormControl;
  filteredMemoNumber: Observable<any[]>;
  MemoNumberCode: any = "";
  MemoNumberArr: Lot1[] = [];
  MemoNumberName: any = '';

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

  PurchaseType: FormControl;
  filteredPurchaseType: Observable<any[]>;
  PURCHASETYPE: any = "";
  PurchaseArr: Lot1[] = [];
  PurchaseTypeName: any = '';

  NOOFPCK: any = "0";
  TAMOUNT: any = "0.00";
  TWEIGHT: any = "0.00";

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private PurchaseSer: PurchaseService,
    private PurmastSer: PurmastService,
    private LocationMastSer: LocationMastService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private MaterialMastSer: MaterialMastService
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate());

    this.spinner.show();
    this.Broker = new FormControl();
    this.Supplier = new FormControl();
    this.Location = new FormControl();
    this.MemoNumber = new FormControl();
    this.PurchaseType = new FormControl();

    this.PurmastSer.PurchaseFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.PurchaseArr = Result.Data.map(item => {
            return {
              code: item.Purchase_Code,
              name: item.Purchase_Name
            };
          });
          this.filteredPurchaseType = this.PurchaseType.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredPurchaseTypes(lot) : this.PurchaseArr.slice()))
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
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
              Type_Good: item.Type_Good,
              Purchase_Type_Good: item.Purchase_Type_Good
            };
          });
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    if (localStorage.getItem("PurchaseTrnNo") && localStorage.getItem("PurchaseID")) {
      this.TRNNO = localStorage.getItem("PurchaseTrnNo");
      this.ID = localStorage.getItem("PurchaseID");
      localStorage.removeItem("PurchaseTrnNo");
      localStorage.removeItem("PurchaseID");
      this.PurchaseSer.PurchaseHFill({ TrnNo: this.TRNNO, ID: this.ID }).subscribe(Result => {
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
            this.ID = Result.Data[0].ID;
            this.USERNAME = Result.Data[0].CreateBy;
            this.Supplier.setValue(Result.Data[0].SupplierName);
            this.Broker.setValue(Result.Data[0].BrokerName);
            this.COMMENT = Result.Data[0].Comment;
            this.Location.setValue(Result.Data[0].LOCATION);
            this.TERMS = Result.Data[0].Terms;
            this.DISC1 = Result.Data[0].DISC1;
            this.DISC2 = Result.Data[0].DISC2;
            this.PAYDISC = Result.Data[0].PAYDISC;
            this.BROKERAGE = Result.Data[0].BROKERAGE;
            this.MemoNumberCode = Result.Data[0].MEMOTRNNO;
            if (Result.Data[0].TYPEOFPURCHASE == 1) {
              this.PurchaseType.setValue("NEW")
            } else {
              this.PurchaseType.setValue("MEMO")
            }
            this.Flag = true;
            this.Calculation();
            // this.LoadGridData();
          } else {
            this.toastr.info("Data not found");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    } else {
      this.PurchaseSer.GetNewTrnNo({}).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.TRNNO = Result.Data[0].TrnNo_New;
            this.ID = ""
          } else {
            this.toastr.info("Data not found");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }

    this.columnDefs = [
      {
        headerName: "Sr No.",
        field: "SrNo",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Category",
        field: "Category",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Material Name",
        field: "MaterialName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Shape",
        field: "ShapeName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Origin",
        field: "originName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Lab",
        field: "LAB",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Color",
        field: "ColorName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Clarity",
        field: "ClarityName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "DRILL STATUS",
        field: "DSTATUS",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Size",
        field: "SizeName",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "SIEVE/GAUGE",
        field: "SIGIRANGE",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Pcs",
        field: "OPCS",
        cellStyle: { "text-align": "center" },
        width: 60
      },
      {
        headerName: "Wt",
        field: "PWeight",
        cellStyle: { "text-align": "center" },
        width: 60
      },

      {
        headerName: "Units",
        field: "PUNIT",
        cellStyle: { "text-align": "center" },
        width: 60
      },
      {
        headerName: "Avg Wt",
        field: "PAVGWEIGHT",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Final Price",
        field: "PFINALPRICE",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "P/PC OR P/WT",
        field: "OPCWT",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "GROSS AMT",
        field: "GROSSAMT",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "LESS: DISCOUNT 1",
        field: "ADDDISC1",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "LESS: DISCOUNT 2",
        field: "ADDDISC2",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "ADD: BROKERAGE",
        field: "BROKRAGE",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Net Amount",
        field: "NETAMTPAY",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Purpose",
        field: "PURPOSE",
        cellStyle: { "text-align": "center" },
        width: 150
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
  }

  ngOnInit(): void {
  }

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      this.OpenMemo(eve.data.MaterialDrop, eve.data.Category, eve.data.MODELSRNO);
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
          this.PurchaseSer.PurchaseLDelete({ SrNo: eve.data.SrNo, TrnNo: eve.data.SrNo }).subscribe(Result => {
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
    this.PurchaseSer.PurchaseLFill({ TrnNo: this.TRNNO }).subscribe(Result => {
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

    // const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(".ag-body-viewport");
    // const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector(".ag-body-horizontal-scroll-viewport");

    // if (agBodyViewport) {
    //   const psV = new PerfectScrollbar(agBodyViewport);
    //   psV.update();
    // }
    // if (agBodyHorizontalViewport) {
    //   const psH = new PerfectScrollbar(agBodyHorizontalViewport);
    //   psH.update();
    // }
  }

  open(content) {
    if (this.DATE.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Date", "DATE")
      return;
    }
    if (this.Supplier.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.SupplierCode == "") {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.PURCHASETYPE == "MEMO") {
      if (!this.MemoNumberCode) {
        this.toastr.clear();
        this.toastr.warning("Select Memo Number", "Supplier")
        return;
      }
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
      ID: this.ID ? this.ID : 0,
      TrnNo: this.TRNNO,
      TrnDate: this.DATE,
      Supplier: this.Supplier.value.toString(),
      PurType: this.Location.value.toString(),
      Location: this.Location.value.toString(),
      DueDate: this.DUEDATE,
      Terms: this.TERMS,
      Broker: this.Broker.value.toString(),
      Comment: this.COMMENT,
      TotalWeight: this.TWEIGHT == "" ? "0.00" : this.TWEIGHT,
      TotalSelection: "0.00",
      TotalRate: this.NOOFPCK == "" ? "0" : this.NOOFPCK,
      TotalAmount: this.TAMOUNT == "" ? "0.00" : this.TAMOUNT,
      CreateBy: this.USERNAME,
      MEMOTRNNO: this.MemoNumberCode,
      DISC1: this.DISC1,
      DISC2: this.DISC2,
      BROKERAGE: this.BROKERAGE,
      PAYDISC: this.PAYDISC,
      TYPEOFPURCHASE: this.PurchaseArr.filter(option => option.name == this.PurchaseType.value.toString())[0].code
    };
    this.PurchaseSer.BillHSave(ObjRes).subscribe(Result => {
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
        const PRF = this.dialog.open(PreciousColorstoneComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "DIAMOND CERT") {
        const PRF = this.dialog.open(DiamondCertComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "PEARL") {
        const PRF = this.dialog.open(PearlComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "IMMITATION") {
        const PRF = this.dialog.open(PurImmitationComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "DIAMOND DOSS") {
        const PRF = this.dialog.open(DiamondDossComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "DIAMOND SMALL") {
        const PRF = this.dialog.open(DiamondSmalComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.psbar');
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
        });
      } else if (e == "DIAMOND SPECIAL") {
        const PRF = this.dialog.open(DiamondSpecialComponent, { width: '80%', height: '80%', data: { sortname: n, trnno: this.TRNNO, SrNo: m, MemoNo: this.MemoNumberCode }, disableClose: true })
        $("#Close").click();
        PRF.afterClosed().subscribe(result => {
          this.LoadGridData()
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
  }

  changeclass(n, m) {
    $("*").removeClass("ChangeColor");
    $("#" + m).addClass("ChangeColor");
    this.SortName = m;
    this.TYPE_GOOD = n;
  }

  GETTRNNO() {
    if (this.Supplier) {
      this.PurmastSer.GetMemoBySupplier({ SUPPLIER: this.Supplier.value }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.MemoNumberArr = Result.Data.map(item => {
              return {
                code: item.ID,
                name: item.TRNNO
              };
            });
            this.filteredMemoNumber = this.MemoNumber.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredMemoNumbers(lot) : this.MemoNumberArr.slice()))
            );
          } else {
            this.toastr.info("Data not found");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }

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
  filteredMemoNumbers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MemoNumberArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredLocations(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LocationArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredPurchaseTypes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.PurchaseArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  Save() {
    if (this.DATE.toString() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Date", "DATE")
      return;
    }
    if (this.Supplier.value == null) {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.SupplierCode == "") {
      this.toastr.clear();
      this.toastr.warning("Select Supplier", "Supplier")
      return;
    }
    if (this.PURCHASETYPE == "MEMO") {
      if (!this.MemoNumberCode) {
        this.toastr.clear();
        this.toastr.warning("Select Memo Number", "Supplier")
        return;
      }
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
      ID: this.ID ? this.ID : 0,
      TrnNo: this.TRNNO,
      TrnDate: this.DATE,
      Supplier: this.Supplier.value.toString(),
      PurType: this.Location.value.toString(),
      Location: this.Location.value.toString(),
      DueDate: this.DUEDATE,
      Terms: this.TERMS,
      Broker: this.Broker.value.toString(),
      Comment: this.COMMENT,
      TotalWeight: this.TWEIGHT == "" ? "0.00" : this.TWEIGHT,
      TotalSelection: "0.00",
      TotalRate: this.NOOFPCK == "" ? "0" : this.NOOFPCK,
      TotalAmount: this.TAMOUNT == "" ? "0.00" : this.TAMOUNT,
      CreateBy: this.USERNAME,
      MEMOTRNNO: this.MemoNumberCode,
      DISC1: this.DISC1,
      DISC2: this.DISC2,
      BROKERAGE: this.BROKERAGE,
      PAYDISC: this.PAYDISC,
      TYPEOFPURCHASE: this.PurchaseArr.filter(option => option.name == this.PurchaseType.value.toString())[0].code
    };
    this.PurchaseSer.BillHSave(ObjRes).subscribe(Result => {
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
  Calculation() {
    this.PurchaseSer.PurchaseBillCalculation({ TrnNo: this.TRNNO }).subscribe(Result => {
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

  CHANGTERMS() {
    this.OldDate = new Date()
    this.DUEDATE = new Date(this.OldDate.setDate(this.DATE.getDate() + parseInt(this.TERMS)))
  }
  ChangeDueDate() {
    this.TERMS = Math.ceil(Math.abs(this.DUEDATE.getTime() - this.DATE.getTime()) / (1000 * 60 * 60 * 24))
  }
}
