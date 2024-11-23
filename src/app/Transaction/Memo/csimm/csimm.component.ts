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
  selector: 'app-csimm',
  templateUrl: './csimm.component.html',
  styleUrls: ['./csimm.component.css']
})
export class CSIMMComponent implements OnInit {
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

  Clarity: FormControl;
  filteredClarity: Observable<any[]>;
  ClarityCode: any = "";
  ClarityArr: Lot1[] = [];
  ClarityName: any = '';

  Origin: FormControl;
  filteredOrigin: Observable<any[]>;
  OriginCode: any = "";
  OriginArr: Lot1[] = [];
  OriginName: any = '';

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
  Disbled: boolean = false;
  ShapeFlag: boolean = false;
  MaterialFlag: boolean = false;

  Unit: any = "";

  UnitList = [{ id: "CTS", name: "CTS" },
  { id: "GMS", name: "GMS" }]

  constructor(
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private LabMastSer: LabMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<CSIMMComponent>,
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
            this.OriginCode = Result.Data.O_SORTNAME;
            this.ClarityCode = Result.Data.ClarityName;
            this.LabCode = Result.Data.CR_SORTNAME;
            this.selectedStatus = Result.Data.SIGA;
            this.SGRang = Result.Data.SIGARng;
            this.SGTo = Result.Data.ToGague;
            this.SGFrom = Result.Data.FromGague;
            this.Size = Result.Data.SizeDESC
            this.Pcs = Result.Data.Pcs;
            this.Weight = Result.Data.Weight;
            this.Unit = Result.Data.Unit;
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

            this.Origin.disable();
            this.Origin.disabled

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

    // this.Clarity = new FormControl();
    // this.filteredClarity = this.Clarity.valueChanges.pipe(
    //   startWith(""),
    //   map(lot => (lot ? this.filteredClaritys(lot) : this.ClarityArr.slice()))
    // );

    this.Origin = new FormControl();
    this.filteredOrigin = this.Origin.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredOrigins(lot) : this.OriginArr.slice()))
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

    this.MemoInSer.OriginFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.OriginArr = Result.Data.map(item => {
            return {
              code: item.O_SORTNAME,
              name: item.O_SORTNAME
            };
          });
        } else {
        }
      } catch (err) {
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
    }
  }
  SelectShapeOption() {
    if (this.Shape.value != "") {
    }
  }
  SelectOriginOption() {
    if (this.Origin.value != "") {
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
        FromGague: this.SGFrom,
        ToGague: this.SGTo,
        SIGARng: this.SGRang,
        Certi_Name: this.LabCode,
        ColorName: "",
        ColorToName: "",
        ClarityName: this.ClarityCode,
        ClarityToName: "",
        SUPCode: "",
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
        Origin: this.OriginCode,
        SizeDESC: this.Size,
        Cirtified: this.selectedYN,
        PPW: this.selectedPriceUnit,
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
  ChnageRangeFormat() {
    if (this.SGTo) {
      if (this.selectedStatus == "SIEVE") {
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        if (this.SGFrom > this.SGTo) {
          this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
        }
        else {
          this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
        }
      }
    } else {
      if (this.selectedStatus == "SIEVE") {
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
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

  // filteredClaritys(name: string) {
  //   const filterValue = name.toLowerCase();
  //   const a = this.ClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
  //   return a;
  // }

  filteredOrigins(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.OriginArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
}
