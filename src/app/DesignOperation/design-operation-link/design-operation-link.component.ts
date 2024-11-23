import { Component, OnInit, ElementRef } from '@angular/core';
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import PerfectScrollbar from "perfect-scrollbar";
import { MatDialog } from "@angular/material/dialog";
import { DesignLinkViewComponent } from "../../DesignOperation/design-link-view/design-link-view.component";
import Swal, * as _swal from "sweetalert2";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import * as $ from "jquery";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-design-operation-link',
  templateUrl: './design-operation-link.component.html',
  styleUrls: ['./design-operation-link.component.css']
})
export class DesignOperationLinkComponent implements OnInit {

  SettingCode: FormControl;
  filteredSattingCode: Observable<any[]>;
  SattingCodeName: any = "";
  SettingCodeList: Lot1[] = [];
  SettingName: any = '';


  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  SetCode: any = '';
  InItSettingCode: any = '';
  NEWADD: boolean = false;
  EDIT: boolean = false;
  DELETE: boolean = false;
  VIEW: boolean = false;
  SettingFlag: boolean = false;

  private ImageUrl = environment.ImageUrl;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public rowHeight;
  public noRowsTemplate;
  public loadingTemplate;

  constructor(
    private DesignOprationSer: DesignOprationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private PermissionSer: PermissionService
  ) {
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    let _EDIT = false;
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
          _EDIT = this.DELETE;
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.SettingCode = new FormControl();

    let Url = this.ImageUrl;
    this.columnDefs = [
      {
        headerName: "Profile Image",
        field: "ImageList",
        cellStyle: { "text-align": "center" },
        width: 200,
        cellRenderer: function (params) {
          var html = '<div  class="agrid-img-holder">';
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
          return html + '</div>';
        }
      },
      {
        headerName: "Setting Code",
        field: "SettingCode",
        cellStyle: { "text-align": "center" },
        width: 170
      },
      {
        headerName: "Design Code",
        field: "SettingDesigneCode",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Category Name",
        field: "Category_Name",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Sub Category Name",
        field: "Sub_Category_Name",
        cellStyle: { "text-align": "center" },
        width: 200
      },
      {
        headerName: "Action",
        field: "LinkDesignCode",
        width: 170,
        cellStyle: { "text-align": "center" },
        cellRenderer: function (params) {
          if (_EDIT == true) {
            var html = '<div style="display:flex !important; " class="grid-btn-group">';
            html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
            return html + '</div>'
          }
        }
      }
    ];
    this.rowHeight = 200;
    this.defaultColDef = {
      resizable: true,
      autoHeight: true,
      filter: true,
      sortable: true,
      wrapText: true,
    };

  }
  ngOnInit(): void {
    $(document).ready(function () {
      $("#image").on("error", function () {
        $("#image").attr("src", "./../../../assets/images/No-Image.jpg");
      });
    })
    $('#gridshow').hide();
    this.spinner.show();
    this.DesignOprationSer.SettingCodeFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SettingCodeList = Result.Data.map(item => {
            return {
              code: item.SettingCode,
              name: item.SettingCode.toString()
            };
          });
          this.filteredSattingCode = this.SettingCode.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredSattingCodes(lot) : this.SettingCodeList.slice()))
          );
          this.SettingCode.valueChanges.subscribe(value => this.autocompletevalidation());
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.toastr.error(err);
        this.spinner.hide();
      }
    });
    this.GetSetCode();
  }
  GetSetCode() {
    this.DesignOprationSer.GETSettingCodeNew({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SetCode = Result.Data[0].NewSetting_Code;
          this.InItSettingCode = Result.Data[0].Initial_code_New;
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
  autocompletevalidation() {
    const country = this.SettingCodeList.find(c => c.name == this.SettingCode.value);
    if (country) {
      this.SettingFlag = true;
    } else {
      this.SettingFlag = false;
    }
  }

  FillSetCode() {
    this.spinner.show();
    if (this.SettingFlag == true) {
      this.SetCode = this.SettingCode.value.toString();
    }
    this.DesignOprationSer.GetSaveDesignFill({ SettingCode: this.SetCode }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.InItSettingCode = Result.Data[0].InitSettingCode;
          $('#gridshow').show();
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.gridApi.setRowData();
        }
      } catch (err) {
        this.spinner.hide();
      }
    });
  }
  Clear() {
    this.SettingCode.setValue('');
    this.SetCode = "";
    this.gridApi.setRowData();
    $('#gridshow').hide();
    this.GetSetCode();
  }
  add() {
    if (this.SettingFlag == false) {
      this.SettingCode.setValue("");
    }
    const PRF = this.dialog.open(DesignLinkViewComponent,
      {
        width: '70%', height: '96%', data: { SettingCode: this.SetCode, InitSettingCode: this.InItSettingCode }
      });
    PRF.afterClosed().subscribe(result => {
      if (this.SattingCodeName != "") {
        const country = this.SettingCodeList.find(c => c.name == this.SetCode);
        this.SettingCode.setValue(country.name);
      }
      this.FillSetCode();
    });
  }
  onGridReady(params) {
    this.spinner.show();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.DesignOprationSer.GetSaveDesignFill({ SettingCode: this.SettingCode.value.toString() }).subscribe(Result => {
      try {
        if (Result.Success == 1) {

          $('#gridshow').show();
          params.api.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          params.api.setRowData();
        }
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
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });

  }
  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete ?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.DesignOprationSer.LinktDelete({ LinkDesignCode: eve.data.LinkDesignCode }).subscribe(Result => {
            try {
              if (Result.Success == 1) {

                this.toastr.clear();
                this.toastr.success("Deleted Successfully", "SUCCESS");
                this.FillSetCode();
                this.spinner.hide();
              } else {
                this.spinner.hide();
                this.toastr.clear();
                this.toastr.info("Data not found");
              }
            } catch (err) {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.FillSetCode();
          this.spinner.hide();
        }
      });
    }
  }
  filteredSattingCodes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.SettingCodeList.filter(option => option.name.toLowerCase().includes(filterValue));
    if (a.length == 0) {
      this.SettingCode.setValue("");
      this.SattingCodeName = ""
    }
    return a;
  }
}
