import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";

import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AuthInterceptor } from './Services/auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialCatComponent } from './Masters/material-cat/material-cat.component';
import { MaterialModule } from '../app/MaterialModule/material-module';

import { ShapeMastComponent } from './Masters/shape-mast/shape-mast.component';
import { MaterialMastComponent } from './Masters/material-mast/material-mast.component';
import { SizeMastComponent } from './Masters/size-mast/size-mast.component';

import { Ng6MultiselectModule } from 'ng6-multiselect';
import { MMMastComponent } from './Masters/mmmast/mmmast.component';
import { FinishMastComponent } from './Masters/finish-mast/finish-mast.component';
import { InclusionCatComponent } from './Masters/inclusion-cat/inclusion-cat.component';
import { OriginMastComponent } from './Masters/origin-mast/origin-mast.component';
import { KTMastComponent } from './Masters/ktmast/ktmast.component'
import { ColorMastComponent } from './Masters/color-mast/color-mast.component';
import { ClarityMastComponent } from './Masters/clarity-mast/clarity-mast.component';
import { FluorescenceMastComponent } from './Masters/fluorescence-mast/fluorescence-mast.component';
import { LabMastComponent } from './Masters/lab-mast/lab-mast.component';
import { InclusionMasterComponent } from './Masters/inclusion-master/inclusion-master.component';
import { TreatmentMastComponent } from './Masters/treatment-mast/treatment-mast.component';
import { TrackMastComponent } from './Masters/track-mast/track-mast.component';

import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DepartmentComponent } from './HR/department/department.component';
import { EmployeeComponent } from './HR/employee/employee.component';
import { DesignationMastComponent } from './HR/designation-mast/designation-mast.component';
import { LocationMastComponent } from './HR/location-mast/location-mast.component';

import { CategoryMastComponent } from './DesignMast/category-mast/category-mast.component';
import { MetalColorMastComponent } from './DesignMast/metal-color-mast/metal-color-mast.component';
import { StyleMastComponent } from './DesignMast/style-mast/style-mast.component';
import { SubcategoryMastComponent } from './DesignMast/subcategory-mast/subcategory-mast.component';

import { PermissionComponent } from './Access/permission/permission.component';
import { DesignOprationNewComponent } from './DesignOperation/design-opration-new/design-opration-new.component';
import { DesignOprationEditComponent } from './DesignOperation/design-opration-edit/design-opration-edit.component';
import { DesignOprationViewComponent } from './DesignOperation/design-opration-view/design-opration-view.component';
import { DesignOperationColorComponent } from './DesignOperation/design-operation-color/design-operation-color.component';
import { DesignOperationLinkComponent } from './DesignOperation/design-operation-link/design-operation-link.component';
import { ClientComponent } from './Transaction/client/client.component';
import { BrokerComponent } from './Transaction/broker/broker.component';
import { SupplierComponent } from './Transaction/supplier/supplier.component';
import { MemoNewComponent } from './Transaction/memo-new/memo-new.component';
import { MemoEditComponent } from './Transaction/memo-edit/memo-edit.component';
import { MemoViewComponent } from './Transaction/memo-view/memo-view.component';
import { OrderEntryNewComponent } from './Transaction/order-entry-new/order-entry-new.component';
import { OrderEntryEditComponent } from './Transaction/order-entry-edit/order-entry-edit.component';
import { OrderEntryViewComponent } from './Transaction/order-entry-view/order-entry-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientViewFormComponent } from './Transaction/client-view-form/client-view-form.component';
import { SaveUpdateClientComponent } from './Transaction/save-update-client/save-update-client.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { LivelocationComponent } from './Transaction/livelocation/livelocation.component';
import { OwlModule } from 'ngx-owl-carousel';
import { AgmCoreModule } from '@agm/core';
import { BrokerViewFormComponent } from './Transaction/broker-view-form/broker-view-form.component';
import { SaveUpdateBrokerComponent } from './Transaction/save-update-broker/save-update-broker.component';
import { ColorDesignComponent } from './DesignOperation/color-design/color-design.component';
import { SaveUpdateSupplierComponent } from './Transaction/save-update-supplier/save-update-supplier.component';
import { DesignLinkViewComponent } from './DesignOperation/design-link-view/design-link-view.component';
import { MemoProcessComponent } from './Transaction/memo-process/memo-process.component';
import { CSIMMComponent } from './Transaction/Memo/csimm/csimm.component';
import { CSPREComponent } from './Transaction/Memo/cspre/cspre.component';
import { CSEMIComponent } from './Transaction/Memo/csemi/csemi.component';
import { CERTComponent } from './Transaction/Memo/cert/cert.component';
import { CVDComponent } from './Transaction/Memo/cvd/cvd.component';
import { DOSComponent } from './Transaction/Memo/dos/dos.component';
import { SRDComponent } from './Transaction/Memo/srd/srd.component';
import { SCDComponent } from './Transaction/Memo/scd/scd.component';
import { METALComponent } from './Transaction/Memo/metal/metal.component';
import { PEComponent } from './Transaction/Memo/pe/pe.component';
import { MemoProcessFormComponent } from './Transaction/memo-process-form/memo-process-form.component';
import { SupplierViewFormComponent } from './Transaction/supplier-view-form/supplier-view-form.component';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ClientAddressComponent } from './Transaction/client-address/client-address.component';
import { ClienContactComponent } from './Transaction/clien-contact/clien-contact.component';
import { ColourdStoneComponent } from './Transaction/Memo/colourd-stone/colourd-stone.component';
import { PearlsComponent } from './Transaction/Memo/pearls/pearls.component';
import { ImmitationComponent } from './Transaction/Memo/immitation/immitation.component';
import { CertiDiamondsComponent } from './Transaction/Memo/certi-diamonds/certi-diamonds.component';
import { OtherDiamondsComponent } from './Transaction/Memo/other-diamonds/other-diamonds.component';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgOtpInputModule } from 'ng-otp-input';
import { IntlInputPhoneModule } from 'intl-input-phone';
import { OtpCheckComponent } from './Transaction/otp-check/otp-check.component';
import { OtpCheckMobileComponent } from './Transaction/otp-check-mobile/otp-check-mobile.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ShowImageComponent } from './Transaction/show-image/show-image.component';
import { ShowFrameComponent } from './Transaction/show-frame/show-frame.component';

import { TwoDigitDecimaNumberDirective } from './two-digit-decima-number.directive';
import { ThreeDigitDecimaNumberDirective } from './three-digit-decima-number.directive';
import { PurchaseNewComponent } from './Transaction/purchase-new/purchase-new.component';
import { PurchaseEditComponent } from './Transaction/purchase-edit/purchase-edit.component';
import { PurchaseViewComponent } from './Transaction/purchase-view/purchase-view.component';
import { PurchaseProcessComponent } from './Transaction/purchase-process/purchase-process.component';
import { PurmastComponent } from './Masters/purmast/purmast.component';
import { PreciousColorstoneComponent } from './Transaction/Purchase/precious-colorstone/precious-colorstone.component';
import { PearlComponent } from './Transaction/Purchase/pearl/pearl.component';
import { DiamondCertComponent } from './Transaction/Purchase/diamond-cert/diamond-cert.component';
import { PurImmitationComponent } from './Transaction/Purchase/immitation/immitation.component';
import { DiamondDossComponent } from './Transaction/Purchase/diamond-doss/diamond-doss.component';
import { DiamondSmalComponent } from './Transaction/Purchase/diamond-smal/diamond-smal.component';
import { DiamondSpecialComponent } from './Transaction/Purchase/diamond-special/diamond-special.component';
import { OverToneComponent } from './Masters/over-tone/over-tone.component';
import { IntensityComponent } from './Masters/intensity/intensity.component';
// const config = {
//   apiKey: "c77070ba643cf1b79b0565e7208878b016896afa",
//   authDomain: "fir-auth-d1e96.firebaseapp.com",
//   projectId: "fir-auth-d1e96",
//   storageBucket: "fir-auth-d1e96.appspot.com",
//   messagingSenderId: "1089984436552",
//   appId: "1:1089984436552:web:bf889b86e849f289277b7d",
//   measurementId: "G-QE1PEYS3BP"
// };

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MemoProcessComponent,
    MaterialCatComponent,
    ShapeMastComponent,
    MaterialMastComponent,
    SizeMastComponent,
    MMMastComponent,
    FinishMastComponent,
    InclusionCatComponent,
    SubcategoryMastComponent,
    OriginMastComponent,
    LivelocationComponent,
    KTMastComponent,
    StyleMastComponent,
    ColorMastComponent,
    DesignLinkViewComponent,
    MetalColorMastComponent,
    ClarityMastComponent,
    FluorescenceMastComponent,
    PermissionComponent,
    LabMastComponent,
    DesignationMastComponent,
    InclusionMasterComponent,
    TreatmentMastComponent,
    TrackMastComponent,
    DepartmentComponent,
    CategoryMastComponent,
    EmployeeComponent,
    LocationMastComponent,
    HeaderComponent,
    DashboardComponent,
    DesignOprationNewComponent,
    DesignOprationEditComponent,
    DesignOprationViewComponent,
    DesignOperationColorComponent,
    DesignOperationLinkComponent,
    ClientComponent,
    BrokerComponent,
    SupplierComponent,
    MemoNewComponent,
    MemoEditComponent,
    MemoViewComponent,
    OrderEntryNewComponent,
    OrderEntryEditComponent,
    OrderEntryViewComponent,
    ClientViewFormComponent,
    SaveUpdateClientComponent,
    BrokerViewFormComponent,
    SaveUpdateBrokerComponent,
    ColorDesignComponent,
    SaveUpdateSupplierComponent,
    CSIMMComponent,
    CSPREComponent,
    CSEMIComponent,
    CERTComponent,
    CVDComponent,
    DOSComponent,
    SRDComponent,
    SCDComponent,
    METALComponent,
    PEComponent,
    SupplierViewFormComponent,
    ClientAddressComponent,
    ClienContactComponent,
    ColourdStoneComponent,
    PearlsComponent,
    ImmitationComponent,
    CertiDiamondsComponent,
    OtherDiamondsComponent,
    OtpCheckComponent,
    OtpCheckMobileComponent,
    ShowImageComponent,
    ShowFrameComponent,
    TwoDigitDecimaNumberDirective,
    ThreeDigitDecimaNumberDirective,
    MemoProcessFormComponent,
    PurchaseNewComponent,
    PurchaseEditComponent,
    PurchaseViewComponent,
    PurchaseProcessComponent,
    PurmastComponent,
    PreciousColorstoneComponent,
    PearlComponent,
    DiamondCertComponent,
    PurImmitationComponent,
    DiamondDossComponent,
    DiamondSmalComponent,
    DiamondSpecialComponent,
    OverToneComponent,
    IntensityComponent
  ],
  imports: [
    IntlInputPhoneModule,
    NgxSpinnerModule,
    NgOtpInputModule,
    CarouselModule,
    OwlModule,
    AngularFireModule,
    AngularFireAuthModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfig),
    BrowserAnimationsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    Ng6MultiselectModule,
    AgGridModule.withComponents([]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfJTVKnpLl0ULuuwDuix-9ANpyQhP6mfc'
    }),
    NgbModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
    DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
