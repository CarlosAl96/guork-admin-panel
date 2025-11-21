import { Component } from '@angular/core';
import { ContractsService } from '../../core/services/contracts.service';
import { QueryPagination } from '../../core/models/queryPagination';
import { NextInvoice } from '../../core/models/nextInvoice';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DropdownModule } from 'primeng/dropdown';
import { DateFromNowPipe } from '../../core/pipes/date-from-now.pipe';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-next-invoices',
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
    DropdownModule,
    DateFormatPipe,
    DateFromNowPipe,
    InputSwitchModule,
  ],
  templateUrl: './next-invoices.component.html',
  styleUrl: './next-invoices.component.scss',
})
export class NextInvoicesComponent {
  public nextInvoices: NextInvoice[] = [];
  public totalRows: number = 0;
  public initPage: boolean = true;
  public loading: boolean = false;
  public modelSearch: string = '';
  public modelCategory: string = '';
  public user!: User | undefined;

  public categories: any[] = [
    { name: 'Todos', code: '' },
    { name: 'Próximos', code: 'nexts' },
    { name: 'De inmediato', code: 'immediate' },
    { name: 'Atrasados', code: 'delayed' },
    { name: 'Completos', code: 'completed' },
  ];

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    category: '',
    code_dealer: 0,
  };

  constructor(
    private readonly contractsService: ContractsService,
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getNextInvoicesByCOntracts(this.queryPagination);
  }

  private getNextInvoicesByCOntracts(query: QueryPagination) {
    this.contractsService
      .getNextInvoicesByContracts(query)
      .subscribe((resp) => {
        if (resp) {
          this.nextInvoices = resp.response.data;
          this.totalRows = resp.response.totalRows;

          this.nextInvoices = this.nextInvoices.map((contract) => {
            contract.payed_percent = this.getPayedPercent(
              contract.num_quota_payed,
              contract.number_of_quotas
            );
            return contract;
          });

          console.log(this.nextInvoices);
        }
      });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.category = this.modelCategory;
    this.queryPagination.page = 1;
    this.getNextInvoicesByCOntracts(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getNextInvoicesByCOntracts(this.queryPagination);
  }

  private getPayedPercent(
    num_quota_payed: number,
    number_of_quotas: number
  ): number {
    return Number(((num_quota_payed / number_of_quotas) * 100).toFixed(2));
  }
}
