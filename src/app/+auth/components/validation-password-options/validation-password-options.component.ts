import { Component, Input, OnInit } from '@angular/core';
import { ValidationPasswordOptions } from '@shared/default-values/validation-password-options';

@Component({
  selector: 'validation-password-options',
  templateUrl: './validation-password-options.component.html',
  styleUrls: ['./validation-password-options.component.scss']
})
export class ValidationPasswordOptionsComponent implements OnInit {
  constructor() {

  }

  passwordOptions = ValidationPasswordOptions;

  ngOnInit(): void {
    this.validationMessage()
    this.showOptions()
  }

  validationMessage() {
    // Password Validation set
    console.log("validationMessage");
    let myInput = document.getElementById("password-input") as HTMLInputElement;
    let letter = document.getElementById("pass-lower");
    let capital = document.getElementById("pass-upper");
    let number = document.getElementById("pass-number");
    let length = document.getElementById("pass-length");
    let special = document.getElementById("pass-spceial");
    let equal = document.getElementById("pass-equal");
    let oldPassword = document.getElementById("oldpasswordInput") as HTMLInputElement;

    if (myInput != null) {
      myInput.onkeyup = () => {
        // Validate lowercase letters
        let lowerCaseLetters = /[a-z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
          letter?.classList.remove("invalid");
          letter?.classList.add("valid");
        } else {
          letter?.classList.remove("valid");
          letter?.classList.add("invalid");
        }

        // Validate capital letters
        let upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
          capital?.classList.remove("invalid");
          capital?.classList.add("valid");
        } else {
          capital?.classList.remove("valid");
          capital?.classList.add("invalid");
        }

        // Validate capital spcial
        let specialLetters = /[^a-zA-Z0-9]/
        if (myInput.value.match(specialLetters)) {
          special?.classList.remove("invalid");
          special?.classList.add("valid");
        } else {
          special?.classList.remove("valid");
          special?.classList.add("invalid");
        }

        // Validate numbers
        let numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
          number?.classList.remove("invalid");
          number?.classList.add("valid");
        } else {
          number?.classList.remove("valid");
          number?.classList.add("invalid");
        }

        // Validate length
        if (myInput.value.length >= ValidationPasswordOptions.MinimumCharacters) {
          length?.classList.remove("invalid");
          length?.classList.add("valid");
        } else {
          length?.classList.remove("valid");
          length?.classList.add("invalid");
        }

        if(oldPassword != null){
          if(myInput.value === oldPassword.value){
            equal?.classList.remove("valid");
            equal?.classList.add("invalid");
          }
          else {
            equal?.classList.remove("invalid");
            equal?.classList.add("valid");
          }
        }
      };

    }

    if(oldPassword != null){
      oldPassword.onkeyup = () => {
        if(myInput.value === oldPassword.value){
          equal?.classList.remove("valid");
          equal?.classList.add("invalid");
        }
        else {
          equal?.classList.remove("invalid");
          equal?.classList.add("valid");
        }
      }
    }
    // When the user starts to type something inside the password field
  }

  showOptions() {
    let lower = document.getElementById("pass-lower");
    let equal = document.getElementById("pass-equal");
    let capital = document.getElementById("pass-upper");
    let number = document.getElementById("pass-number");
    let special = document.getElementById("pass-spceial");
    let oldPassword = document.getElementById("oldpasswordInput") as HTMLInputElement;

    if (!ValidationPasswordOptions.RequireDigit) {
      let input = number as HTMLElement;
      input.style.display = "none"
    }
    if (!ValidationPasswordOptions.RequireLowercase) {
      let input = lower as HTMLElement;
      input.style.display = "none"
    }
    if (!ValidationPasswordOptions.RequireNonAlphanumeric) {
      let input = special as HTMLElement;
      input.style.display = "none"
    }
    if (!ValidationPasswordOptions.RequireUppercase) {
      let input = capital as HTMLElement;
      input.style.display = "none"
    }

    if(oldPassword == null){
      let input = equal as HTMLElement;
      input.style.display = "none"
    }
  }
}
