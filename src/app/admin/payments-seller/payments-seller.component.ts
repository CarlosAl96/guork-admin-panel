import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { QueryPagination } from '../../core/models/queryPagination';
import { Seller } from '../../core/models/seller';
import { User } from '../../core/models/user';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { SellersService } from '../../core/services/sellers.service';
import { SessionService } from '../../core/services/session.service';
import { ToastService } from '../../core/services/toast.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-payments-seller',
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
    CalendarModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './payments-seller.component.html',
  styleUrl: './payments-seller.component.scss',
})
export class PaymentsSellerComponent {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public formGroup!: FormGroup;
  public sellers: Seller[] = [];
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public user!: User | undefined;
  public modelSearch: string = '';
  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    month: '',
    code_dealer: 0,
  };
  constructor(
    private readonly sellersService: SellersService,
    private readonly sessionService: SessionService,
    private readonly formBuilder: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: ToastService
  ) {
    this.formGroup = this.formBuilder.group({
      month: [new Date(), Validators.required],
    });

    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getSellersList(this.queryPagination);
  }

  private getSellersList(query: QueryPagination): void {
    query.month = new Date(this.formGroup.get('month')?.value)
      .toISOString()
      .split('T')[0];
    this.sellersService.getSellersFiltered(query).subscribe((res) => {
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
      message: `¿Estás seguro de marcar como pagadas las ventas de este vendedor?`,
      header: 'Pagar al vendedor',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.sellersService
          .markAsPayedFiltered(id, this.queryPagination.month ?? '')
          .subscribe({
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
                detail:
                  'Ha ocurrido un error al marcar las ventas como pagadas',
              });
            },
          });
      },
      reject: () => {},
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

  public filterByMonth(): void {
    this.queryPagination.page = 1;
    this.queryPagination.month = this.formGroup.get('month')?.value;
    this.getSellersList(this.queryPagination);
  }
}
