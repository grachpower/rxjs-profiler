import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './views/header/header.component';
import { FiltersComponent } from './views/filters/filters.component';
import { TimelineComponent } from './views/timeline/timeline.component';
import { SharedModule } from "./shared/shared-module.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineContainerComponent } from './views/timeline/timeline-container/timeline-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FiltersComponent,
    TimelineComponent,
    TimelineContainerComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
