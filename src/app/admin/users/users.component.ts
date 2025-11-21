import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { QueryPagination } from '../../core/models/queryPagination';
import { User } from '../../core/models/user';
import { UsersService } from '../../core/services/users.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { SessionService } from '../../core/services/session.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewUserComponent } from './new-user/new-user.component';
import { DniViewComponent } from './dni-view/dni-view.component';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;

  public users: User[] = [];
  public userLogged!: User | undefined;
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearch: string = '';

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.userLogged = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.userLogged?.code_dealer ?? 0;
    this.getUsersList(this.queryPagination);
  }

  public getUsersList(query: QueryPagination): void {
    this.usersService.getUsers(query).subscribe((res) => {
      if (res) {
        this.users = res.response.data;
        this.totalRows = res.response.totalRows;
      }
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getUsersList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getUsersList(this.queryPagination);
  }

  public showEditModal(user: User): void {
    const data: any = {
      user: user,
      option: 'edit',
    };
    this.dialogRef = this.dialogService.open(NewUserComponent, {
      data: data,
      header: 'Editar usuario',
      width: '70rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      // this.queryPagination.page = 1;
      // this.paginator.changePage(0);
      this.getUsersList(this.queryPagination);
    });
  }

  public exportCsv() {
    this.usersService
      .exportCsv(this.queryPagination.code_dealer)
      .subscribe((res) => {
        if (res) {
          this.fromBlobToCsv(res);
        }
      });
  }

  private fromBlobToCsv(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public showDniModal(dni: string): void {
    const data: any = {
      dni: dni,
    };
    this.dialogRef = this.dialogService.open(DniViewComponent, {
      data: data,
      header: 'Imagen de cédula',
      width: '70rem',
    });

    this.onCloseModal();
  }
}
