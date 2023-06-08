import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { ResourcesService } from '../services/resources.service';


enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {

  constructor(
    private router: Router,
    private resourcesService: ResourcesService,
    private firebaseService: FirebaseService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    
    return this.resourcesService.getLocalStorage("isCurrentUserLoggedIn").then(
      (res: any) => {
        if (res) {
          return true;
        } else {
          this.resourcesService.presentToast("Access denied! your login session expired, please login again.", toastState.Error);
          // this.router.navigateByUrl('/auth/login', {replaceUrl: true});
          this.firebaseService.logoutFirebaseUser();
          return false;
        }
      }).catch((error: any) => {
        this.resourcesService.presentToast("Access denied! your login session expired, please login again.", toastState.Error);
        // this.router.navigateByUrl('/auth/login', {replaceUrl: true});
        this.firebaseService.logoutFirebaseUser();
        return false;
    });
    
  }
}
