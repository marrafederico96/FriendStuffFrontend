import { Routes } from '@angular/router';
import { AuthComponent } from './components/account/auth-form/auth.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard, guestGuard } from './services/auth.guard';
import { EventComponent } from './components/event/event.component';

export const routes: Routes = [
    { path: "", component: HomeComponent, canActivate: [authGuard] },
    { path: "account/login", component: AuthComponent, canActivate: [guestGuard] },
    { path: "account/register", component: AuthComponent, canActivate: [guestGuard] },
    { path: "event/:eventName", component: EventComponent, canActivate: [authGuard] }
];
