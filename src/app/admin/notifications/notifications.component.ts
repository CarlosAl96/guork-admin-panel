import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from '../../core/services/notifications.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { QueryPagination } from '../../core/models/queryPagination';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { PushNotification } from '../../core/models/notification';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { NewNotificationComponent } from './new-notification/new-notification.component';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-notifications',
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
    ConfirmDialogModule,
    DropdownModule,
    DateFormatPipe,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public modelSearch: string = '';
  public notifications: PushNotification[] = [];
  public totalRows: number = 0;
  public dialogRef!: DynamicDialogRef;
  public user!: User | undefined;

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly dialogService: DialogService,
    private readonly messageService: ToastService,
    private readonly confirmationService: ConfirmationService,
    private readonly sessionService: SessionService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.getNotificationsList(this.queryPagination);
  }

  private getNotificationsList(query: QueryPagination): void {
    this.notificationsService.getNotificationsList(query).subscribe((res) => {
      if (res) {
        this.notifications = res.response.data;
        this.totalRows = res.response.totalRows;
      }
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getNotificationsList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getNotificationsList(this.queryPagination);
  }

  public showCreateModal(): void {
    this.dialogRef = this.dialogService.open(NewNotificationComponent, {
      header: 'Enviar notificación',
      width: '70rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getNotificationsList(this.queryPagination);
    });
  }

  public resendNotification(notification: PushNotification): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de reenviar esta notificación?`,
      header: 'Reenviar notificación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.notificationsService.sendNotification(notification).subscribe({
          next: (res) => {},
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'No se ha podido crear la notificación',
            });
          },
        });
        this.queryPagination.page = 1;
        this.paginator.changePage(0);
        this.getNotificationsList(this.queryPagination);

        this.messageService.setMessage({
          severity: 'success',
          summary: 'Notificación creada',
          detail: 'La notificación se enviará en un instante',
        });
      },
      reject: () => {},
    });
  }
}
