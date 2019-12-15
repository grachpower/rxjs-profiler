import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subject} from "rxjs";
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
export class TimelineContainerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('container', {static: true}) public container: ElementRef;
  @Input() public data: SlotItemType[];

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
  private chartLoaded: boolean = false;
  private destroyed$ = new Subject<void>();

  public ngOnInit(): void {
    google.charts.load("current", {packages:["timeline"]});
    google.charts.setOnLoadCallback(this.initChart.bind(this));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data && this.chartLoaded) {
      const table: Table = this.createTable(this.data);
      this.draw(table);
    }
  }

  public initChart(): void {
    const chart: Chart = new google.visualization.Timeline(this.container.nativeElement);
    this.chart = chart;
    this.chartLoaded = true;

    const table: Table = this.createTable(this.data);
    this.draw(table);
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
