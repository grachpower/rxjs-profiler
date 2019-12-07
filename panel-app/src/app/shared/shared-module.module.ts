import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

const DECLARATIONS = [];
const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  Ng2GoogleChartsModule,
];

@NgModule({
  declarations: [
    ...DECLARATIONS,
  ],
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...DECLARATIONS,
  ],
})
export class SharedModule { }
