import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { RolesEnum } from 'app/+auth/models';
import { EventMembersController } from 'app/+events/controllers';
import { SettingsController } from 'app/+settings/controllers';
import { CountryDropdownModel } from 'app/+users/models';
import { UsersValidator } from 'app/+users/validators';
import { MembersController } from 'app/+vendors/controllers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent extends BaseComponent implements OnInit {
  @Input('eventId') eventId?: string;
  form: FormGroup;
  userRolesEnum = RolesEnum;
  countries: CountryDropdownModel[];

  constructor(public override injector: Injector, public modalService: NgbActiveModal,
    private formBuilder: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.getCountries();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl(null, UsersValidator.firstName),
      lastName: new FormControl(null, UsersValidator.lastName),
      callingCode: new FormControl(null, UsersValidator.callingCode),
      phoneNumber: new FormControl(null, UsersValidator.phoneNumber),
      email: new FormControl(null, UsersValidator.email),
    });
  }

  getCountries() {
    this.httpService.GET(SettingsController.CountriesDropdown)
      .subscribe((countries) => {
        console.log(countries);
        this.countries = countries;
      });
  }

  submit() {
    let body = this.form.getRawValue();
    body.phoneNumber = body.callingCode + '-' + body.phoneNumber;

    this.httpService.POST(MembersController.CreateCommitteeMemberAndAssignToEvent(this.eventId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Member created and assigned successfully', '');
      });

  }
}
