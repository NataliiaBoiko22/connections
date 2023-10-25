import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./header/header.component";
import { LogoComponent } from "./header/logo/logo.component";
import { SearchBlockComponent } from "./header/search-block/search-block.component";
import { SettingsComponent } from "./header/settings/settings.component";
import { UserComponent } from "./header/user/user.component";
import { CommentsComponent } from "./search-result/search-item/comments/comments.component";
import { DislikesComponent } from "./search-result/search-item/dislikes/dislikes.component";
import { LikesComponent } from "./search-result/search-item/likes/likes.component";
import { MoreButtonComponent } from "./search-result/search-item/more-button/more-button.component";
import { SearchItemComponent } from "./search-result/search-item/search-item.component";
import { ThumbnailComponent } from "./search-result/search-item/thumbnail/thumbnail.component";
import { TitleComponent } from "./search-result/search-item/title/title.component";
import { ViewsComponent } from "./search-result/search-item/views/views.component";
import { SearchResultComponent } from "./search-result/search-result.component";
import { InputFieldComponent } from "./sorting/input-field/input-field.component";
import { SortByDateComponent } from "./sorting/sort-by-date/sort-by-date.component";
import { SortByViewsComponent } from "./sorting/sort-by-views/sort-by-views.component";
import { SortByWordComponent } from "./sorting/sort-by-word/sort-by-word.component";
import { SortingComponent } from "./sorting/sorting.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SortingComponent,
        SortByDateComponent,
        SortByViewsComponent,
        SortByWordComponent,
        InputFieldComponent,
        UserComponent,
        SettingsComponent,
        LogoComponent,
        SearchResultComponent,
        SearchItemComponent,
        CommentsComponent,
        DislikesComponent,
        LikesComponent,
        ViewsComponent,
        MoreButtonComponent,
        ThumbnailComponent,
        TitleComponent,
        SearchBlockComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
