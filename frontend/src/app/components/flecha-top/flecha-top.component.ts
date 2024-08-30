import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-flecha-top',
  templateUrl: './flecha-top.component.html',
  styleUrls: ['./flecha-top.component.css']
})
export class FlechaTopComponent implements OnInit{

  windowScrolled: boolean;
  constructor(@Inject(DOCUMENT) private document: Document) {}
  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop > 100) {
          this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.scrollY || document.documentElement.scrollTop || document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
  }
  scrollToTop() {
      (function smoothscroll() {
          var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, currentScroll - (currentScroll / 1));
          }
      })();
  }
  ngOnInit() {}
  
}
