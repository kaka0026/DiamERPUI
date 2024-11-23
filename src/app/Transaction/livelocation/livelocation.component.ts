import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MouseEvent } from "@agm/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: "app-livelocation",
  templateUrl: "./livelocation.component.html",
  styleUrls: ["./livelocation.component.css"]
})
export class LivelocationComponent implements OnInit {

  zoom: number = 4;
  lat: any = 21.2303872;
  lng: any = 72.8170496;
  MapLink: any = "";

  constructor(
    private _mdr: MatDialogRef<LivelocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.langitude) {
      this.lng = parseFloat(data.latitude);
      this.lat = parseFloat(data.langitude);
    }
  }

  ngOnInit(): void { }

  CloseDialog() {
    this._mdr.close();
  }

  SaveDialog() {
    this._mdr.close(this.MapLink);
  }

  clickedMarker(label: string, index: number, event: any) {
  }

  mapClicked($event: MouseEvent): void {
    this.markers = [];
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: false
    });
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.MapLink = "https://www.google.com/maps/search/?api=1&query=" + this.lat + "," + this.lng;
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
  }
  markers: marker[] = [];
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
