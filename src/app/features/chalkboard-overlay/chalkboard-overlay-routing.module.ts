import { Routes } from "@angular/router";
import { ChalkboardOverlayComponent } from "./chalkboard-overlay.component";

export const ChalkboardOverlayRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ChalkboardOverlayComponent
    }
];
