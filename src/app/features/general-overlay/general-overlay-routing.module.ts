import { Routes } from "@angular/router";
import { GeneralOverlayComponent } from "./general-overlay.component";

export const GeneralOverlayRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: GeneralOverlayComponent
    }
];
