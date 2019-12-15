import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {TimelineService} from "../../../services/timeline/timeline.service";
import {takeUntil} from "rxjs/operators";
import {SlotItemType} from "../../../models/slot-item-model";

declare var google: any;

type Table = any;
type Chart = any;

@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  styleUrls: ['./timeline-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineContainerComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: true}) public container: ElementRef;

  private chart: Chart;
  private options = {
    timeline: {
      groupByRowLabel: true,
      colorByRowLabel: false,
      showBarLabels: false,
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
    const chart: Chart = new google.visualization.Timeline(this.container.nativeElement);
    this.chart = chart;

    this.timelineService.timelineData$
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe((data: SlotItemType[]) => {
        const table: Table = this.createTable(data);
        this.draw(table);
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
