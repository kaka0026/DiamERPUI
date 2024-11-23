import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-design-opration-view',
  templateUrl: './design-opration-view.component.html',
  styleUrls: ['./design-opration-view.component.css']
})
export class DesignOprationViewComponent implements OnInit {

  private ImageUrl = environment.ImageUrl;

  ordersData: any = [];
  CategoryData: any = [];
  SubCategoryData: any = [];
  DesignCodeData = [];

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

  selectedOrderIds1 = [];
  selectedCatnames1 = [];
  selectedCatIds1 = [];
  selectedSubCatIds1 = [];
  selectedSubCatnames1 = [];

  constructor(private formBuilder: FormBuilder,
    private DesignOprationSr: DesignOprationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.DesignOprationSr.DesignerMastFill({}).subscribe(Result => {
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

    this.DesignOprationSr.CatagoryFillDrop({}).subscribe(Result => {
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

  }
  ngOnInit(): void {
    this.spinner.hide();
    this.DesignCodeSlider1(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 500)
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
  DesignCodeChange() {
    const selectedOrderIds = this.form1.value.orders
      .map((checked, i) => checked ? this.ordersData[i].id : null)
      .filter(v => v !== null);
    this.selectedOrderIds1 = selectedOrderIds;
    this.DesignCodeSlider1(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
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
    this.DesignCodeSlider1(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
  }
  SubCategoryFill(CategoeyID: any) {
    this.subcat = true;
    let obj = {
      Category_Id: CategoeyID.join()
    }
    this.DesignOprationSr.SubCategoryByCategoryIDFill(obj).subscribe(Result => {
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
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }
  SubCategoryCodeChange() {
    const selectedSubCatIds = this.form3.value.subcategory
      .map((checked, i) => checked ? this.SubCategoryData[i].id : null)
      .filter(v => v !== null);

    const selectedSubCatnames = this.form3.value.subcategory
      .map((checked, i) => checked ? this.SubCategoryData[i].name : null)
      .filter(v => v !== null);
    this.selectedSubCatIds1 = selectedSubCatIds
    this.DesignCodeSlider1(this.selectedOrderIds1, this.selectedCatIds1, this.selectedSubCatIds1);
  }
  DesignCodeSlider1(DesgCode: any, CatCode: any, SubCat: any) {
    this.spinner.show();
    let obj = {
      Designer_Id: DesgCode.join(),
      Category_Id: CatCode.join(),
      Sub_Category_Id: SubCat.join()
    }
    this.DesignOprationSr.DesignCodeFill(obj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.DesignFill = true;
          let html2 = "";
          $("#WhiteDim1").html('');
          this.DesignCodeData = Result.Data.map(item => {
            return {
              id: item.Id,
              name: item.DesigneCode,
              image: this.ImageUrl + item.DesigneImage
            };
          });
          if (this.DesignCodeData.length != 0) {
            for (let i = 0; i < this.DesignCodeData.length; i++) {
              html2 += '<div class="ymal-img"><img id="next0' + i + '" style="width: 100px !important;height: 100px!important;" src="' + this.DesignCodeData[i].image + '" class="img-responsive"/> <div class="car-txt-holder"><p>' + this.DesignCodeData[i].name + '</p></div></div> ';
              $(function () {
                $("#next0" + i).on("error", function () {
                  $("#next0" + i).attr("src", "./../../../assets/images/No-Image.jpg");
                });
              });
            }
          }
          $("#WhiteDim1").html(html2);
          this.spinner.hide();
        } else {
          $("#WhiteDim1").html('');
          this.toastr.clear();
          this.spinner.hide();
        }
      } catch (err) {
        this.toastr.error(err);
        this.spinner.hide();
      }
    });
  }
}
