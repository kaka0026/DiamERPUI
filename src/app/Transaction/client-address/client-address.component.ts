import { Component, OnInit, Inject } from '@angular/core';
import { ClientServiceService } from "../../Services/Transaction/client-service.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.css']
})
export class ClientAddressComponent implements OnInit {

  RESCOUNTRY: any = "";
  ResCountryFill = [];
  ResStateFill = [];
  RESSTATE: any = "";
  RESCITY: any = "";
  ResCityFill = [];
  ResZIPFill = [];
  mobile1List = [];
  mobile2List = [];
  ZIP: any = "";
  ID: number = 0;
  CityName: any = "";
  CountryName: any = "";
  StateName: any = "";
  DATARESULT: any;
  AddressName: any = "";
  Address: any = "";
  ApartmentOP: any = "";
  primary: boolean = false;

  constructor(
    private ClientServiceSer: ClientServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<ClientAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.DATARESULT = data;
    this.ClientServiceSer.ContryFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResCountryFill = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_CODE: item.CON_CODE
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
    if (this.DATARESULT.DATARESULT) {
      this.RESCOUNTRY = this.DATARESULT.DATARESULT.Country
      this.RescountryChanged();
      this.RESSTATE = this.DATARESULT.DATARESULT.State
      this.ResstateChanged();
      this.RESCITY = this.DATARESULT.DATARESULT.City
      this.ResCityChanged();
      this.ZIP = this.DATARESULT.DATARESULT.Zip
      this.AddressName = this.DATARESULT.DATARESULT.Address_Name
      this.Address = this.DATARESULT.DATARESULT.Address
      this.ApartmentOP = this.DATARESULT.DATARESULT.Apartment_OP
      this.CountryName = this.DATARESULT.DATARESULT.Country_Name
      this.StateName = this.DATARESULT.DATARESULT.State_Name
      this.CityName = this.DATARESULT.DATARESULT.City_Name
      this.ID = this.DATARESULT.DATARESULT.ID
      this.ZIP = this.DATARESULT.DATARESULT.Zip
      this.primary = this.DATARESULT.DATARESULT.primary
    }
  }
  getrescountry(e) {
    this.CountryName = e;
  }
  RescountryChanged() {
    this.spinner.show();
    this.RESCITY = "";
    this.RESSTATE = "";
    this.ResCityFill = [];
    this.ResStateFill = [];
    this.ClientServiceSer.StateFill({ CON_NAME: this.RESCOUNTRY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResStateFill = Result.Data.map(item => {
            return {
              REG_NAME: item.REG_NAME,
              REG_CODE: item.REG_CODE
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
  getresstate(e) {
    this.StateName = e;
  }
  ResstateChanged() {
    this.spinner.show();
    this.RESCITY = "";
    this.ResCityFill = [];
    this.ClientServiceSer.CityFill({ CONNAME: this.RESCOUNTRY, REGCODE: this.RESSTATE }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResCityFill = Result.Data.map(item => {
            return {
              CITY_NAME: item.CITY_NAME,
              CITY_CODE: item.CITY_CODE
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
  getrescity(e) {
    this.CityName = e;
  }
  ResCityChanged() {

  }
  Save() {
    if (this.AddressName.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Please Enter AddressName");
      return;
    }
    if (this.Address.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Please Enter Address");
      return;
    }
    if (this.CountryName == "") {
      this.toastr.clear()
      this.toastr.warning("Please select CountryName");
      return;
    }
    if (this.StateName == "") {
      this.toastr.clear()
      this.toastr.warning("Please select StateName");
      return;
    }
    if (this.CityName == "") {
      this.toastr.clear()
      this.toastr.warning("Please select CityName");
      return;
    }
    if (this.ZIP == "") {
      this.toastr.clear()
      this.toastr.warning("Please select ZIPCode");
      return;
    }
    let ResultObj = {
      ID: this.ID,
      ClientID: this.DATARESULT.clientid,
      Address_Name: this.AddressName,
      Address: this.Address,
      Apartment_OP: this.ApartmentOP,
      Country_Name: this.CountryName,
      State_Name: this.StateName,
      City_Name: this.CityName,
      Zip: this.ZIP,
      primary: this.primary
    };
    this.ClientServiceSer.ClientAddSave(ResultObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear()
          this.toastr.success("Saved SuccessFully");
          this._mdr.close("SAVE");
        } else {
          this.toastr.clear()
          this.toastr.warning("Something Went Wrong");
        }
      } catch (err) {
        this.toastr.clear()
        this.toastr.error(err);
      }
    });
  }
  Close() {
    this._mdr.close("CLOSE");
  }
  ZIPCHANGE() {
    this.ClientServiceSer.ZipCodeFillstart({ ZIP_CODE: this.ZIP }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.RESCOUNTRY = Result.Data.CON_CODE;
          this.RescountryChanged();
          this.RESSTATE = Result.Data.REG_CODE;
          this.ResstateChanged();
          this.RESCITY = Result.Data.CITY_CODE;
          this.StateName = Result.Data.REG_NAME;
          this.CityName = Result.Data.CITY_NAME;
          this.CountryName = Result.Data.CON_NAME;
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
