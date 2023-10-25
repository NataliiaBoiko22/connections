import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DislikesComponent } from "./dislikes.component";

describe("DislikesComponent", () => {
    let component: DislikesComponent;
    let fixture: ComponentFixture<DislikesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DislikesComponent]
        });
        fixture = TestBed.createComponent(DislikesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
