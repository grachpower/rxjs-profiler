import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ExtensionConnectService} from "../../services/extension-connect/extension-connect.service";
import {map, take, takeUntil} from "rxjs/operators";
import {AppStatusTypes} from "../../models/app-status-types";
import {Subject} from "rxjs";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
  public isRecording$ = this.extensionConnect.status$
    .pipe(
      map((status: AppStatusTypes) => status === AppStatusTypes.RECEIVING),
    );

  private destroyed$ = new Subject<void>();

  constructor(
    public extensionConnect: ExtensionConnectService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
  }

  public onRecordToggle() {
    this.isRecording$
      .pipe(
        take(1),
        takeUntil(this.destroyed$),
      ).subscribe((isRecording: boolean) => {
        if (!isRecording) {
          this.extensionConnect.resetData();
          this.extensionConnect.startReceiving();
        } else {
          this.extensionConnect.stopReceiving();
        }
      });
  }

  public onClear(): void {
    this.extensionConnect.resetData();
  }
}
