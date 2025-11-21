import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { Contract } from '../../core/models/contract';
import { ContractsService } from '../../core/services/contracts.service';
import { SessionService } from '../../core/services/session.service';
import { QueryPagination } from '../../core/models/queryPagination';
import { User } from '../../core/models/user';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HistoryUserComponent } from './history-user/history-user.component';

@Component({
  selector: 'app-awards',
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
    ReactiveFormsModule,
  ],
  providers: [DialogService],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.scss',
})
export class AwardsComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public contracts: Contract[] = [];
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public loading: boolean = false;
  public modelSearch: string = '';
  public user!: User | undefined;

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly contractsService: ContractsService,
    private readonly dialogService: DialogService,
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getContractsAwardsList(this.queryPagination);
  }

  private getContractsAwardsList(query: QueryPagination) {
    this.contractsService.getContractsAwards(query).subscribe((resp) => {
      if (resp) {
        this.contracts = resp.response.data;
        this.totalRows = resp.response.totalRows;

        this.contracts = this.contracts.map((contract) => {
          contract.payed_percent = this.getPayedPercent(
            contract.num_quota_payed,
            contract.number_of_quotas
          );
          return contract;
        });
      }
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getContractsAwardsList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getContractsAwardsList(this.queryPagination);
  }

  public downloadPdf(contract: Contract): void {
    const fileName = `${contract.user_name} ${contract.user_last_name} - Contrato de autofinanciamiento para ${contract.product_name}`;
    this.contractsService
      .downloadContractPdf(contract.signing)
      .subscribe((res) => {
        if (res) {
          this.downloadFile(res, fileName || 'contrato.pdf', false);
        }
      });
  }

  private getPayedPercent(
    num_quota_payed: number,
    number_of_quotas: number
  ): number {
    return Number(((num_quota_payed / number_of_quotas) * 100).toFixed(2));
  }

  private downloadFile(blob: Blob, fileName: string, zip: boolean) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public showHistoryModal(userId: number): void {
    this.dialogRef = this.dialogService.open(HistoryUserComponent, {
      data: userId,
      header: 'Historial del usuario',
      width: '50rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getContractsAwardsList(this.queryPagination);
    });
  }
}
