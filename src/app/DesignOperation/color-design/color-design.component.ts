import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import PerfectScrollbar from "perfect-scrollbar";
import { MetalColorMastService } from "../../Services/DesignMast/metal-color-mast.service";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal, * as _swal from "sweetalert2";
import * as _ from "lodash"
import { FormControl } from '@angular/forms';
import { ShapeMastService } from 'src/app/Services/Masters/shape-mast.service';
import { DesignOprationService } from 'src/app/Services/DesignOperation/design-opration.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-color-design',
  templateUrl: './color-design.component.html',
  styleUrls: ['./color-design.component.css']
})
export class ColorDesignComponent implements OnInit {

  MetalColor: FormControl;
  FilteredMetalColor: Observable<any[]>;
  MetalCode: any = "";
  lots: Lot1[] = [];
  MetalName: any = '';

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  private ImageUrl = environment.ImageUrl;
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  ProfileUplaodURL: any = "";
  profileextention: any = "";
  ProfilevalidPicName = null;
  ProfilePicBlob: File = null;
  ProfileImageName: any = "";
  MaterialArray = [];
  Material = new FormControl();
  ShapeArr = [];
  Shape = new FormControl();
  DesignCode: any = "";
  SubDesignCode: any = "";
  MaterialName: any = "";
  SourceList = [];
  DATE: any = "";
  SUBCATEGORY: any = "";
  CATEGORY: any = "";
  DESIGNER: any = "";
  SrNo: number = 0;
  imagename: any = "";

  constructor(
    public dialog: MatDialog,
    private _mdr: MatDialogRef<ColorDesignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private MetalColorMastSer: MetalColorMastService,
    private ShapeMastSer: ShapeMastService,
    private DesignOprationSer: DesignOprationService,
    private elementRef: ElementRef,
  ) {

    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.MetalColor = new FormControl();

    this.MetalColorMastSer.MetalColorFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.lots = Result.Data.map(item => {
            return {
              code: item.M_Col_Code,
              name: item.M_Col_Name
            }
          });
          this.FilteredMetalColor = this.MetalColor.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.FilteredMetalColors(lot) : this.lots.slice()))
          );
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.imagename = data.imagename;
    this.DesignCode = data.DesignName;
    this.DATE = data.Date;
    this.CATEGORY = data.Category;
    this.SUBCATEGORY = data.SubCategory;
    this.DESIGNER = data.DesignerCode;
    this.SubDesignCode = data.SubDesignCode;

    this.columnDefs = [
      {
        headerName: "Material",
        field: "M_Name_New",
        cellStyle: { "text-align": "center" },
        width: 290
      },
      {
        headerName: "Shape",
        field: "S_Name",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Action",
        field: "Id",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'

          html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'

          return html + '</div>';
        }
      },
    ];
    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {
    this.spinner.show();
    this.ShapeMastSer.MaterialMastDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialArray = Result.Data.map(item => {
            return { M_Code: item.M_Code, M_Name: item.M_Name };
          });
          this.spinner.hide();
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
          this.spinner.hide();
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
        this.spinner.hide();
      }
    });
    if (this.SubDesignCode == "") {
      this.DesignOprationSer.GetSubDesignCode({ DesigneCode: this.DesignCode }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.SubDesignCode = Result.Data[0].SubDesigneCode.length == 1 ? this.DesignCode + Result.Data[0].SubDesigneCode : Result.Data[0].SubDesigneCode;
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        } catch (err) {
          this.toastr.error(err);
          this.spinner.hide();
        }
      });
    } else {
      this.DesignOprationSer.FillColorDesign({ DesigneCode: this.DesignCode, SubDesignCode: this.SubDesignCode }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            if (Result.Data[0].MetalColor) {
              setTimeout(() => {
                const a = this.lots.find(c => c.code == Result.Data[0].MetalColor);
                setTimeout(() => {
                  this.MetalColor.setValue(a.name);
                  this.spinner.hide();
                }, 1000);
              }, 1000);
            }
            this.LoadGridData();
            this.ProfileUplaodURL = this.ImageUrl + Result.Data[0].ImageList;
          } else {
            this.spinner.hide();
          }
        } catch (err) {
          this.toastr.clear();
          this.toastr.error(err);
          this.spinner.hide();
        }
      });
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData();
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
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {

      this.SrNo = eve.data.SrNo;
      this.Material = new FormControl(eve.data.M_Name_New);
      this.MaterialChange();
      this.Shape = new FormControl(eve.data.S_Name);
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.SrNo + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.DesignOprationSer.RemoveDesign({ DesigneCode: eve.data.DesigneCode, SrNo: eve.data.SrNo }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGridData();
                this.toastr.success("Deleted Successfully", "SUCCESS");
              } else {
                this.spinner.hide();
                this.toastr.clear();
                this.toastr.warning("Something Wrong", "Warning");
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
    this.DesignOprationSer.FillDimMaterial({ DesigneCode: this.DesignCode, SubDesignCode: this.SubDesignCode.length == 1 ? this.DesignCode + this.SubDesignCode : this.SubDesignCode }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  ProPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      let ProfilePicExt = fileList[0].name.split('.').pop().toUpperCase();
      this.profileextention = fileList[0].name.split('.').pop();
      if (ProfilePicExt == 'PNG' || ProfilePicExt == 'JPG' || ProfilePicExt == 'JPEG' || ProfilePicExt == 'MP4' || ProfilePicExt == 'MOV') {
        this.ProfilevalidPicName = fileList[0].name;
        this.ProfilePicBlob = fileList[0];
        this.ProfileImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.ProfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  MaterialChange() {
    this.spinner.show();
    let materialname = this.Material.value.toString();
    const country = this.MaterialArray.find(c => c.M_Name == materialname);
    let MaterialCode = country.M_Code;
    this.DesignOprationSer.ShapeByMaterialId({ Material: MaterialCode }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ShapeArr = Result.Data.map(item => {
            return {
              S_Name: item.S_Name,
              S_Code: item.S_Code
            }

          });
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
  add() {

    if (this.Material.value == null || this.Material.value.toString() == "") {
      this.toastr.clear();
      this.toastr.info("Select Material");
      return;
    }
    else if (this.Shape.value == null || this.Shape.value.toString() == "") {
      this.toastr.clear();
      this.toastr.info("Select Shape");
      return;
    }
    this.spinner.show();
    let a = this.Material.value.toString().split('/');
    let resObj = {
      DesigneCode: this.DesignCode,
      SubDesignCode: this.SubDesignCode.length == 1 ? this.DesignCode + this.SubDesignCode : this.SubDesignCode,
      SrNo: this.SrNo = 0 ? 0 : this.SrNo,
      Material_Name: a[1],
      Shape_Name: this.Shape.value.toString(),
      Size_code: "",
      MM_code: "",
      Color_Code: "",
      Clarity_Code: ""
    };
    this.DesignOprationSer.SaveDimMaterial(resObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          this.toastr.success("Data Saved SuccessFull!!!!!");
          this.Shape.setValue("");
          this.Material.setValue("");
          this.SrNo = 0;
          this.LoadGridData();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
        this.LoadGridData();
      }
    });
  }

  Save() {
    this.spinner.show();
    let filename = '';
    if (this.ProfilePicBlob) {
      filename = this.SubDesignCode.length == 1 ? this.DesignCode + this.SubDesignCode : this.SubDesignCode + "." + this.profileextention;
    } else {
      filename = this.imagename;
    }
    let resObj1 = {
      ColorDesignId: 0,
      DesigneCode: this.DesignCode,
      SubDesignCode: this.SubDesignCode.length == 1 ? this.DesignCode + this.SubDesignCode : this.SubDesignCode,
      SelectedDate: this.DATE,
      Designercode: this.DESIGNER,
      Category: this.CATEGORY,
      SubCategory: this.SUBCATEGORY,
      MetalColor_Name: this.MetalColor.value.toString(),
      ImageList: filename
    };
    this.DesignOprationSer.SaveDisignColorDesign(resObj1).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          let formData: FormData = new FormData();
          if (this.ProfilePicBlob) {
            formData.append('files', this.ProfilePicBlob, filename)

            this.DesignOprationSer.upload(formData).subscribe(
              FillUplodRes => {
                this.ProfileUplaodURL = this.ImageUrl + filename;
                this.spinner.hide();
                this.toastr.clear();
                this.toastr.success("Data Saved SuccessFull!!!!!");
              }
            );
          } else {
            this.toastr.clear();
            this.spinner.hide();
            this.toastr.success("Data Saved SuccessFull!!!!!");
          }
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  FilteredMetalColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.lots.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.MetalColor.setValue("");
      this.MetalCode = ""
    }
    return a;
  }
  Close() {
    this._mdr.close();
  }
  CheckImg() {
    this.ProfileUplaodURL = "./../../../assets/images/No-Image.jpg";
  }
}
