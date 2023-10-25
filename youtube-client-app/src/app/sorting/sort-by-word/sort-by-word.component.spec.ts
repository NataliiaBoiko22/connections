import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SortByWordComponent } from "./sort-by-word.component";

describe("SortByWordComponent", () => {
    let component: SortByWordComponent;
    let fixture: ComponentFixture<SortByWordComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SortByWordComponent]
        });
        fixture = TestBed.createComponent(SortByWordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
