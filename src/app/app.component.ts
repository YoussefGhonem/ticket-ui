import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "app/+auth/service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ticket management';

  constructor(private _authService: AuthService) {
  }

  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
    this.setTheme();
  }

  ngOnInit(): void {
    // Load ngx permissions
    this._authService.loadPermissions();

    let refreshIntervalId = setInterval(() => {
      this.setTheme();
    }, 0);

    // setTimeout(() => {
    //   clearInterval(refreshIntervalId)
    // }, 1000)


  }

  setTheme() {
    let primNgStyleLocalStorage = localStorage.getItem('theme');

    if (primNgStyleLocalStorage == 'light') {
      document.body.setAttribute('data-layout-mode', "light");
      document.body.setAttribute('data-sidebar', "light");
      var div = document.querySelectorAll('.ng-select .ng-select-container');
      [].forEach.call(div, function (div) {
        div.style.backgroundColor = '';
        div.style.color = '';
      });


      if (document.querySelector('.custom-search-icon') == null) return
      // @ts-ignore
      document.querySelector('.custom-search-icon').style.backgroundColor = '';
      
      var div2 = document.querySelectorAll('.nav-tabs-custom .nav-item .nav-link');
      []?.forEach?.call(div2, function(div2) {
        div2.style.color = '';
      });

      // var div3 = document.querySelector('.nav-tabs-custom .nav-item .nav-link.active');
      // []?.forEach?.call(div3, function(div3) {
      //   div3.style.color = '#0ab39c'
      // });

    }
    else {
      document.body.setAttribute('data-layout-mode', "dark");
      document.body.setAttribute('data-sidebar', "dark");

      var div = document.querySelectorAll('.ng-select .ng-select-container');
      []?.forEach?.call(div, function (div) {
        div.style.backgroundColor = '#2a2f34';
        div.style.color = 'rgb(188 194 199)';
      });

      var div2 = document.querySelectorAll('.nav-tabs-custom .nav-item .nav-link');
      []?.forEach?.call(div2, function(div2) {
        div2.style.color = 'rgb(188 194 199)';
      });

      // var div3 = document.querySelector('.nav-tabs-custom .nav-item .nav-link.active');
      // []?.forEach?.call(div3, function(div3) {
      //   div3.style.color = 'white'
      // });


      if (document.querySelector('.custom-search-icon') == null) return
      // @ts-ignore
      document.querySelector('.custom-search-icon').style.backgroundColor = '#2a2f34';
    }
  }
}
