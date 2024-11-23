import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";


import { DashboardService } from '../Services/dashboard.service';

import { MaterialCatComponent } from '../Masters/material-cat/material-cat.component';
import { MaterialMastComponent } from '../Masters/material-mast/material-mast.component';
import { ShapeMastComponent } from '../Masters/shape-mast/shape-mast.component';
import { SizeMastComponent } from '../Masters/size-mast/size-mast.component';
import { MMMastComponent } from '../Masters/mmmast/mmmast.component';
import { ColorMastComponent } from '../Masters/color-mast/color-mast.component';
import { ClarityMastComponent } from '../Masters/clarity-mast/clarity-mast.component';
import { FinishMastComponent } from '../Masters/finish-mast/finish-mast.component';
import { FluorescenceMastComponent } from '../Masters/fluorescence-mast/fluorescence-mast.component';
import { LabMastComponent } from '../Masters/lab-mast/lab-mast.component';
import { InclusionCatComponent } from '../Masters/inclusion-cat/inclusion-cat.component';
import { InclusionMasterComponent } from '../Masters/inclusion-master/inclusion-master.component';
import { OriginMastComponent } from '../Masters/origin-mast/origin-mast.component';
import { TreatmentMastComponent } from '../Masters/treatment-mast/treatment-mast.component';
import { KTMastComponent } from '../Masters/ktmast/ktmast.component';
import { PurmastComponent } from '../Masters/purmast/purmast.component';

import { DepartmentComponent } from '../HR/department/department.component';
import { EmployeeComponent } from '../HR/employee/employee.component';
import { DesignationMastComponent } from '../HR/designation-mast/designation-mast.component';
import { LocationMastComponent } from '../HR/location-mast/location-mast.component';

import { CategoryMastComponent } from '../DesignMast/category-mast/category-mast.component';
import { MetalColorMastComponent } from '../DesignMast/metal-color-mast/metal-color-mast.component';
import { StyleMastComponent } from '../DesignMast/style-mast/style-mast.component';
import { SubcategoryMastComponent } from '../DesignMast/subcategory-mast/subcategory-mast.component';

import { DesignOprationEditComponent } from '../DesignOperation/design-opration-edit/design-opration-edit.component';
import { DesignOprationNewComponent } from '../DesignOperation/design-opration-new/design-opration-new.component';
import { DesignOprationViewComponent } from '../DesignOperation/design-opration-view/design-opration-view.component';
import { DesignOperationColorComponent } from '../DesignOperation/design-operation-color/design-operation-color.component';
import { DesignOperationLinkComponent } from '../DesignOperation/design-operation-link/design-operation-link.component';

import { BrokerComponent } from '../Transaction/broker/broker.component';
import { ClientComponent } from '../Transaction/client/client.component';
import { MemoEditComponent } from '../Transaction/memo-edit/memo-edit.component';
import { MemoNewComponent } from '../Transaction/memo-new/memo-new.component';
import { MemoViewComponent } from '../Transaction/memo-view/memo-view.component';
import { MemoProcessComponent } from '../Transaction/memo-process/memo-process.component';
import { OrderEntryEditComponent } from '../Transaction/order-entry-edit/order-entry-edit.component';
import { OrderEntryNewComponent } from '../Transaction/order-entry-new/order-entry-new.component';
import { OrderEntryViewComponent } from '../Transaction/order-entry-view/order-entry-view.component';
import { SupplierComponent } from '../Transaction/supplier/supplier.component';
import { SaveUpdateClientComponent } from '../Transaction/save-update-client/save-update-client.component';
import { SaveUpdateBrokerComponent } from '../Transaction/save-update-broker/save-update-broker.component';
import { SaveUpdateSupplierComponent } from '../Transaction/save-update-supplier/save-update-supplier.component';
import { PermissionComponent } from '../Access/permission/permission.component';
import { PurchaseNewComponent } from '../Transaction/purchase-new/purchase-new.component';
import { PurchaseViewComponent } from '../Transaction/purchase-view/purchase-view.component';
import { PurchaseProcessComponent } from '../Transaction/purchase-process/purchase-process.component';
import { PurchaseEditComponent } from '../Transaction/purchase-edit/purchase-edit.component';

import { NgxSpinnerService } from "ngx-spinner";
import { OverToneComponent } from '../Masters/over-tone/over-tone.component';
import { IntensityComponent } from '../Masters/intensity/intensity.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ComponentName: any = {};
  selected = new FormControl(0);
  public dynamicTabs = [];


  constructor(
    private DashboardSer: DashboardService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {

    this.DashboardSer.sharedData$.subscribe(sharedData => {
      switch (sharedData) {

        case "Material Category":
          this.ComponentName = MaterialCatComponent;
          break;
        case "Material":
          this.ComponentName = MaterialMastComponent;
          break;
        case "Shape":
          this.ComponentName = ShapeMastComponent;
          break;
        case "Size":
          this.ComponentName = SizeMastComponent;
          break;
        case "MM":
          this.ComponentName = MMMastComponent;
          break;
        case "Color":
          this.ComponentName = ColorMastComponent;
          break;
        case "Clarity":
          this.ComponentName = ClarityMastComponent;
          break;
        case "Finish":
          this.ComponentName = FinishMastComponent;
          break;
        case "Fluorescence":
          this.ComponentName = FluorescenceMastComponent;
          break;
        case "Lab":
          this.ComponentName = LabMastComponent;
          break;
        case "Inc Category":
          this.ComponentName = InclusionCatComponent;
          break;
        case "Inclusion":
          this.ComponentName = InclusionMasterComponent;
          break;
        case "Origin":
          this.ComponentName = OriginMastComponent;
          break;
        case "Treatment":
          this.ComponentName = TreatmentMastComponent;
          break;
        case "KT":
          this.ComponentName = KTMastComponent;
          break;
        case "Purchase Master":
          this.ComponentName = PurmastComponent;
          break;
        case "OverTone Master":
          this.ComponentName = OverToneComponent;
          break;
        case "Intensity Master":
          this.ComponentName = IntensityComponent;
          break;
        case "Department":
          this.ComponentName = DepartmentComponent;
          break;
        case "Employee":
          this.ComponentName = EmployeeComponent;
          break;
        case "Designation":
          this.ComponentName = DesignationMastComponent;
          break;
        case "Location":
          this.ComponentName = LocationMastComponent;
          break;
        case "Category":
          this.ComponentName = CategoryMastComponent;
          break;
        case "Sub Category":
          this.ComponentName = SubcategoryMastComponent;
          break;
        case "Permission":
          this.ComponentName = PermissionComponent;
          break;
        case "Metal Color":
          this.ComponentName = MetalColorMastComponent;
          break;
        case "Style":
          this.ComponentName = StyleMastComponent;
          break;
        case "DesignNew":
          this.ComponentName = DesignOprationNewComponent;
          break;
        case "DeignView":
          this.ComponentName = DesignOprationViewComponent;
          break;
        case "DesignEdit":
          this.ComponentName = DesignOprationEditComponent;
          break;
        case "DesignColor":
          this.ComponentName = DesignOperationColorComponent;
          break;
        case "DesignLink":
          this.ComponentName = DesignOperationLinkComponent;
          break;
        case "Client":
          this.ComponentName = ClientComponent;
          break;
        case "Broker":
          this.ComponentName = BrokerComponent;
          break;
        case "Supplier":
          this.ComponentName = SupplierComponent;
          break;
        case "MemoNew":
          this.ComponentName = MemoNewComponent;
          break;
        case "MemoUpdate (" + localStorage.getItem('MemoTrnNo') + ")":
          this.ComponentName = MemoNewComponent;
          break;
        case "MemoEdit":
          this.ComponentName = MemoEditComponent;
          break;
        case "MemoView":
          this.ComponentName = MemoViewComponent;
          break;
        case "MemoProcess":
          this.ComponentName = MemoProcessComponent;
          break;
        case "OrderView":
          this.ComponentName = OrderEntryViewComponent;
          break;
        case "OrderEdit":
          this.ComponentName = OrderEntryEditComponent;
          break;
        case "OrderNew":
          this.ComponentName = OrderEntryNewComponent;
          break;
        case "PurchaseNew":
          this.ComponentName = PurchaseNewComponent;
          break;
        case "PurchaseUpdate (" + localStorage.getItem('PurchaseTrnNo') + ")":
          this.ComponentName = PurchaseNewComponent;
          break;
        case "PurchaseView":
          this.ComponentName = PurchaseViewComponent;
          break;
        case "PurchaseEdit":
          this.ComponentName = PurchaseEditComponent;
          break;
        case "PurchaseProcess":
          this.ComponentName = PurchaseProcessComponent;
          break;
        case "DesignEditById (" + localStorage.getItem('Id') + ")":
          this.ComponentName = DesignOprationNewComponent;
          break;
        case "Clientnew":
          this.ComponentName = SaveUpdateClientComponent;
          break;
        case "ClientUpdate (" + localStorage.getItem('ClientID') + ")":
          this.ComponentName = SaveUpdateClientComponent;
          break;
        case "Brokernew":
          this.ComponentName = SaveUpdateBrokerComponent;
          break;
        case "BrokerUpdate (" + localStorage.getItem('BrokerClientID') + ")":
          this.ComponentName = SaveUpdateBrokerComponent;
          break;
        case "Suppliernew":
          this.ComponentName = SaveUpdateSupplierComponent;
          break;
        case "SupplierUpdate (" + localStorage.getItem('SupplierClientID') + ")":
          this.ComponentName = SaveUpdateSupplierComponent;
          break;
        case "OrderEntryUpdate (" + localStorage.getItem('OrderNo') + ")":
          this.ComponentName = OrderEntryNewComponent;
          break;
        default:
          // this.ComponentName = PartyMastComponent
          break;
      }


      let OpenTab;
      OpenTab = this.dynamicTabs.find(x => x.label == sharedData);

      if (OpenTab == undefined) {
        let Obj1 = {
          label: sharedData,
          component: this.ComponentName
        };

        this.dynamicTabs.push(Obj1);

        if (true) {
          this.selected.setValue(this.dynamicTabs.length - 1);
        }
      } else {
        const position = this.dynamicTabs.findIndex(PageName => {
          return PageName.label == sharedData;
        });

        this.selected.setValue(position);
      }
    });

  }
  removeTab(index: number) {
    this.dynamicTabs.splice(index, 1);
  }

  tabChanged(e: any) {
    this.DashboardSer.SetPageTitle(e.index == -1 ? '' : e.tab.textLabel)
  }
  onClick(e, m) {
    if (e.which == 2) {
      this.dynamicTabs.splice(m, 1);
    }

  }

}
