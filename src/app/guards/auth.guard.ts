import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourcesService } from '../services/resources.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private resourcesService: ResourcesService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;


    return this.resourcesService.getLocalStorage("isCurrentUserLoggedIn").then(
      (res: any) => {
        if (res) {
          this.router.navigateByUrl('/account', {replaceUrl: true});
          return false;
        } else {
          return true;
        }
      },
      (err: any) => {
        return true;
      }
    );
    
  }
  
}
