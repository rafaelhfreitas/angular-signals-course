import { ActivatedRouteSnapshot, CanActivateFn, Route, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const isUserAuthenticate: CanActivateFn = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        return router.parseUrl("/login");
    }
}