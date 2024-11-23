import { Component, OnInit } from '@angular/core';
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { StyleMastService } from "../../Services/DesignMast/style-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DatePipe, formatDate } from "@angular/common";
import { PermissionService } from "../../Services/Access/permission.service";
import { environment } from '../../../environments/environment';
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
  selector: 'app-design-opration-new',
  templateUrl: './design-opration-new.component.html',
  styleUrls: ['./design-opration-new.component.css']
})
export class DesignOprationNewComponent implements OnInit {

  tomorrow = new Date();

  Designer: FormControl;
  filteredDesigner: Observable<any[]>;
  DesigneCode: any = "";
  DesignerCodeArr: Lot[] = [];
  DesigneName: any = '';

  Category: FormControl;
  filteredCategory: Observable<Lot1[]>;
  CategoryCode: any = "";
  CategoryArr: Lot1[] = [];
  CategoryName: any = '';

  ImageFileName = "";

  SubCategory: FormControl;
  filteredSubCategory: Observable<any[]>;
  SubCategoryCode: any = "";
  SubCategoryArr: Lot2[] = [];
  SubCategoryName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  private ImageUrl = environment.ImageUrl

  BlackAndWhite: any = "";
  BWID: number = 0;
  PicBlob: File = null;
  validPicName = null;
  ImageName: any = "";
  Design: any = "";
  SAVEDATE = new Date((new Date().getTime()));
  designerCode: number = 0;
  BLWHImage: any = '';
  ORIENTATION: any = "P";
  NEWADD: boolean = false;
  DesignCode: any = "";
  DesignId: any = "";
  UPDATE: boolean = false;
  DesignUpdateId: any = "";
  Flag: boolean = false;

  constructor(
    private DesignOprationSer: DesignOprationService,
    private datePipe: DatePipe,
    private StyleMastSer: StyleMastService,
    private PermissionSer: PermissionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    this.Category = new FormControl();
    this.Designer = new FormControl();
    this.SubCategory = new FormControl();
    this.DesignOprationSer.DesignerFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.DesignerCodeArr = Result.Data.map(item => {
            return {
              code: item.Emp_Id,
              name: item.Emp_Name,
              sortname: item.Emp_Code
            };
          });
          this.filteredDesigner = this.Designer.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredDesigners(lot) : this.DesignerCodeArr.slice()))
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
    this.StyleMastSer.CatagoryFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CategoryArr = Result.Data.map(item => {
            return {
              code: item.Category_Name,
              name: item.Category_Name,
              sortname: item.Initial
            };
          });
          this.filteredCategory = this.Category.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredCategorys(lot) : this.CategoryArr.slice()))
          );
          this.Category.valueChanges.subscribe(value => this.autocompletevalidation());
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
    this.tomorrow.setDate(this.tomorrow.getDate());
    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "NewBlackWhiteDesign.aspx"
    }
    this.PermissionSer.PageWisePermissionFill(ObjResult25).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].ISNEWADD == "False") {
            this.NEWADD = false;
          } else {
            this.NEWADD = true;
          }
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    if (localStorage.getItem("Id")) {
      this.DesignOprationSer.BlackWhiteFillById({ id: localStorage.getItem("Id") }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            localStorage.removeItem("Id");
            $("#clear").hide();
            this.UPDATE = true;
            this.BWID = Result.Data[0].Id;
            this.Design = Result.Data[0].DesigneCode;
            this.DesignUpdateId = Result.Data[0].DesigneId;
            this.SAVEDATE = Result.Data[0].SelectedDate;
            this.DesigneCode = Result.Data[0].Emp_Name;
            this.CategoryCode = Result.Data[0].Category_Name;
            setTimeout(() => {
              this.SubCategoryCode = Result.Data[0].Sub_Category_Name;
            }, 1000);
            this.ORIENTATION = Result.Data[0].Orientation;
            if (Result.Data.DesigneImage != "") {
              this.BlackAndWhite = this.ImageUrl + Result.Data[0].DesigneImage;
            }
            this.fillsubcat(Result.Data[0].Category_Name);
            this.ImageFileName = Result.Data[0].DesigneImage;
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      });
    }

  }
  fillsubcat(e: any) {
    this.SubCategory.setValue("");
    this.DesignOprationSer.FillSubCategoryDrop({ Category_Name: e }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SubCategoryArr = Result.Data.map(item => {
            return {
              code: item.Sub_Category_Name,
              name: item.Sub_Category_Name
            };
          });

          this.filteredSubCategory = this.SubCategory.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredSubCategorys(lot) : this.SubCategoryArr.slice()))
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }

  GetId() {
    this.spinner.show();
    this.DesignOprationSer.GetNewDesignCode({ Category_Name: this.Category.value.toString() }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.Design = Result.Data[0].Designe_Code;
          this.DesignId = Result.Data[0].Designe_Code;
          this.DesignCode = Result.Data[0].Initial_code;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }

  autocompletevalidation() {
    const country = this.CategoryArr.find(c => c.name == this.Category.value);
    if (country) {
      this.Flag = true;
    } else {
      this.Flag = false;
    }
    if (this.UPDATE == true) {
      this.Flag = true;
    }
  }

  Save() {
    if (this.SAVEDATE == null) {
      this.toastr.clear();
      this.toastr.warning("Enter Date");
      return;
    }
    if (this.Category.value == null || this.Category.value.toString() == "" || this.Flag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Category");
      return;
    }
    this.spinner.show();
    let filename = "";
    if (this.PicBlob) {
      filename = "BlackAndWhite_" + Date.now() + "_" + this.validPicName;
    } else {
      filename = this.ImageFileName;
    }
    let resObj = {
      Id: this.BWID == 0 ? 0 : this.BWID,
      DesigneCode: this.DesignId == "" ? this.Design : this.DesignId,
      DesigneId: this.DesignCode == "" ? this.DesignUpdateId : this.DesignCode,
      Designercode_Name: this.Designer.value.toString(),
      Category_Name: this.Category.value.toString(),
      Sub_Category_Name: this.SubCategory.value.toString(),
      Orientation: this.ORIENTATION,
      DesigneImage: filename,
      SelectedDate: this.datePipe.transform(this.SAVEDATE, "yyyy-MM-dd"),
      USERID: this.decodedTkn.UserId
    }
    this.DesignOprationSer.BlackWhiteSave(resObj).subscribe(Result1 => {
      try {
        if (Result1.Success == 1) {
          this.toastr.success("Saved SuccessFully");
          let formData: FormData = new FormData();
          if (this.PicBlob) {
            formData.append('files', this.PicBlob, filename)
          }
          this.DesignOprationSer.upload(formData).subscribe(
            FillUplodRes => {
              this.spinner.hide();
              this.BlackAndWhite = this.ImageUrl + filename;
            }
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });

  }
  Clear() {
    if (this.NEWADD == false) {
      this.BWID = 0;
    }
    this.Design = "";
    this.SAVEDATE = new Date((new Date().getTime()));
    this.Designer.setValue("");
    this.Category.setValue("");
    this.SubCategory.setValue("");
    this.ORIENTATION = "P";
    this.BlackAndWhite = "";
  }

  PicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      let ProfilePicExt = fileList[0].name.split('.').pop().toUpperCase();

      if (ProfilePicExt == 'PNG' || ProfilePicExt == 'JPG' || ProfilePicExt == 'JPEG' || ProfilePicExt == 'MP4' || ProfilePicExt == 'MOV') {
        this.validPicName = fileList[0].name;
        this.PicBlob = fileList[0];
        this.ImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.BlackAndWhite = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  filteredSubCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.SubCategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.CategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredDesigners(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.DesignerCodeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  setDefaultPic() {
    this.BlackAndWhite = "./../../../assets/images/No-Image.jpg";
  }
}

