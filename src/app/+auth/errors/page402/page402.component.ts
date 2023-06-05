import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page402',
  templateUrl: './page402.component.html',
  styleUrls: ['./page402.component.css']
})

/**
 * 404 Basic Component
 */
export class Page402Component implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();

  constructor() {
  }

  ngOnInit(): void {
  }

}
