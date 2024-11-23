import { Component, OnInit, Inject } from '@angular/core';
import { ClientServiceService } from 'src/app/Services/Transaction/client-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parse, format, AsYouType, isValidNumber } from 'libphonenumber-js'
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-clien-contact',
  templateUrl: './clien-contact.component.html',
  styleUrls: ['./clien-contact.component.css']
})
export class ClienContactComponent implements OnInit {
  ContactCountryCode: any = "";
  CountryList = [];
  CONPHONECODE: any = "";
  CNAME: any = "";
  CONPHONE: any = "";
  ContactID: any = "";
  CLIENTID: any = "";
  CDESIGNATION: any = "";
  constructor(
    private ClientServiceSer: ClientServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<ClienContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ClientServiceSer.ContryExtnoFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CountryList = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_EXTNO: item.CON_EXTNO,
              ConCodeName: item.ConCodeName,
              CON_SORTNAME: item.CON_SORTNAME,
              flag: 'https://flagcdn.com/' + item.CON_SORTNAME.toLowerCase() + '.svg'
            }
          });

          if (data.CCODE) {
            const toSelect3 = this.CountryList.find(c => c.CON_NAME == data.CCODE);
            this.CONPHONECODE = toSelect3.CON_EXTNO;
          }
          this.ContactID = data.contactid;
          this.CLIENTID = data.clientid;
          this.ContactCountryCode = data.diplayname;
          this.CONPHONE = data.CNO;
          this.CNAME = data.CNAME;
          this.CDESIGNATION = data.CDESIGNATION;
          this.formatPhone();
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
  }
  ContryCodeChange(e) {
    this.ContactCountryCode = e.source.triggerValue;
  }
  Save() {
    if (this.CNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Name Please", "Name");
      return;
    }
    if (this.CONPHONECODE == "") {
      this.toastr.clear()
      this.toastr.warning("Select CC Code.", "CC Code");
      return;
    }
    if (this.CONPHONE.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Phon No.", "Phone");
      return;
    }
    let ObjRes1 = {
      ID: this.ContactID == 0 ? 0 : this.ContactID,
      ClientID: this.CLIENTID,
      Name: this.CNAME,
      Designation: this.CDESIGNATION,
      Mobile_CC_Code_Name: this.ContactCountryCode == "" ? "" : this.ContactCountryCode,
      MobileNo: this.CONPHONE,
    };
    this.ClientServiceSer.ContactSave(ObjRes1).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear()
          this.toastr.success("Saved SuccessFully");
          this._mdr.close();
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
  formatPhone() {
    if (this.CONPHONE) {
      const toSelect1 = this.CountryList.find(c => c.ConCodeName == this.ContactCountryCode);
      const countryCode = toSelect1.CON_SORTNAME;
      const parsedValue = parse(this.CONPHONE, countryCode);
      if (Object.keys(parsedValue).length === 0 && parsedValue.constructor === Object) {
      }
      if (isValidNumber(parsedValue) == false) {
        this.toastr.clear()
        this.toastr.warning("Please Enter Valid Number");
      }
      const formatedValue = format(parsedValue, 'International');
      this.CONPHONE = formatedValue;
    }
  }
  Close() {
    this._mdr.close();
  }
}
