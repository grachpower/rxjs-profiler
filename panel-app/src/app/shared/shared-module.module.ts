import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
];

const DECLARATIONS = [];
const MODULES = [
  ...MATERIAL_MODULES,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
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
