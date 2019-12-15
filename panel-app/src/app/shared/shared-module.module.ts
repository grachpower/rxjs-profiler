import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { NgSelectModule } from '@ng-select/ng-select';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatInputModule,
];

const DECLARATIONS = [];
const MODULES = [
  ...MATERIAL_MODULES,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  NgSelectModule,
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
export class SharedModule {
}
