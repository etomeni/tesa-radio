import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourcesService } from '../services/resources.service';



@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {

  constructor(
    private router: Router,
    private resourcesService: ResourcesService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;

    return this.resourcesService.getLocalStorage("intro").then( res => {
      if (res) {
        this.router.navigateByUrl('/home', {replaceUrl: true});
        return true;
      } else {
        this.router.navigateByUrl('/intro', {replaceUrl: true});
        return false;
      };
    }).catch ( error => {
      this.router.navigateByUrl('/intro', {replaceUrl: true});
      return false;
    })
  }
  
}
