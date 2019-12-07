import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { SlotItemType } from "../../models/slot-item-model";
import { TimelineService } from "../../services/timeline/timeline.service";

declare var google: any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: true}) public container: ElementRef;

  private chart: any;
  private dataTable: any;

  private options = {
    timeline: {
      groupByRowLabel: true,
      colorByRowLabel: false,
      showBarLabels: true,
      showRowLabels: false,
    },
    height: '300',
    // backgroundColor: '#ffd',
    avoidOverlappingGridLines: true,
  };

  private destroyed$ = new Subject<void>();

  constructor(
    private timelineService: TimelineService,
  ) { }

  public ngOnInit(): void {
    google.charts.load("current", {packages:["timeline"]});
    google.charts.setOnLoadCallback(this.initChart.bind(this));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public initChart(): void {
    const chart = new google.visualization.Timeline(this.container.nativeElement);
    this.chart = chart;

    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Group' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'string', role: 'tooltip' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    dataTable.addRows([]);

    this.dataTable = dataTable;

    this.draw();

    this.timelineService.timelineData$
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe((data: SlotItemType[]) => {
        this.setData(data);
        this.draw();
    });
  }

  public setData(data: SlotItemType[]): void {
    this.dataTable.addRows([
      ...data,
    ]);
  }

  private draw(): void {
    requestAnimationFrame(() => {
      this.chart.draw(this.dataTable, this.options);
    });
  }

}
