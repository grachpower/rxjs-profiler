import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { SlotItemType } from "../../models/slot-item-model";
import { TimelineService } from "../../services/timeline/timeline.service";

declare var google: any;

type Table = any;
type Chart = any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: true}) public container: ElementRef;

  public noData$ = new Subject<boolean>();

  private chart: Chart;
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

    this.noData$.next(true);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public initChart(): void {
    const chart: Chart = new google.visualization.Timeline(this.container.nativeElement);
    this.chart = chart;

    this.timelineService.timelineData$
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe((data: SlotItemType[]) => {
        if (data.length > 0) {
          const table: Table = this.createTable(data);
          this.draw(table);

          this.noData$.next(true);
        } else {
          this.noData$.next(false);
        }
    });
  }

  private draw(table: Table): void {
    requestAnimationFrame(() => {
      this.chart.draw(table, this.options);
    });
  }

  private createTable(rows: SlotItemType[]): Table {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Group' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'string', role: 'tooltip' });
    dataTable.addColumn({ type: 'number', id: 'Start' });
    dataTable.addColumn({ type: 'number', id: 'End' });

    dataTable.addRows([
      ...rows,
    ]);

    return dataTable;
  }

}
