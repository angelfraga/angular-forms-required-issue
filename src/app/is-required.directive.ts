import { AfterViewInit, Directive, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, NgControl, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, Subject } from 'rxjs';

@Directive({
  selector: '[isRequired]',
})
export class IsRequiredDirective implements AfterViewInit {
  @Input() set isRequired(isRequired: boolean) {
    this.isRequired$.next(isRequired);
  }

  isRequired$ = new Subject<boolean>();
  control$ = new Subject<AbstractControl>();

  constructor(private control: NgControl) {
    combineLatest([this.isRequired$, this.control$]).subscribe(
      ([isRequired, control]) => {
        if (isRequired) {
          control.addValidators([Validators.required]);
        } else {
          control.removeValidators([Validators.required]);
        }
        control.updateValueAndValidity();
      }
    );
  }

  ngAfterViewInit() {
    this.control$.next(this.control.control);
  }
}
