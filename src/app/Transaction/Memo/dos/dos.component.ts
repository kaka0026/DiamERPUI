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

export interface Lot {
  name: string;
  code: string;
  calid: string;
}

export interface Lot2 {
  name: string;
  code: string;
  colid: string;
}

export interface Lot3 {
  name: string;
  code: string;
  szid: string;
}

@Component({
  selector: 'app-dos',
  templateUrl: './dos.component.html',
  styleUrls: ['./dos.component.css']
})
export class DOSComponent implements OnInit {
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

  FromColor: FormControl;
  filteredFromColor: Observable<any[]>;
  FromColorCode: any = "";
  FromColorArr: Lot2[] = [];
  FromColorName: any = '';

  ToColor: FormControl;
  filteredToColor: Observable<any[]>;
  ToColorCode: any = "";
  ToColorArr: Lot2[] = [];
  ToColorName: any = '';

  FromSize: FormControl;
  filteredFromSize: Observable<any[]>;
  FromSizeCode: any = "";
  FromSizeArr: Lot3[] = [];
  FromSizeName: any = '';

  ToSize: FormControl;
  filteredToSize: Observable<any[]>;
  ToSizeCode: any = "";
  ToSizeArr: Lot3[] = [];
  ToSizeName: any = '';

  FromClarity: FormControl;
  filteredFromClarity: Observable<any[]>;
  FromClarityCode: any = "";
  FromClarityArr: Lot[] = [];
  FromClarityName: any = '';

  ToClarity: FormControl;
  filteredToClarity: Observable<any[]>;
  ToClarityCode: any = "";
  ToClarityArr: Lot[] = [];
  ToClarityName: any = '';

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
  selectedPriceUnit: any = "Rs";
  TAmount: number = 0;
  PRUN: number = 0;
  selectedPurpose: any = "STOCK";
  Comment: any = "";
  OrdnerNo: any = "";
  Dollar: number = 0;
  Disbled: boolean = false;
  ToClarityFlag: boolean = false;
  FromClarityFlag: boolean = false;
  ToColorFlag: boolean = false;
  FromColorFlag: boolean = false;
  FromSizeFlag: boolean = false;
  ToSizeFlag: boolean = false;
  ShapeFlag: boolean = false;

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
    private _mdr: MatDialogRef<DOSComponent>,
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
            this.OriginCode = Result.Data.Origin;
            this.FromColorCode = Result.Data.ColorName;
            this.ToColorCode = Result.Data.ColorToName;
            this.FromClarityCode = Result.Data.ClarityName;
            this.ToClarityCode = Result.Data.ClarityToName;
            this.FromSizeCode = Result.Data.F_SIZE;
            this.ToSizeCode = Result.Data.T_SIZE;
            this.LabCode = Result.Data.CR_SORTNAME;
            this.selectedStatus = Result.Data.SIGA;
            this.SGRang = Result.Data.SIGARng;
            this.SGTo = Result.Data.ToGague;
            this.SGFrom = Result.Data.FromGague;
            this.Size = Result.Data.SizeDESC
            this.Pcs = Result.Data.Pcs;
            this.Weight = Result.Data.Weight;
            this.Unit = Result.Data.Unit;
            this.CertificateNo = Result.Data.CertiNo;
            this.selectedYN = Result.Data.Cirtified;
            this.ChnageYesNoFormat();
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
            this.OrdnerNo = Result.Data.OrderNo;
            this.Comment = Result.Data.Comment;
            this.Disbled = true;

            this.Material.disable();
            this.Material.disabled

            this.Shape.disable();
            this.Shape.disabled

            this.FromClarity.disable();
            this.FromClarity.disabled

            this.ToClarity.disable();
            this.ToClarity.disabled

            this.FromColor.disable();
            this.FromColor.disabled

            this.ToColor.disable();
            this.ToColor.disabled

            this.FromSize.disable();
            this.FromSize.disabled

            this.ToSize.disable();
            this.ToSize.disabled

            this.Origin.disable();
            this.Origin.disabled

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

    this.FromColor = new FormControl();
    this.filteredFromColor = this.FromColor.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredFromColors(lot) : this.FromColorArr.slice()))
    );

    this.ToColor = new FormControl();
    this.filteredToColor = this.ToColor.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredToColors(lot) : this.ToColorArr.slice()))
    );

    this.FromClarity = new FormControl();
    this.filteredFromClarity = this.FromClarity.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredFromClaritys(lot) : this.FromClarityArr.slice()))
    );

    this.ToClarity = new FormControl();
    this.filteredToClarity = this.ToClarity.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredToClaritys(lot) : this.ToClarityArr.slice()))
    );

    this.FromSize = new FormControl();
    this.filteredFromSize = this.FromSize.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredFromSizes(lot) : this.FromSizeArr.slice()))
    );

    this.ToSize = new FormControl();
    this.filteredToSize = this.ToSize.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredToSizes(lot) : this.ToSizeArr.slice()))
    );

    this.Origin = new FormControl();
    this.filteredOrigin = this.Origin.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredOrigins(lot) : this.OriginArr.slice()))
    );
  }

  ngOnInit(): void {
    this.FromColor.valueChanges.subscribe(value => this.autocompletevalidation("FromColor"));
    this.ToColor.valueChanges.subscribe(value => this.autocompletevalidation("ToColor"));
    this.FromClarity.valueChanges.subscribe(value => this.autocompletevalidation("FromClarity"));
    this.ToClarity.valueChanges.subscribe(value => this.autocompletevalidation("ToClarity"));
    this.FromSize.valueChanges.subscribe(value => this.autocompletevalidation("FromSize"));
    this.ToSize.valueChanges.subscribe(value => this.autocompletevalidation("ToSize"));
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
          this.Material.disable();
          this.Material.disable;
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });


    this.SelectMaterialOption();
    this.Unit = "CTS"
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
    this.Material.disable();
    this.Material.disable;
    this.MaterialCode = "FCD"
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
          this.FromClarityArr = Result.Data.map(item => {
            return {
              code: item.Q_Name,
              name: item.Q_Name,
              calid: item.Q_Code
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
          this.FromColorArr = Result.Data.map(item => {
            return {
              code: item.C_Name,
              name: item.C_Name,
              colid: item.C_Code
            };
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.MemoInSer.GetSizebyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {

      try {
        if (Result.Success == 1) {
          this.FromSizeArr = Result.Data.map(item => {
            return {
              code: item.F_SIZE.toString(),
              name: item.F_SIZE.toString(),
              szid: item.SIZE_CODE
            };
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
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
    if (this.FromClarity.value != "") {
      let fromcalid = this.FromClarityArr.find(c => c.code == this.FromClarityCode).calid;
      this.MemoInSer.GetClaritybyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {

        try {
          if (Result.Success == 1) {

            const notUndefined = anyValue => typeof anyValue !== 'undefined'
            this.ToClarityArr = Result.Data.map(item => {

              if (fromcalid <= item.Q_Code) {
                return {
                  id: item.Q_Name,
                  name: item.Q_Name,
                  colid: item.Q_Code
                };
              }
              else {
                return;
              }

            }).filter(notUndefined);
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }
  SelectColorOption() {
    if (this.FromColor.value != "") {
      let fromcolid = this.FromColorArr.find(c => c.code == this.FromColorCode).colid;
      this.MemoInSer.GetColorbyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            const notUndefined = anyValue => typeof anyValue !== 'undefined'
            this.ToColorArr = Result.Data.map(item => {
              if (fromcolid <= item.C_Code) {
                return {
                  id: item.C_Name,
                  name: item.C_Name,
                  colid: item.C_Code
                };
              }
              else {
                return;
              }

            }).filter(notUndefined);
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }

  SelectSizeOption() {
    if (this.FromSize.value != "") {
      let fromszid = this.FromSizeArr.find(c => c.code == this.FromSizeCode).szid;
      this.MemoInSer.GetSizebyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            const notUndefined = anyValue => typeof anyValue !== 'undefined'
            this.ToSizeArr = Result.Data.map(item => {
              if (fromszid == item.SIZE_CODE) {
                return {
                  id: item.T_SIZE.toString(),
                  name: item.T_SIZE.toString(),
                  szid: item.SIZE_CODE
                };
              }
              else {
                return;
              }
            }).filter(notUndefined);
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }

  autocompletevalidation(auto) {
    if (auto == "Shape") {
      const country = this.ShapeArr.find(c => c.name == this.Shape.value);
      if (country) {
        this.ShapeFlag = true;
      } else {
        this.ShapeFlag = false;
      }
    }
    if (auto == "ToSize") {
      const country = this.ToSizeArr.find(c => c.name == this.ToSize.value);
      if (country) {
        this.ToSizeFlag = true;
      } else {
        this.ToSizeFlag = false;
      }
    }
    if (auto == "FromSize") {
      const country = this.FromSizeArr.find(c => c.name == this.FromSize.value);
      if (country) {
        this.FromSizeFlag = true;
      } else {
        this.FromSizeFlag = false;
      }
    }
    if (auto == "FromColor") {
      const country = this.FromColorArr.find(c => c.name == this.FromColor.value);
      if (country) {
        this.FromColorFlag = true;
      } else {
        this.FromColorFlag = false;
      }
    }
    if (auto == "ToColor") {
      const country = this.ToColorArr.find(c => c.name == this.ToColor.value);
      if (country) {
        this.ToColorFlag = true;
      } else {
        this.ToColorFlag = false;
      }
    }
    if (auto == "FromClarity") {
      const country = this.FromClarityArr.find(c => c.name == this.FromClarity.value);
      if (country) {
        this.FromClarityFlag = true;
      } else {
        this.FromClarityFlag = false;
      }
    }
    if (auto == "ToClarity") {
      const country = this.ToClarityArr.find(c => c.name == this.ToClarity.value);
      if (country) {
        this.ToClarityFlag = true;
      } else {
        this.ToClarityFlag = false;
      }
    }
  }

  Save() {
    if (this.Shape.value == null || this.ShapeFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Shape", "Warning");
      return;
    }
    if (this.FromColor.value == null || this.FromColorFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select From Color", "Warning");
      return;
    }
    if (this.ToColor.value == null || this.ToColorFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select To Color", "Warning");
      return;
    }
    if (this.FromClarity.value == null || this.FromClarityFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select From Clarity", "Warning");
      return;
    }
    if (this.ToClarity.value == null || this.ToClarityFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select To Clarity", "Warning");
      return;
    }
    if (this.FromSize.value == null || this.FromSizeFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select From Size", "Warning");
      return;
    }
    if (this.ToSize.value == null || this.ToSizeFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select To Size", "Warning");
      return;
    }
    if (this.Pcs == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Pcs", "Warning");
      return;
    }
    if (this.Weight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.PRUN == 0) {
      this.toastr.clear();
      this.toastr.warning("Enter Asking Price", "Warning");
      return;
    } else {
      this.spinner.show();
      let resultobj = {
        TrnNo: this.valdata.trnno,
        SrNo: 0,
        Category: this.Category,
        MaterialName: this.MaterialCode,
        ShapeName: this.ShapeCode,
        FSize: this.FromSizeCode,
        TSize: this.ToSizeCode,
        SIGA: this.selectedStatus,
        FromGague: this.SGFrom,
        ToGague: this.SGTo,
        SIGARng: this.SGRang,
        Certi_Name: this.LabCode,
        ColorName: this.FromColorCode,
        ColorToName: this.ToColorCode,
        ClarityName: this.FromClarityCode,
        ClarityToName: this.ToClarityCode,
        SUPCode: "",
        Pcs: this.Pcs,
        Unit: this.Unit,
        Weight: this.Weight,
        Price: this.PRUN == undefined ? 0.00 : this.PRUN,
        Amount: this.TAmount,
        Conv: this.Dollar,
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
    if (this.selectedPriceUnit == "Rs") {
      $("#pr").css("display", "none");
      this.Dollar = 0;
      this.TAmount = this.PRUN * this.Weight;
    } else {
      $("#pr").css("display", "block");
      this.TAmount = this.PRUN * this.Weight * this.Dollar;
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

  filteredShapes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ShapeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredFromColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FromColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredToColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ToColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredFromClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FromClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredToClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ToClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;

  }

  filteredFromSizes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FromSizeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredToSizes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ToSizeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredLabs(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LabArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredOrigins(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.OriginArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
}


