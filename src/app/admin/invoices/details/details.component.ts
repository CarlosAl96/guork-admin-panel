import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Invoice } from '../../../core/models/invoice';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { InvoicesService } from '../../../core/services/invoices.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  public invoice!: Invoice;

  constructor(
    public config: DynamicDialogConfig,
    public readonly refDialog: DynamicDialogRef,
    private readonly messageService: ToastService,
    private readonly confirmationService: ConfirmationService,
    private readonly invoicesService: InvoicesService
  ) {
    this.invoice = this.config.data;
  }

  public verifyPayment(id: number): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de marcar este pago como verificado?`,
      header: 'Verificar pago',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.invoicesService.verifyPayment(id).subscribe({
          next: (res) => {
            this.messageService.setMessage({
              severity: 'success',
              summary: 'Verificación de pago exitosa',
              detail: 'El pago fue verificado con éxito',
            });
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un error verificando el pago',
            });
          },
        });
      },
      reject: () => {},
    });
  }
}
