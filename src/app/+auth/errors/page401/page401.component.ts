import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page401',
  templateUrl: './page401.component.html',
  styleUrls: ['./page401.component.css']
})

/**
 * 404 Basic Component
 */
export class Page401Component implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();

  constructor() {
  }

  ngOnInit(): void {
  }

}
