import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { StyleMastService } from "../../Services/DesignMast/style-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import PerfectScrollbar from "perfect-scrollbar";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var $: any;
export interface Lot1 {
  name: string;
  code: string;
}

export interface Lot {
  name: string;
  code: string;
}

@Component({
  selector: "app-design-link-view",
  templateUrl: "./design-link-view.component.html",
  styleUrls: ["./design-link-view.component.css"]
})
export class DesignLinkViewComponent implements OnInit {

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
  SelectRow = [];

  public noRowsTemplate;
  public loadingTemplate;
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowSelection;
  public rowHeight;
  private ImageUrl = environment.ImageUrl;

  constructor(
    private DesignOprationSer: DesignOprationService,
    private spinner: NgxSpinnerService,
    private StyleMastSer: StyleMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private _mdr: MatDialogRef<DesignLinkViewComponent>,
    @Inject(MAT_DIALOG_DATA) public valdata: any
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.Category = new FormControl();
    this.SubCategory = new FormControl();

    let Url = this.ImageUrl;
    this.columnDefs = [
      {
        width: 28,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,

      },
      {
        headerName: "Profile Image",
        field: "ImageList",
        cellStyle: { "text-align": "center" },
        width: 215,
        cellRenderer: function (params) {
          var html =
            '<div style="display:flex !important; " class="grid-btn-group">';
          if (params.data.ImageList) {
            html +=
              '<img id="image" style="width:200px;height:200px;" src="' + Url +
              params.data.ImageList +
              '"/>';
          }
          else {
            html +=
              '<img id="image" style="width:200px;height:200px;" src="./../../../assets/images/No-Image.jpg"/>';
          }
          return html + "</div>";
        }
      },
      {
        headerName: "Designe Code",
        field: "SubDesignCode",
        cellStyle: { "text-align": "center" },
        width: 270
      },

      {
        headerName: "Category Name",
        field: "Category_Name",
        cellStyle: { "text-align": "center" },
        width: 270
      },
      {
        headerName: "Sub Category Name",
        field: "Sub_Category_Name",
        cellStyle: { "text-align": "center" },
        width: 270
      }
    ];
    this.rowHeight = 200;
    this.rowSelection = "multiple";
    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $("#image").on("error", function () {
        $("#image").attr("src", "./../../../assets/images/No-Image.jpg");
      });
    })

    this.spinner.show();
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
  fillsubcat(e: any) {
    this.spinner.show();
    this.DesignOprationSer.FillSubCategoryDrop({ Category_Name: e.option.value }).subscribe(
      Result => {
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
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      }
    );
  }
  Save() {

    if (this.SelectRow.length == 0) {
      this.toastr.clear();
      this.toastr.warning("Please select one design");
      return;
    }
    this.spinner.show();
    for (let i = 0; i < this.SelectRow.length; i++) {
      let resultobj = {
        LinkDesignCode: this.SelectRow[i].LinkDesignCode == null ? 0 : this.SelectRow[i].LinkDesignCode,
        DesigneCode: this.SelectRow[i].DesigneCode,
        SettingCode: this.valdata.SettingCode,
        SettingDesigneCode: this.SelectRow[i].SubDesignCode,
        InitSettingCode: this.valdata.InitSettingCode
      };
      this.DesignOprationSer.SaveLinkDesigne(resultobj).subscribe(
        Result => {
          try {
            if (Result.Success == 1) {
              this.toastr.clear();
              this.toastr.success("Saved Successfully", "Success");
              this.spinner.hide();
            }

          } catch (err) {
            this.spinner.hide();
            this.toastr.error(err);
          }
        }
      );
    }

  }
  SearchData() {
    this.spinner.show();

    let resultobj = {
      Category_Name: this.Category.value == null ? "" : this.Category.value.toString(),
      Sub_Category_Name: this.SubCategory.value == null ? "" : this.SubCategory.value.toString(),
      SettingCode: this.valdata.SettingCode
    };

    this.DesignOprationSer.GetColorDatabySubCode(resultobj).subscribe(
      Result => {
        try {
          if (Result.Success == 1) {
            this.gridApi.setRowData(Result.Data);
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.info("Data not found");
          }
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
            ".ag-body-viewport"
          );
          const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
            ".ag-body-horizontal-scroll-viewport"
          );
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
          if (agBodyHorizontalViewport) {
            const ps = new PerfectScrollbar(agBodyHorizontalViewport);
            ps.update();
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      }
    );
  }

  onGridReady(params) {
    this.spinner.show();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    let resultobj = {
      Category_Name: this.Category.value == null ? "" : this.Category.value.toString(),
      Sub_Category_Name: this.SubCategory.value == null ? "" : this.SubCategory.value.toString(),
      SettingCode: this.valdata.SettingCode
    };
    this.DesignOprationSer.GetColorDatabySubCode(resultobj).subscribe(
      Result => {
        try {
          if (Result.Success == 1) {
            params.api.setRowData(Result.Data);
            this.spinner.hide();
          } else {
            this.spinner.hide();
            params.api.setRowData();
          }
          const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
            ".ag-body-viewport"
          );
          const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector(
            ".ag-body-horizontal-scroll-viewport"
          );
          if (agBodyViewport) {
            const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
          }
          if (agBodyHorizontalViewport) {
            const ps = new PerfectScrollbar(agBodyHorizontalViewport);
            ps.update();
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      }
    );
  }
  onSelectionChanged(event) {
    this.SelectRow = event.api.getSelectedRows();
  }
  filteredCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.CategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.Category.setValue("");
      this.CategoryCode = ""
    }
    return a;
  }
  filteredSubCategorys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.SubCategoryArr.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.SubCategory.setValue("");
      this.SubCategoryCode = ""
    }
    return a;
  }
  Close() {
    this._mdr.close();
  }
}
