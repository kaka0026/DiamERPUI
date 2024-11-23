import { Component, OnInit, Inject } from "@angular/core";
import { MemoInService } from "../../../Services/Transaction/memo-in.service";
import { LabMastService } from "../../../Services/Masters/lab-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as $ from "jquery";
import { ColMastService } from "../../../Services/Masters/col-mast.service";
import { FluorescenceMastService } from "../../../Services/Masters/fluorescence-mast.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-cert',
  templateUrl: './cert.component.html',
  styleUrls: ['./cert.component.css']
})
export class CERTComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  Material: FormControl;
  filteredMaterial: Observable<any[]>;
  MaterialCode: any = "";
  MaterialArr: Lot1[] = [];
  MaterialName: any = '';

  Shape: FormControl;
  filteredShape: Observable<any[]>;
  ShapeCode: any = "";
  ShapeArr: Lot1[] = [];
  ShapeName: any = '';

  Lab: FormControl;
  filteredLab: Observable<any[]>;
  LabCode: any = "";
  LabArr: Lot1[] = [];
  LabName: any = '';

  Color: FormControl;
  filteredColor: Observable<any[]>;
  ColorCode: any = "";
  ColorArr: Lot1[] = [];
  ColorName: any = '';

  Clarity: FormControl;
  filteredClarity: Observable<any[]>;
  ClarityCode: any = "";
  ClarityArr: Lot1[] = [];
  ClarityName: any = '';

  Floro: FormControl;
  filteredFloro: Observable<any[]>;
  FloroCode: any = "";
  FloroArr: Lot1[] = [];
  FloroName: any = '';

  Category: any = "";
  CertificateNo: any = "";
  WT: number = 0;
  RapPrice: any = "";
  Disc: any = "";
  Unit: any = "CTS";
  Dollar: number = 0;
  PRUN: number = 0;
  TAmount: number = 0.00;
  selectedPriceUnit: any = "Rs";
  selectedPurpose: any = "STOCK";
  Comment: any = ""
  OrderNo: any = ""
  OrdnerNo: any = "";
  Disbled: boolean = false;
  MaterialFlag: boolean = false;
  ShapeFlag: boolean = false;
  LabFlag: boolean = false;
  ColorFlag: boolean = false;
  ClarityFlag: boolean = false;
  FloroFlag: boolean = false;

  constructor(
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private LabMastSer: LabMastService,
    private FluorescenceMastSer: FluorescenceMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<CERTComponent>,
    @Inject(MAT_DIALOG_DATA) public valdata: any
  ) {
    this.Category = valdata.sortname;
    if (valdata.SrNo != "") {
      this.MemoInSer.AllMemoLFill(
        { TrnNo: valdata.trnno, SrNo: valdata.SrNo }
      ).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            $("#save").hide();
            this.MaterialCode = Result.Data.M_SortName;
            this.SelectMaterialOption();
            this.ShapeCode = Result.Data.S_SortName;
            this.ColorCode = Result.Data.ColorToName;
            this.FloroCode = Result.Data.FLO_SORTNAME;
            this.RapPrice = Result.Data.Rap;
            this.Disc = Result.Data.Disc;
            this.ClarityCode = Result.Data.ClarityName;
            this.LabCode = Result.Data.CR_SORTNAME;
            this.WT = Result.Data.Weight;
            this.Unit = Result.Data.Unit;
            this.CertificateNo = Result.Data.CertiNo;
            this.Dollar = Result.Data.Conv;
            if (Result.Data.Conv) {
              this.selectedPriceUnit = "Dol";
            } else {
              this.selectedPriceUnit = "Rs";
            }
            this.ChnagePriceCal();
            this.PRUN = Result.Data.Price;
            this.TAmount = Result.Data.Amount;
            if (Result.Data.OrderNo) {
              this.selectedPurpose = "ORDER";
            } else {
              this.selectedPurpose = "STOCK";
            }
            this.ChnagePricePurpose();
            this.OrderNo = Result.Data.OrderNo;
            this.Comment = Result.Data.Comment;
            this.Disbled = true;

            this.Material.disable();
            this.Material.disabled

            this.Shape.disable();
            this.Shape.disabled

            this.Floro.disable();
            this.Floro.disabled

            this.Color.disable();
            this.Color.disabled

            this.Clarity.disable();
            this.Clarity.disabled

            this.Lab.disable();
            this.Lab.disabled
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }

    this.Material = new FormControl();
    this.filteredMaterial = this.Material.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredmaterials(lot) : this.MaterialArr.slice()))
    );

    this.Shape = new FormControl();
    this.filteredShape = this.Shape.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredShapes(lot) : this.ShapeArr.slice()))
    );

    this.Lab = new FormControl();
    this.filteredLab = this.Lab.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredLabs(lot) : this.LabArr.slice()))
    );

    this.Color = new FormControl();
    this.filteredColor = this.Color.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredColors(lot) : this.ColorArr.slice()))
    );

    this.Clarity = new FormControl();
    this.filteredClarity = this.Clarity.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredClaritys(lot) : this.ClarityArr.slice()))
    );

    this.Floro = new FormControl();
    this.filteredFloro = this.Floro.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredFloros(lot) : this.FloroArr.slice()))
    );
  }

  ngOnInit(): void {
    this.Material.valueChanges.subscribe(value => this.autocompletevalidation("Material"));
    this.Color.valueChanges.subscribe(value => this.autocompletevalidation("Color"));
    this.Floro.valueChanges.subscribe(value => this.autocompletevalidation("Floro"));
    this.Lab.valueChanges.subscribe(value => this.autocompletevalidation("Lab"));
    this.Clarity.valueChanges.subscribe(value => this.autocompletevalidation("Clarity"));
    this.Shape.valueChanges.subscribe(value => this.autocompletevalidation("Shape"));

    this.MemoInSer.MaterialFillbyMemoName({ M_cat_SortName: this.Category }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialArr = Result.Data.map(item => {
            return {
              code: item.CODE,
              name: item.CODE
            };
          });
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.FluorescenceMastSer.FloMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.FloroArr = Result.Data.map(item => {
            return {
              code: item.FLO_SORTNAME,
              name: item.FLO_SORTNAME
            };
          });
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.LabMastSer.LBMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.LabArr = Result.Data.map(item => {
            return {
              code: item.CR_NAME,
              name: item.CR_NAME
            };
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  SelectMaterialOption() {
    if (this.Material.value != "") {
      this.MemoInSer.GetShapebyMaterial(
        { M_Sortname: this.MaterialCode }
      ).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.ShapeArr = Result.Data.map(item => {
              return {
                code: item.S_SortName,
                name: item.S_SortName
              };
            });
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
      this.MemoInSer.GetClaritybyMaterial(
        { M_SortName: this.MaterialCode }
      ).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.ClarityArr = Result.Data.map(item => {
              return {
                code: item.Q_Name,
                name: item.Q_Name
              };
            });
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });

      this.MemoInSer.GetColorbyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {

        try {
          if (Result.Success == 1) {
            this.ColorArr = Result.Data.map(item => {
              return {
                code: item.C_Name,
                name: item.C_Name
              };
            });
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }
  SelectShapeOption() {
    if (this.Shape.value != "") {
    }
  }
  SelectClarityOption() {
    if (this.Clarity.value != "") {
    }
  }
  SelectColorOption() {
    if (this.Color.value != "") {
    }
  }
  SelectFloOption() {
    if (this.Floro.value != "") {
    }
  }
  ChnagePriceCal() {
    if (this.selectedPriceUnit == "Dol") {
      $("#pr").show();
      this.TAmount = this.WT * this.PRUN * this.Dollar
    } else {
      $("#pr").hide();
      this.TAmount = this.WT * this.PRUN
      this.Dollar = 0;
    }
  }
  ChnagePricePurpose() {
    if (this.selectedPurpose == "ORDER") {
      $("#ord").css("display", "block");
    } else {
      $("#ord").css("display", "none");
    }
  }
  autocompletevalidation(auto) {
    if (auto == "Material") {
      const country = this.MaterialArr.find(c => c.name == this.Material.value);
      if (country) {
        this.MaterialFlag = true;
      } else {
        this.MaterialFlag = false;
      }
    }
    if (auto == "Shape") {
      const country = this.ShapeArr.find(c => c.name == this.Shape.value);
      if (country) {
        this.ShapeFlag = true;
      } else {
        this.ShapeFlag = false;
      }
    }
    if (auto == "Lab") {
      const country = this.LabArr.find(c => c.name == this.Lab.value);
      if (country) {
        this.LabFlag = true;
      } else {
        this.LabFlag = false;
      }
    }
    if (auto == "Color") {
      const country = this.ColorArr.find(c => c.name == this.Color.value);
      if (country) {
        this.ColorFlag = true;
      } else {
        this.ColorFlag = false;
      }
    }
    if (auto == "Clarity") {
      const country = this.ClarityArr.find(c => c.name == this.Clarity.value);
      if (country) {
        this.ClarityFlag = true;
      } else {
        this.ClarityFlag = false;
      }
    }
    if (auto == "Floro") {
      const country = this.FloroArr.find(c => c.name == this.Floro.value);
      if (country) {
        this.FloroFlag = true;
      } else {
        this.FloroFlag = false;
      }
    }
  }
  Save() {
    if (this.MaterialCode.trim() == "" || this.MaterialFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Material", "Warning");
      return;
    }
    if (this.ShapeCode.trim() == "" || this.ShapeFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Shape", "Warning");
      return;
    }
    if (this.WT == 0) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.LabCode.trim() == "" || this.LabFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Enter Lab", "Warning");
      return;
    }
    if (this.ColorCode.trim() == "" || this.ColorFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Enter Color", "Warning");
      return;
    }
    if (this.ClarityCode.trim() == "" || this.ClarityFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Enter Clarity", "Warning");
      return;
    }
    if (this.Disc == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Clarity", "Warning");
      return;
    }
    if (this.FloroCode.trim() == "" || this.FloroFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Enter Fluoro", "Warning");
      return;
    }
    else {
      this.spinner.show();
      let resultobj = {
        TrnNo: this.valdata.trnno,
        SrNo: 0,
        Category: this.Category,
        MaterialName: this.MaterialCode,
        ShapeName: this.ShapeCode,
        FSize: 0.00,
        TSize: 0.00,
        SIGA: "",
        FromGague: 0.00,
        ToGague: 0.00,
        SIGARng: "",
        Certi_Name: this.LabCode,
        ColorName: "",
        ColorToName: this.ColorCode,
        ClarityName: this.ClarityCode,
        ClarityToName: "",
        SUPCode: "",
        Pcs: 0,
        Rap: this.RapPrice,
        Unit: this.Unit,
        Weight: this.WT,
        Price: this.PRUN == undefined ? 0.00 : this.PRUN,
        Amount: this.TAmount,
        Conv: this.Dollar,
        Purpose: this.selectedPurpose,
        OrderNo: this.OrderNo,
        Comment: this.Comment,
        CreateBy: this.decodedTkn.UserId,
        CertiNo: this.CertificateNo,
        Flo_Name: this.FloroCode,
        Disc: this.Disc,
        Origin: "",
        SizeDESC: "0",
        Cirtified: "0",
        PPW: "0",
        DrStatus: "0"
      };

      this.MemoInSer.MemoSaveCSImm(resultobj).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.toastr.clear();
            this.toastr.success("Saved Successfully");
            this.spinner.hide();
          } else {
            this.toastr.clear();
            this.toastr.success("Something is wrong");
            this.spinner.hide();
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      });
    }
  }
  Close() {
    this._mdr.close();
  }

  filteredmaterials(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MaterialArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredShapes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ShapeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredLabs(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LabArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredFloros(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FloroArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
}
