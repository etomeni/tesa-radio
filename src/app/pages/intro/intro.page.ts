import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';

import Swiper from 'swiper';
import { ResourcesService } from 'src/app/services/resources.service';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild('introSwiper') introSwiperRef: ElementRef| undefined;
  swiperVar?: Swiper;

  swiperModules = [IonicSlides];
  
  isSlideBeginning: boolean = true;
  isSlideEnd: boolean = false;

  slideSettings: any = {
    isBeginning: true,
    isEnd: false,
  }

  introSliders = [
    {
      title: this.sanitizer.bypassSecurityTrustHtml("Welcome"),
      image: "assets/images/welcome.png",
      description: this.sanitizer.bypassSecurityTrustHtml('To new world of possibilities where radio and entrepreneurship has gone digital and easier with us.'),
    },
    {
      title: this.sanitizer.bypassSecurityTrustHtml("Join <span style='color: #de2341;'>Us</span>"),
      image: "assets/images/joinUs.png",
      description: this.sanitizer.bypassSecurityTrustHtml(`Everyday at <span style="color: #de2341; font-weight: bolder;">Tesa</span> <span style="font-weight: bolder;"> Radio</span>
      To get latest vibes and inspiration for a smooth entrepreneurial day.`),
    },
    {
      title: this.sanitizer.bypassSecurityTrustHtml("Become A <span style='color: #de2341;'>Creator</span>"),
      image: "assets/images/launch.png",
      description: this.sanitizer.bypassSecurityTrustHtml(`Create and upload your audio shows & podcast on <span style="color: #de2341; font-weight: bolder;">Tesa</span> Radio and get listed on all top directories aswell as with our large audience of listeners.`),
    },
    {
      title: this.sanitizer.bypassSecurityTrustHtml("Who We Are"),
      image: "assets/images/team.png",
      description: this.sanitizer.bypassSecurityTrustHtml(` We're a team of young <span style="font-weight: bolder;">entrepreneurs</span>, devoted to <span style="font-weight: bolder;">inspire</span> and <span style="font-weight: bolder; font">motivate</span> other entrepreneurs
      towards <span style="color: #de2341; font-weight: bolder;">achieving goals</span>.
      <br>
      With a large community of <span style="font-weight: bolder;"> over 1 million active followers and listerners</span>.
      <br>
      <br>
      We <span style="color: #de2341; font-weight: bolder;">Inspire </span> 
      <span style="font-weight: bolder;"> Ideas, Positivity, Greatness, Possibilities, Motivations, Productivity,</span> and many more.`),
    }

  ] 

  constructor(
    private router: Router,
    public sanitizer: DomSanitizer,
    private resourcesService: ResourcesService,
  ) { }

  ngOnInit() {
  }

  swiperInitReady() {
    this.swiperVar = this.introSwiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(event: any) {
    // console.log(event);

    // this.swiperVar?.activeIndex
    // this.introSwiperRef?.nativeElement.swiper.activeIndex;
    

    if (this.introSwiperRef?.nativeElement.swiper.activeIndex == 0) {
      this.slideSettings.isBeginning = true;
    } else {
      this.slideSettings.isBeginning = false;
    }

    if (this.introSwiperRef?.nativeElement.swiper.activeIndex == this.introSliders.length - 1) {
      this.slideSettings.isEnd = true;
    } else {
      this.slideSettings.isEnd = false;
    }
    
  }


  swiperGoPrev() {
    this.swiperVar?.slidePrev();
  }
  swiperGoNext() {
    this.swiperVar?.slideNext();
  }
  swiperGoEnd() {
    this.swiperVar?.slideTo(this.introSliders.length);
  }

  swiperGetStarted() {
    // console.log('get starteed');

    this.resourcesService.setLocalStorage("intro", true).finally(() => {
      this.router.navigateByUrl('/home', {replaceUrl: true});
    })
  }

}
