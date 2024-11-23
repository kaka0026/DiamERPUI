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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-pe',
  templateUrl: './pe.component.html',
  styleUrls: ['./pe.component.css']
})
export class PEComponent implements OnInit {
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

  Category: any = "";
  Size: any = "";
  selectedStatus: any = "";
  SGTo: number = 0;
  SGFrom: number = 0;
  SGRang: any = "";
  selectedYN: any = "Yes";
  CertificateNo: any = "";
  Weight: number = 0;
  Pcs: number = 0;
  selectedPriceUnit: any = "Pec";
  TAmount: number = 0;
  PRUN: number = 0;
  selectedPurpose: any = "STOCK";
  Comment: any = "";
  OrdnerNo: any = "";
  DrStatus1: any = "";
  SupCode: any = "";

  Unit: any = "";
  Disbled: boolean = false;
  MaterialFlag: boolean = false;
  ShapeFlag: boolean = false;

  UnitList = [{ id: "CTS", name: "CTS" },
  { id: "GMS", name: "GMS" }]
  DrStatusList = [{ id: "YES", name: "YES" },
  { id: "NO", name: "NO" }]

  constructor(
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private LabMastSer: LabMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<PEComponent>,
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
            this.ClarityCode = Result.Data.ClarityName;
            this.DrStatus1 = Result.Data.DrStatus
            this.LabCode = Result.Data.CR_SORTNAME;
            this.ColorCode = Result.Data.ColorName;
            this.selectedStatus = Result.Data.SIGA;
            this.SGRang = Result.Data.SIGARng;
            this.SGTo = Result.Data.ToGague;
            this.SGFrom = Result.Data.FromGague;
            this.Size = Result.Data.SizeDESC
            this.Pcs = Result.Data.Pcs;
            this.Weight = Result.Data.Weight;
            this.Unit = Result.Data.Unit;
            this.SupCode = Result.Data.SUPCode;
            this.selectedPriceUnit = Result.Data.FromGague;
            this.CertificateNo = Result.Data.CertiNo;
            this.selectedPriceUnit = Result.Data.PPW;
            this.ChnagePriceCal();
            this.selectedYN = Result.Data.Cirtified;
            this.ChnageYesNoFormat();
            this.PRUN = Result.Data.Price;
            this.TAmount = Result.Data.Amount;
            if (Result.Data.OrderNo) {
              this.selectedPurpose = "ORDER";
            } else {
              this.selectedPurpose = "STOCK";
            }
            this.ChnagePricePurpose();
            this.OrdnerNo = Result.Data.OrderNo;
            this.Comment = Result.Data.Comment;
            this.Disbled = true;

            this.Material.disable();
            this.Material.disabled

            this.Shape.disable();
            this.Shape.disabled

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
  }

  ngOnInit(): void {
    this.Material.valueChanges.subscribe(value => this.autocompletevalidation("Material"));
    this.Shape.valueChanges.subscribe(value => this.autocompletevalidation("Shape"));

    this.ChnageYesNoFormat();
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



    this.LabMastSer.LBMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.LabArr = Result.Data.map(item => {
            return {
              code: item.CR_SORTNAME,
              name: item.CR_SORTNAME
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
  SelectColorOption() {
    if (this.Color.value != "") {
    }
  }
  SelectClarityOption() {
    if (this.Clarity.value != "") {
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
    if (this.Weight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.Unit == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Unit", "Warning");
      return;
    } else {
      this.spinner.show();
      let resultobj = {
        TrnNo: this.valdata.trnno,
        SrNo: 0,
        Category: this.Category,
        MaterialName: this.MaterialCode,
        ShapeName: this.ShapeCode,
        FSize: 0.00,
        TSize: 0.00,
        SIGA: this.selectedStatus,
        FromGague: 0.00,
        ToGague: 0.00,
        SIGARng: "",
        Certi_Name: this.LabCode,
        ColorName: this.ColorCode,
        ColorToName: "",
        ClarityName: this.ClarityCode,
        ClarityToName: "",
        SUPCode: this.SupCode,
        Pcs: this.Pcs,
        Unit: this.Unit,
        Weight: this.Weight,
        Price: this.PRUN == undefined ? 0.00 : this.PRUN,
        Amount: this.TAmount,
        Conv: 0.00,
        Purpose: this.selectedPurpose,
        OrderNo: this.OrdnerNo,
        Comment: this.Comment,
        CreateBy: this.decodedTkn.UserId,
        CertiNo: this.CertificateNo,
        Flo_Name: "0",
        Disc: 0.00,
        Origin: "",
        SizeDESC: "0",
        Cirtified: this.selectedYN,
        PPW: this.selectedPriceUnit,
        DrStatus: this.DrStatus1
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
  ChnageRangeFormat() {
    if (this.SGTo) {
      if (this.selectedStatus == "SIEVE") {
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        if (this.SGFrom > this.SGTo) {
          this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
        }
        else {
          this.SGRang = this.SGFrom + "mm-" + this.SGTo + "mm";
        }
      }
    } else {
      if (this.selectedStatus == "SIEVE") {
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        this.SGRang = this.SGFrom + "mm-" + this.SGTo + "mm";
      }
    }
  }
  ChnageYesNoFormat() {
    if (this.selectedYN == "Yes") {
      $("#lb").css("opacity", "1");
      $("#certno").css("opacity", "1");
    } else {
      $("#lb").css("opacity", "0");
      $("#certno").css("opacity", "0");
    }
  }
  ChnagePriceCal() {
    if (this.selectedPriceUnit == "Pec") {
      this.TAmount = this.PRUN * this.Pcs;
    } else {
      this.TAmount = this.PRUN * this.Weight;
    }
  }
  ChnagePricePurpose() {
    if (this.selectedPurpose == "ORDER") {
      $("#ord").css("display", "block");
    } else {
      $("#ord").css("display", "none");
    }
  }

  filteredmaterials(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MaterialArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredLabs(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LabArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredShapes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ShapeArr.filter(option => option.name.toLowerCase().includes(filterValue));
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


