import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ExtensionConnectService} from "../../services/extension-connect/extension-connect.service";
import {debounceTime, distinctUntilChanged, map, take, takeUntil} from "rxjs/operators";
import {AppStatusTypes} from "../../models/app-status-types";
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";
import {TimelineService} from "../../services/timeline/timeline.service";
import {FilterTypes, filterTypes} from "../../models/filter-types";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit, OnDestroy {
  public isRecording$ = this.extensionConnect.status$
    .pipe(
      map((status: AppStatusTypes) => status === AppStatusTypes.RECEIVING),
    );

  public searchControl = new FormControl('');
  public filters = filterTypes;

  private destroyed$ = new Subject<void>();

  constructor(
    private extensionConnect: ExtensionConnectService,
    private timelineService: TimelineService,
  ) {}

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
      )
      .subscribe((searchValue: string) => {
        this.timelineService.setSearchValue(searchValue);
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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

  public filterValueChange(value: FilterTypes): void {
    this.timelineService.setFilterType(value);
  }

  public onClear(): void {
    this.extensionConnect.resetData();
  }
}
