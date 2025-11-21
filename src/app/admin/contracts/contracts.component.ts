import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../core/models/contract';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ContractsService } from '../../core/services/contracts.service';
import { QueryPagination } from '../../core/models/queryPagination';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { CalendarModule } from 'primeng/calendar';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contracts',
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
    CalendarModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
})
export class ContractsComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public contracts: Contract[] = [];
  public totalRows: number = 0;
  public initPage: boolean = true;
  public loading: boolean = false;
  public modelSearch: string = '';
  public formGroup!: FormGroup;
  public user!: User | undefined;

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly contractsService: ContractsService,
    private readonly formBuilder: FormBuilder,
    private readonly sessionService: SessionService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: ToastService
  ) {
    this.formGroup = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getContractsList(this.queryPagination);
  }

  private getContractsList(query: QueryPagination) {
    this.contractsService.getContracts(query).subscribe((resp) => {
      if (resp) {
        this.contracts = resp.response.data;
        this.totalRows = resp.response.totalRows;
      }
    });
  }

  public deleteContract(id: number, urlContract: string) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar este contrato de forma permanente?`,
      header: 'Eliminar contrato',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.contractsService.deleteContract(id, urlContract).subscribe({
          next: (res) => {
            this.queryPagination.page = 1;
            this.paginator.changePage(0);
            this.getContractsList(this.queryPagination);

            this.messageService.setMessage({
              severity: 'success',
              summary: 'Eliminado exitoso',
              detail: 'Contrato eliminado con éxito',
            });
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar este contrato',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getContractsList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getContractsList(this.queryPagination);
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

  private downloadFile(blob: Blob, fileName: string, zip: boolean) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  generateZip() {
    if (this.formGroup.valid) {
      this.loading = true;

      const obj: any = {
        ...this.formGroup.value,
        code_dealer: this.user?.code_dealer,
      };

      this.contractsService.downloadZip(obj).subscribe({
        next: (res) => {
          if (res) {
            this.downloadFile(res, 'contratos.zip', true);
          }

          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'No se han encontrado contratos en este rango de fechas',
          });
        },
      });
    } else {
      this.formGroup.controls['from'].markAsDirty();
      this.formGroup.controls['to'].markAsDirty();
    }
  }
}
