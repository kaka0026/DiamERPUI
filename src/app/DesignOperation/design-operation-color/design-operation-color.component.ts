import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;
import { StyleMastService } from 'src/app/Services/DesignMast/style-mast.service';
import { MatDialog } from "@angular/material/dialog";
import { ColorDesignComponent } from '../color-design/color-design.component';
import { DatePipe } from "@angular/common";
import Swal, * as _swal from "sweetalert2";
import { environment } from '../../../environments/environment';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-design-operation-color',
  templateUrl: './design-operation-color.component.html',
  styleUrls: ['./design-operation-color.component.css']
})
export class DesignOperationColorComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  private ImageUrl = environment.ImageUrl;

  html1: any = "";

  ordersData: any = [];
  CategoryData: any = [];
  SubCategoryData: any = [];
  DesignCodeData = [];
  NAME: any = "";

  form1 = new FormGroup({
    orders: new FormControl()
  });
  form2 = new FormGroup({
    category: new FormControl()
  });
  form3 = new FormGroup({
    subcategory: new FormControl()
  });
  subcat: boolean = false;
  DesignFill: boolean = false;
  setdesign: any = "";
  Designer = new FormControl();
  Category = new FormControl();
  SubCategory = new FormControl();
  selectedOrderIds1 = [];
  selectedCatnames1 = [];
  selectedCatIds1 = [];
  selectedSubCatIds1 = [];
  selectedSubCatnames1 = [];
  DATE: any = "";
  ID: number = 0;
  DesignerCode = [];
  CategoryCode = [];
  SubCategoryCode = [];
  NEWADD: boolean = false;
  VIEW: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private DesignOprationSer: DesignOprationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private StyleMastSer: StyleMastService,
    private datePipe: DatePipe,
    private PermissionSer: PermissionService
  ) {
    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "ColorDesigne.aspx"
    }
    this.PermissionSer.PageWisePermissionFill(ObjResult25).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].ISNEWADD == "False") {
            this.NEWADD = false;
          } else {
            this.NEWADD = true;
          }
          if (Result.Data[0].ISVIEW == "False") {
            this.VIEW = false;
          } else {
            this.VIEW = true;
          }
          if (Result.Data[0].ISDELETE == "False") {
            this.DELETE = false;
          } else {
            this.DELETE = true;
          }
          if (Result.Data[0].ISEDIT == "False") {
            this.EDIT = false;
          } else {
            this.EDIT = true;
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
    this.StyleMastSer.CatagoryFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CategoryCode = Result.Data.map(item => {
            return {
              Category_Id: item.Category_Id,
              Category_Name: item.Category_Name,
            };
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.DesignOprationSer.DesignerFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.DesignerCode = Result.Data.map(item => {
            return {
              Emp_Id: item.Emp_Id,
              Emp_Name: item.Emp_Name
            };
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.Designer.disable();
    this.Designer.disabled
    this.DesignOprationSer.DesignerMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ordersData = Result.Data.map(item => {
            return {
              id: item.Designer_Code,
              name: item.Designer_Name
            };
          });
          this.form1 = this.formBuilder.group({
            orders: new FormArray([])
          });
          this.addCheckboxes();
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.DesignOprationSer.CatagoryFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CategoryData = Result.Data.map(item => {
            return {
              id: item.Category_Id,
              name: item.Category_Name
            };
          });

          this.form2 = this.formBuilder.group({
            category: new FormArray([])
          });
          this.addCheckboxesCategory();
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.Category.disable();
    this.Category.disabled
    this.SubCategory.disable();
    this.SubCategory.disabled
  }
  get ordersFormArray() {
    return this.form1.controls.orders as FormArray;
  }
  get CategoryFormArray() {
    return this.form2.controls.category as FormArray;
  }
  get SubCategoryFormArray() {
    return this.form3.controls.subcategory as FormArray;
  }
  private addCheckboxes() {
    this.ordersData.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }

  private addCheckboxesCategory() {
    this.CategoryData.forEach(() => this.CategoryFormArray.push(new FormControl(false)));
  }


  private addCheckboxesSubCategory() {

    this.SubCategoryData.forEach(() => this.SubCategoryFormArray.push(new FormControl(false)));
  }
  ngOnInit(): void {
    this.DesignCodeSlider(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 500)
  }

  DesignCodeChange() {
    const selectedOrderIds = this.form1.value.orders
      .map((checked, i) => checked ? this.ordersData[i].id : null)
      .filter(v => v !== null);
    this.selectedOrderIds1 = selectedOrderIds;
    this.DesignCodeSlider(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
  }
  fillsubcat() {
    this.DesignOprationSer.FillSubCategoryDrop({ Category_Name: this.Category.value.toString() }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SubCategoryCode = Result.Data.map(item => {
            return {
              Sub_Category_Id: item.Sub_Category_Id,
              Sub_Category_Name: item.Sub_Category_Name,
            };
          });
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.SubCategory.disable();
    this.SubCategory.disabled
  }
  CategoryCodeChange() {
    const selectedCatIds = this.form2.value.category
      .map((checked, i) => checked ? this.CategoryData[i].id : null)
      .filter(v => v !== null);
    const selectedCatnames = this.form2.value.category
      .map((checked, i) => checked ? this.CategoryData[i].name : null)
      .filter(v => v !== null);

    this.selectedCatIds1 = selectedCatIds;

    this.SubCategoryFill(this.selectedCatIds1);
    this.DesignCodeSlider(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);

  }

  SubCategoryFill(CategoeyID: any) {
    this.spinner.show();
    this.subcat = true;
    let obj = {
      Category_Id: CategoeyID.join()
    }
    this.DesignOprationSer.SubCategoryByCategoryIDFill(obj).subscribe(Result => {
      try {
        if (Result.Success == 1) {

          this.SubCategoryData = Result.Data.map(item => {
            return {
              id: item.Sub_Category_Id,
              name: item.Sub_Category_Name
            };
          });

          this.form3 = this.formBuilder.group({
            subcategory: new FormArray([])
          });

          this.addCheckboxesSubCategory();

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

  SubCategoryCodeChange() {
    this.spinner.show();
    const selectedSubCatIds = this.form3.value.subcategory
      .map((checked, i) => checked ? this.SubCategoryData[i].id : null)
      .filter(v => v !== null);

    const selectedSubCatnames = this.form3.value.subcategory
      .map((checked, i) => checked ? this.SubCategoryData[i].name : null)
      .filter(v => v !== null);
    this.selectedSubCatIds1 = selectedSubCatIds
    this.DesignCodeSlider(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
    this.spinner.hide();
  }

  DesignCodeSlider(DesgCode: any, CatCode: any, SubCat: any) {
    this.spinner.show();
    let obj = {
      Designer_Id: DesgCode.join(),
      Category_Id: CatCode.join(),
      Sub_Category_Id: SubCat.join()
    }
    this.DesignOprationSer.DesignCodeFill(obj).subscribe(Result => {
      try {

        if (Result.Success == 1) {
          this.DesignFill = true;
          let html1 = '<div id="slider_1"  class="owl-carousel owl-theme">';
          $("#WhiteDim").html('');
          this.DesignCodeData = Result.Data.map(item => {
            return {
              id: item.Id,
              name: item.DesigneCode,
              image: this.ImageUrl + item.DesigneImage
            };
          });
          if (this.DesignCodeData.length != 0) {
            for (let i = 0; i < this.DesignCodeData.length; i++) {
              html1 += '<div class="item"><div class="ymal-img"><img id="next' + i + '" style="width: 100px !important;height: 100px!important;" src="' + this.DesignCodeData[i].image + '" class="img-responsive"/> <div id="GetCode' + i + '"  class="car-txt-holder"><p>' + this.DesignCodeData[i].name + '</p></div></div></div> ';
              $(function () {
                $("#next" + i).on("error", function () {
                  $("#next" + i).attr("src", "./../../../assets/images/No-Image.jpg");
                });
              });
            }
          }
          html1 += "</div>"
          $("#WhiteDim").html(html1);
          $('.owl-slider').trigger('refresh.owl.carousel');
          $(document).ready(function () {

            $("#slider_1").each(function () {

              $(this).owlCarousel({
                loop: false,
                margin: 10,
                autoplay: false,
                autoplayTimeout: 3000,
                dots: true,
                responsive: {
                  0: {
                    items: 2
                  },
                  600: {
                    items: 4
                  },
                  1170: {
                    items: 6
                  }
                }
              });
            });
          });
          let Arr = this.DesignCodeData;
          var self = this;
          for (let i = 0; i < Arr.length; i++) {
            $(function () {
              $("#GetCode" + i).click(function () {
                self.ID = Arr[i].id;
                self.GetDesignDetail();
              })
            });
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.clear();
          $("#WhiteDim").html('');
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  GetDesignDetail() {
    this.spinner.show();
    this.DesignOprationSer.BlackWhiteFillById({ id: this.ID }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.NAME = Result.Data[0].DesigneCode;
          this.DATE = Result.Data[0].SelectedDate;
          this.Designer = new FormControl(Result.Data[0].Emp_Name);
          this.Designer.disable();
          this.Category = new FormControl(Result.Data[0].Category_Name);
          this.Category.disable();
          this.SubCategory = new FormControl(Result.Data[0].Sub_Category_Name);
          this.SubCategory.disable();
          for (let i = 0; i < Result.Data.length; i++) {
          }

          let html3 = '';
          for (let i = 0; i < Result.Data.length; i++) {
            if (this.VIEW == true) {
              if (Result.Data[i].ImageList != null) {
                html3 += '<div class="dg-dom">' +
                  '<div class="dg-dom-inner">' +
                  '<div  class="dg-dom-img"><img id="showimg' + i + '" style="height:100px; width:100px;" src="' + this.ImageUrl + Result.Data[i].ImageList + '" class="display-img img-responsive" ondblclick="ShowModel(this);"/></div>' +
                  '<div class="dg-dom-txt" id="SpanCode">' +
                  '<div class="edifnt">'
                if (this.EDIT == true) {
                  html3 += '<i id=Update' + Result.Data[i].SubDesignCode + ' class="la la-pencil-square-o icn-inln" ></i>'
                }
                if (this.DELETE == true) {
                  html3 += '<i id="DeleteImage' + Result.Data[i].SubDesignCode + '" class="la la-trash"></i>'
                }
                html3 += '</div>' + Result.Data[i].SubDesignCode + '</div></div></div>'
              }
            }
            $(function () {
              $("#showimg" + i).on("error", function () {
                $("#showimg" + i).attr("src", "./../../../assets/images/No-Image.jpg");
              });
            });
          }
          $("#DesignImage").html(html3);
          var self = this;
          for (let i = 0; i < Result.Data.length; i++) {
            $(function () {
              $("#Update" + Result.Data[i].SubDesignCode).click(function () {
                self.GetMatalcolor(Result.Data[i].SubDesignCode, Result.Data[i].ImageList);
              })
              $("#DeleteImage" + Result.Data[i].SubDesignCode).click(function () {
                Swal.fire({
                  title: "Are you sure you want to delete " + Result.Data[i].SubDesignCode + "?",
                  icon: "warning",
                  cancelButtonText: "No",
                  showCancelButton: true,
                  confirmButtonText: "Yes"
                }).then(result => {
                  self.spinner.show();
                  if (result.value) {
                    self.DesignOprationSer.RemoveImage({ DesigneCode: Result.Data[i].DesigneCode, SubDesignCode: Result.Data[i].SubDesignCode, ImageList: Result.Data[i].ImageList }).subscribe(Result => {
                      try {
                        if (Result.Success == 1) {
                          self.toastr.clear();
                          self.GetDesignDetail();
                          self.toastr.success("Deleted Successfully", "SUCCESS");
                          self.spinner.hide();
                        } else {
                          self.spinner.hide();
                          self.toastr.clear();
                          self.toastr.info("Data not found");
                        }
                      } catch (err) {
                        self.spinner.hide();
                        self.toastr.clear();
                        self.toastr.error(err);
                      }
                    });
                  } else {
                    self.spinner.hide();
                  }
                });
              })
            });
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.clear();
        this.toastr.error(err);
      }
    });
  }
  GetMatalcolor(e, m) {
    let category = "";
    if (this.Category.value.toString()) {
      const a = this.CategoryCode.find(c => c.Category_Name == this.Category.value.toString());
      category = a.Category_Id;
    }
    this.fillsubcat();
    let designer = "";
    if (this.Designer.value) {
      const c = this.DesignerCode.find(c => c.Emp_Name == this.Designer.value.toString());
      designer = c.Emp_Id;
    }
    let subcategory = "";
    setTimeout(() => {
      if (this.SubCategory.value) {
        const b = this.SubCategoryCode.find(c => c.Sub_Category_Name == this.SubCategory.value.toString());
        subcategory = b.Sub_Category_Id;
      }
      if (this.NAME != "") {
        const PRF = this.dialog.open(ColorDesignComponent, {
          width: '80%', data: {
            DesignName: this.NAME,
            Material: this.Category.value.toString(),
            Date: this.datePipe.transform(this.DATE, "MM/dd/y"),
            DesignerCode: designer,
            Category: category,
            SubCategory: subcategory,
            SubDesignCode: e,
            imagename: m
          }
        })
        PRF.afterClosed().subscribe(result => {
          this.GetDesignDetail();
          $('html').removeClass('pdr-scroll-none');
          $('.cdk-overlay-container').removeClass('pdr-scroll-active');
        });
      }
      else {
        this.toastr.clear();
        this.toastr.info("Please Select Black And White Design.");
      }
    }, 1000);
  }
  add() {
    if (this.NAME == null || this.NAME == "") {
      this.toastr.clear();
      this.toastr.warning("Please select black and white image!");
      return;
    }
    let category = "";
    if (this.Category.value.toString()) {
      const a = this.CategoryCode.find(c => c.Category_Name == this.Category.value.toString());
      category = a.Category_Id;
    }
    this.fillsubcat();
    let designer = "";
    if (this.Designer.value.toString()) {
      const c = this.DesignerCode.find(c => c.Emp_Name == this.Designer.value.toString());
      designer = c.Emp_Id;
    }
    let subcategory = "";
    setTimeout(() => {
      if (this.SubCategory.value) {
        const b = this.SubCategoryCode.find(c => c.Sub_Category_Name == this.SubCategory.value.toString());
        subcategory = b.Sub_Category_Id;
      }
      const PRF = this.dialog.open(ColorDesignComponent, {
        width: '80%', data: {
          DesignName: this.NAME,
          Material: this.Category.value.toString(),
          Date: this.datePipe.transform(this.DATE, "MM/dd/y"),
          DesignerCode: designer,
          Category: category,
          SubCategory: subcategory,
          SubDesignCode: ""
        }
      })
      PRF.afterClosed().subscribe(result => {
        this.GetDesignDetail();
        $('html').removeClass('pdr-scroll-none');
        $('.cdk-overlay-container').removeClass('pdr-scroll-active');
      });
    }, 1000);
  }
}
