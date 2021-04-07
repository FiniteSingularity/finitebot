import { Routes } from "@angular/router";
import { ChalkBoomOverlayComponent } from "./chalk-boom-overlay.component";

export const ChalkBoomOverlayRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ChalkBoomOverlayComponent
    }
];
