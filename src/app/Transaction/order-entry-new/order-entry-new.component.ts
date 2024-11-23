import { Component, OnInit } from "@angular/core";
import { OrderEntryService } from "../../Services/Transaction/order-entry.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { StyleMastService } from "../../Services/DesignMast/style-mast.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as $ from "jquery";

export interface Lot1 {
  name: string;
  code: string;
}
export interface Lot2 {
  name: string;
  code: string;
}
export interface Lot {
  name: string;
  code: string;
}

@Component({
  selector: "app-order-entry-new",
  templateUrl: "./order-entry-new.component.html",
  styleUrls: ["./order-entry-new.component.css"]
})
export class OrderEntryNewComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  ClientFlag: boolean = false;
  CategoryFlag: boolean = false;
  SubClientFlag: boolean = false;
  KTFlag: boolean = false;
  FColorFlag: boolean = false;
  TColorFlag: boolean = false;
  FClarityFlag: boolean = false;
  TClarityFlag: boolean = false;
  Category: FormControl;
  filteredCategory: Observable<any[]>;
  CategoryCode: any = "";
  CategoryArr: Lot1[] = [];
  CategoryName: any = '';

  SubCategory: FormControl;
  filteredSubCategory: Observable<any[]>;
  SubCategoryCode: any = "";
  SubCategoryArr: Lot[] = [];
  SubCategoryName: any = '';

  Client: FormControl;
  filteredClient: Observable<any[]>;
  ClientCode: any = "";
  ClientArr: Lot[] = [];
  ClientName: any = '';

  KT: FormControl;
  filteredKT: Observable<any[]>;
  KTCode: any = "";
  KTArr: Lot[] = [];
  KTName: any = '';

  FColor: FormControl;
  filteredFColor: Observable<any[]>;
  FColorCode: any = "";
  FColorArr: Lot[] = [];
  FColorName: any = '';

  TColor: FormControl;
  filteredTColor: Observable<any[]>;
  TColorCode: any = "";
  TColorArr: Lot[] = [];
  TColorName: any = '';

  FClarity: FormControl;
  filteredFClarity: Observable<any[]>;
  FClarityCode: any = "";
  FClarityArr: Lot[] = [];
  FClarityName: any = '';

  TClarity: FormControl;
  filteredTClarity: Observable<any[]>;
  TClarityCode: any = "";
  TClarityArr: Lot[] = [];
  TClarityName: any = '';

  OrderNo: number;
  Description: any = "";
  Comment;
  any = "";

  constructor(
    private OrderEntrySer: OrderEntryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private DesignOprationSer: DesignOprationService,
    private StyleMastSer: StyleMastService
  ) {
    this.Category = new FormControl();
    this.SubCategory = new FormControl();
    this.Client = new FormControl();
    this.KT = new FormControl();
    this.FColor = new FormControl();
    this.TColor = new FormControl();
    this.FClarity = new FormControl();
    this.TClarity = new FormControl();

    let resullobj = {
      ClientID: "",
      Name: "",
      C_Type: "C"
    };
    this.OrderEntrySer.ClientFill(resullobj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ClientArr = Result.Data.map(item => {
            return {
              code: item.Name,
              name: item.Name,
              sortname: item.ClientID
            };
          });
          this.filteredClient = this.Client.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredClients(lot) : this.ClientArr.slice()))
          );
          this.Client.valueChanges.subscribe(value => this.autocompletevalidation("Client"));
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.StyleMastSer.CatagoryFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CategoryArr = Result.Data.map(item => {
            return {
              name: item.Category_Name,
              code: item.Category_Name,
              sortname: item.Initial
            };
          });
          this.filteredCategory = this.Category.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredCategorys(lot) : this.CategoryArr.slice()))
          );
          this.Category.valueChanges.subscribe(value => this.autocompletevalidation("Category"));
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.OrderEntrySer.GetKTFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.KTArr = Result.Data.map(item => {
            return {
              code: item.KT_Code,
              name: item.KT_Code,
              sortname: item.KT_Desc
            };
          });
          this.filteredKT = this.KT.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredKTs(lot) : this.KTArr.slice()))
          );
          this.KT.valueChanges.subscribe(value => this.autocompletevalidation("KT"));
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.OrderEntrySer.GetColorDDLill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.FColorArr = Result.Data.map(item => {
            return {
              code: item.C_SortName,
              name: item.C_SortName,
              sortname: item.C_Name
            };
          });

          this.TColorArr = Result.Data.map(item => {
            return {
              code: item.C_SortName,
              name: item.C_SortName,
              sortname: item.C_Name
            };
          });
          this.filteredFColor = this.FColor.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredFColors(lot) : this.FColorArr.slice()))
          );
          this.FColor.valueChanges.subscribe(value => this.autocompletevalidation("FColor"));
          this.TColor.valueChanges.subscribe(value => this.autocompletevalidation("TColor"));
          this.filteredTColor = this.TColor.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredTColors(lot) : this.TColorArr.slice()))
          );
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.OrderEntrySer.GetClarityDDLill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.FClarityArr = Result.Data.map(item => {
            return {
              code: item.Q_Name,
              name: item.Q_Name,
              sortname: item.Q_SortName
            };
          });

          this.TClarityArr = Result.Data.map(item => {
            return {
              code: item.Q_Name,
              name: item.Q_Name,
              sortname: item.Q_SortName
            };
          });
          this.filteredFClarity = this.FClarity.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredFClaritys(lot) : this.FClarityArr.slice()))
          );
          this.FClarity.valueChanges.subscribe(value => this.autocompletevalidation("FClarity"));
          this.TClarity.valueChanges.subscribe(value => this.autocompletevalidation("TClarity"));
          this.filteredTClarity = this.TClarity.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredTClaritys(lot) : this.TClarityArr.slice()))
          );
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }


  ngOnInit(): void {

    if (localStorage.getItem("OrderNo")) {
      setTimeout(() => {
        this.spinner.show();
        this.OrderEntrySer.GetOderEntryFill(
          { OrderNo: localStorage.getItem("OrderNo") }
        ).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              $("#clear").hide();
              localStorage.removeItem("OrderNo");
              this.OrderNo = Result.Data[0].OrderNo;
              this.Description = Result.Data[0].Description;
              this.CategoryCode = Result.Data[0].CategoryName;
              this.fillsubcat1(this.CategoryCode);
              setTimeout(() => {
                this.SubCategoryCode = Result.Data[0].SubCategoryName;
                this.FClarityCode = Result.Data[0].FromCla;
                this.TClarityCode = Result.Data[0].ToCla;
                this.spinner.hide();
              }, 1000);
              this.KTCode = Result.Data[0].FromKTCode;
              this.FColorCode = Result.Data[0].FromColor;
              this.TColorCode = Result.Data[0].ToColor;
              this.Comment = Result.Data[0].Comment;
              if (Result.Data[0].ClientName) {
                this.Client.setValue(Result.Data[0].ClientName);
              }
            } else {
            }
          } catch (err) {
            this.toastr.error(err);
          }
        });
      }, 1000);
    } else {
      this.OrderEntrySer.GetOrderNo({}).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.OrderNo = Result.Data[0].OrderNo;
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        } catch (err) {
          this.toastr.error(err);
          this.spinner.hide();
        }
      });
      this.spinner.hide();
    }
  }
  fillsubcat1(e: any) {
    this.DesignOprationSer.FillSubCategoryDrop({ Category_Name: e }).subscribe(
      Result => {
        try {

          if (Result.Success == 1) {
            this.SubCategoryArr = Result.Data.map(item => {
              return {
                name: item.Sub_Category_Name,
                code: item.Sub_Category_Name
              };
            });
            this.filteredSubCategory = this.SubCategory.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredSubCategorys(lot) : this.SubCategoryArr.slice()))
            );
            this.SubCategory.valueChanges.subscribe(value => this.autocompletevalidation("SubCategory"));
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      }
    );
  }
  fillsubcat(e: any) {
    this.spinner.show();
    this.DesignOprationSer.FillSubCategoryDrop({ Category_Name: e }).subscribe(
      Result => {
        try {
          if (Result.Success == 1) {
            this.SubCategoryArr = Result.Data.map(item => {
              return {
                name: item.Sub_Category_Name,
                code: item.Sub_Category_Name
              };
            });
            this.filteredSubCategory = this.SubCategory.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredSubCategorys(lot) : this.SubCategoryArr.slice()))
            );
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      }
    );
  }
  SelectClientOption() {
  }
  //this.filteredClient
  autocompletevalidation(auto) {
    if (auto == "Client") {
      const country = this.ClientArr.find(c => c.name == this.Client.value);
      if (country) {
        this.ClientFlag = true;
      } else {
        this.ClientFlag = false;
      }
    }
    if (auto == "Category") {
      const country = this.CategoryArr.find(c => c.name == this.Category.value);
      if (country) {
        this.CategoryFlag = true;
      } else {
        this.CategoryFlag = false;
      }
    }
    if (auto == "SubCategory") {
      const country = this.SubCategoryArr.find(c => c.name == this.SubCategory.value);
      if (country) {
        this.SubClientFlag = true;
      } else {
        this.SubClientFlag = false;
      }
    }
    if (auto == "KT") {
      const country = this.KTArr.find(c => c.name == this.KT.value);
      if (country) {
        this.KTFlag = true;
      } else {
        this.KTFlag = false;
      }
    }
    if (auto == "FColor") {
      const country = this.FColorArr.find(c => c.name == this.FColor.value);
      if (country) {
        this.FColorFlag = true;
      } else {
        this.FColorFlag = false;
      }
    }
    if (auto == "TColor") {
      const country = this.TColorArr.find(c => c.name == this.TColor.value);
      if (country) {
        this.TColorFlag = true;
      } else {
        this.TColorFlag = false;
      }
    }
    if (auto == "FClarity") {
      const country = this.FClarityArr.find(c => c.name == this.FClarity.value);
      if (country) {
        this.FClarityFlag = true;
      } else {
        this.FClarityFlag = false;
      }
    }
    if (auto == "TClarity") {
      const country = this.TClarityArr.find(c => c.name == this.TClarity.value);
      if (country) {
        this.TClarityFlag = true;
      } else {
        this.TClarityFlag = false;
      }
    }
  }

  SelectKTOption() { }
  Save() {
    if (this.Client.value == "") {
      this.toastr.clear();
      this.toastr.warning("Select Client", "Warning");
      return;
    }
    if (this.Category.value == "") {
      this.toastr.clear();
      this.toastr.warning("Select Category", "Warning");
      return;
    }
    if (this.SubCategory.value == "") {
      this.toastr.clear();
      this.toastr.warning("Enter SubCategory", "Warning");
      return;
    }
    if (this.KT.value == "") {
      this.toastr.clear();
      this.toastr.warning("Enter KT", "Warning");
      return;
    }
    if (this.Description.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Description", "Warning");
      return;
    } else {
      this.spinner.show();
      let resultobj = {
        OrderNo: this.OrderNo,
        ClientName: this.ClientCode,
        Description: this.Description,
        CategoryName: this.CategoryCode,
        SubCategoryName: this.SubCategoryCode,
        FromKTCode: this.KTCode,
        ToKTCode: "",
        FromColor: this.FColorCode,
        ToColor: this.TColorCode,
        FromCla: this.FClarityCode,
        ToCla: this.TClarityCode,
        Comment: this.Comment,
        EnteryBy: this.decodedTkn.UserId
      };

      this.OrderEntrySer.OrderEntrySaveUpdate(resultobj).subscribe(Result => {
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

  Clear() {
    this.Comment = "";
    this.Description = "";
    this.ClientCode = "";
    this.CategoryCode = "";
    this.SubCategoryCode = "";
    this.KTCode = "";
    this.FColorCode = "";
    this.TColorCode = ""
    this.FClarityCode = ""
    this.TClarityCode = "";
  }

  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.CategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.Category.setValue("");
    //   this.CategoryCode = ""
    // }
    return a;
  }

  filteredSubCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.SubCategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.SubCategory.setValue("");
    //   this.SubCategoryCode = ""
    // }
    return a;
  }

  filteredKTs(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.KTArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.KT.setValue("");
    //   this.KTCode = ""
    // }
    return a;
  }

  filteredClients(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ClientArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.Client.setValue("");
    //   this.ClientCode = ""
    // }
    return a;
  }

  filteredTColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.TColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.TColor.setValue("");
    //   this.TColorCode = ""
    // }
    return a;
  }

  filteredFColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FColorArr.filter(option => option.name.toLowerCase().includes(filterValue));;
    // if (a.length == 0) {
    //   this.FColor.setValue("");
    //   this.FColorCode = ""
    // }
    return a;
  }

  filteredTClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.TClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.TClarity.setValue("");
    //   this.TClarityCode = ""
    // }
    return a;
  }

  filteredFClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.FClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    // if (a.length == 0) {
    //   this.FClarity.setValue("");
    //   this.FClarityCode = ""
    // }
    return a;
  }
}
