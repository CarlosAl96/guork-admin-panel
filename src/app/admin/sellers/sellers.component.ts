import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { Seller } from '../../core/models/seller';
import { QueryPagination } from '../../core/models/queryPagination';
import { SellersService } from '../../core/services/sellers.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionService } from '../../core/services/session.service';
import { User } from '../../core/models/user';
import { NewSellerComponent } from './new-seller/new-seller.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-sellers',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FormsModule,
    PaginatorModule,
    TooltipModule,
    CardModule,
    InputTextModule,
    InputGroupModule,
    DateFormatPipe,
    ConfirmDialogModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.scss',
})
export class SellersComponent {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public sellers: Seller[] = [];
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public user!: User | undefined;
  public modelSearch: string = '';
  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };
  constructor(
    private readonly sellersService: SellersService,
    private readonly dialogService: DialogService,
    private readonly sessionService: SessionService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: ToastService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getSellersList(this.queryPagination);
  }

  private getSellersList(query: QueryPagination): void {
    this.sellersService.getSellers(query).subscribe((res) => {
      if (res) {
        this.sellers = res.response.data;
        this.totalRows = res.response.totalRows;

        this.sellers = this.sellers.map((seller) => {
          seller.total_to_pay = seller.sales.reduce(
            (acc, sale) => acc + parseFloat(sale.amount_to_pay.toString()),
            0
          );
          return seller;
        });
        console.log(this.sellers);
      }
    });
  }

  public markAsPayed(id: number) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de marcar como pagadas todas las ventas de este vendedor?`,
      header: 'Pagar al vendedor',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.sellersService.markAsPayed(id).subscribe({
          next: (res) => {
            this.queryPagination.page = 1;
            this.paginator.changePage(0);
            this.getSellersList(this.queryPagination);

            this.messageService.setMessage({
              severity: 'success',
              summary: 'Pago exitoso',
              detail: 'Se han marcado las ventas como pagadas',
            });
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'Ha ocurrido un error al marcar las ventas como pagadas',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  public showCreateModal(): void {
    const data: any = {
      option: 'create',
    };
    this.dialogRef = this.dialogService.open(NewSellerComponent, {
      data: data,
      header: 'Crear nuevo vendedor',
      width: '50rem',
    });

    this.onCloseModal();
  }

  public showEditModal(seller: Seller): void {
    const data: any = {
      seller: seller,
      option: 'edit',
    };
    this.dialogRef = this.dialogService.open(NewSellerComponent, {
      data: data,
      header: 'Editar vendedor',
      width: '50rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getSellersList(this.queryPagination);
    });
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getSellersList(this.queryPagination);
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getSellersList(this.queryPagination);
  }
}
