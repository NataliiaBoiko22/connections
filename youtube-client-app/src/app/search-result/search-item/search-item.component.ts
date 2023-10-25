import { Component } from "@angular/core";
import { VideoItem } from "src/app/data-models/models";

@Component({
    selector: "app-search-item",
    templateUrl: "./search-item.component.html",
    styleUrls: ["./search-item.component.scss"]
})
export class SearchItemComponent {
    public videoItem: VideoItem = {} as VideoItem;
}
