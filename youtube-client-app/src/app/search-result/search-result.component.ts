import { Component } from "@angular/core";

import { VideoListResponse } from "../data-models/models";

@Component({
    selector: "app-search-result",
    templateUrl: "./search-result.component.html",
    styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent {
    public searchResults: VideoListResponse = {} as VideoListResponse;;
}
