import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '../../pipes/translate.pipe';


@NgModule({
  declarations: [TranslatePipe],
  exports:[TranslatePipe],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
