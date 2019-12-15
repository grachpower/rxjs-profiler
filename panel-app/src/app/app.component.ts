import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ExtensionConnectService} from "./services/extension-connect/extension-connect.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private extensionConnectService: ExtensionConnectService,
  ) {}

  public ngOnInit(): void {
    this.extensionConnectService.init();
  }

}
