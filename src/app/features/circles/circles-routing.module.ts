import { Routes } from "@angular/router";
import { CirclesComponent } from "./circles.component";

export const CirclesRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CirclesComponent
    }
];
