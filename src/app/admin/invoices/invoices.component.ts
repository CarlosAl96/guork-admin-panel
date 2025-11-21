import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Invoice } from '../../core/models/invoice';
import { QueryPagination } from '../../core/models/queryPagination';
import { InvoicesService } from '../../core/services/invoices.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetailsComponent } from './details/details.component';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-invoices',
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
  ],
  providers: [DialogService],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public invoices: Invoice[] = [];
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearch: string = '';
  public user!: User | undefined;

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly dialogService: DialogService,
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getInvoicesList(this.queryPagination);
  }

  private getInvoicesList(query: QueryPagination) {
    this.invoicesService.getInvoices(query).subscribe((resp) => {
      if (resp) {
        this.invoices = resp.response.data;
        this.totalRows = resp.response.totalRows;
      }
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getInvoicesList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getInvoicesList(this.queryPagination);
  }

  public showDetailsModal(invoice?: Invoice): void {
    this.dialogRef = this.dialogService.open(DetailsComponent, {
      data: invoice,
      header: 'Detalles del pago',
      width: '50rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getInvoicesList(this.queryPagination);
    });
  }
}
