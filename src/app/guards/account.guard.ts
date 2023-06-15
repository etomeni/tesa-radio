import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { toastState } from 'src/modelInterface';
import { FirebaseService } from '../services/firebase.service';
import { ResourcesService } from '../services/resources.service';


@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {

  constructor(
    private resourcesService: ResourcesService,
    private firebaseService: FirebaseService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
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
