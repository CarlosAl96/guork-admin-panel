import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dni-view',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './dni-view.component.html',
  styleUrl: './dni-view.component.scss',
})
export class DniViewComponent {
  public dni: string = '';
  constructor(
    public config: DynamicDialogConfig,
    public readonly refDialog: DynamicDialogRef
  ) {
    this.dni = this.config.data.dni || '';
  }
}
