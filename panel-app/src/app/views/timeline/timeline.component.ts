import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {map, shareReplay} from "rxjs/operators";

import {TimelineService} from "../../services/timeline/timeline.service";
import {ExtensionConnectService} from "../../services/extension-connect/extension-connect.service";
import {AppStatusTypes} from "../../models/app-status-types";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit {
  public recording$ = this.extensionConnect.status$
    .pipe(
      map((status: AppStatusTypes) => status === AppStatusTypes.RECEIVING),
      shareReplay({refCount: true, bufferSize: 1}),
    );

  constructor(
    private timelineService: TimelineService,
    private extensionConnect: ExtensionConnectService,
  ) { }

  public ngOnInit(): void {
  }

}
