import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {

  constructor(
   private router: Router,
  ) { }

  ngOnInit() {
  }

  goHomeBTN() {
    this.router.navigateByUrl('/home', {replaceUrl: true});
  }

}
