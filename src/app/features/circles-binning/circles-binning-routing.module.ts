import { Routes } from "@angular/router";
import { CirclesBinningComponent } from "./circles-binning.component";

export const CirclesBinningRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CirclesBinningComponent
    }
];
