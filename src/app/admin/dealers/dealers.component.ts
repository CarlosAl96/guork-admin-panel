import { Component, ViewChild } from '@angular/core';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Dealer } from '../../core/models/dealer';
import { QueryPagination } from '../../core/models/queryPagination';
import { DealersService } from '../../core/services/dealers.service';
import { NewDealerComponent } from './new-dealer/new-dealer.component';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-dealers',
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
  ],
  providers: [DialogService],
  templateUrl: './dealers.component.html',
  styleUrl: './dealers.component.scss',
})
export class DealersComponent {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public dealers: Dealer[] = [];
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
    private readonly dealersService: DealersService,
    private readonly dialogService: DialogService,
    private readonly sessionService: SessionService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getDealersList(this.queryPagination);
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getDealersList(this.queryPagination);
  }

  private getDealersList(query: QueryPagination): void {
    this.dealersService.getDealers(query).subscribe((res) => {
      if (res) {
        this.dealers = res.response.data;
        this.totalRows = res.response.totalRows;
      }
    });
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getDealersList(this.queryPagination);
  }

  public showCreateModal(dealer?: Dealer): void {
    const data: any = {
      dealer: dealer ? dealer : null,
      option: dealer ? 'clone' : 'create',
    };
    this.dialogRef = this.dialogService.open(NewDealerComponent, {
      data: data,
      header: 'Crear nuevo concesionario',
      width: '50rem',
    });

    this.onCloseModal();
  }

  public showEditModal(dealer: Dealer): void {
    const data: any = {
      dealer: dealer,
      option: 'edit',
    };
    this.dialogRef = this.dialogService.open(NewDealerComponent, {
      data: data,
      header: 'Editar concesionario',
      width: '50rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getDealersList(this.queryPagination);
    });
  }
}
