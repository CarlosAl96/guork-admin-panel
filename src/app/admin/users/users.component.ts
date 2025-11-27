import { Component, OnInit, ViewChild } from "@angular/core";
import { PaginatorModule } from "primeng/paginator";
import { QueryPagination } from "../../core/models/queryPagination";
import { User } from "../../core/models/user";
import { UsersService } from "../../core/services/users.service";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { InputGroupModule } from "primeng/inputgroup";
import { SessionService } from "../../core/services/session.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { NewUserComponent } from "./new-user/new-user.component";
import { DniViewComponent } from "./dni-view/dni-view.component";
import { DropdownModule } from "primeng/dropdown";
import { DropOption } from "../../core/models/dropOption";
import { DateFormatPipe } from "../../core/pipes/date-format.pipe";

@Component({
  selector: "app-users",
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
  ],
  providers: [DialogService],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public userLogged!: User | undefined;
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearch: string = "";
  public isLoading: boolean = false;

  public queryPagination: QueryPagination = {
    page: 1,
    pageSize: 10,
  };

  public selectedUserType: string = "";
  public userTypes: DropOption[] = [
    { name: "Todos", code: "" },
    { name: "Usuario", code: "user" },
    { name: "Administrador", code: "admin" },
    { name: "Experto", code: "expert" },
  ];

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.userLogged = this.sessionService.readSession("USER_TOKEN")?.user;
    this.getUsersList(this.queryPagination);
  }

  public getUsersList(query: QueryPagination): void {
    this.isLoading = true;
    this.usersService.getUsers(query).subscribe({
      next: (res) => {
        this.users = res.items;
        this.totalRows = res.totalItems;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.queryPagination.role = this.selectedUserType;
    this.getUsersList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getUsersList(this.queryPagination);
  }

  public showEditModal(user: User): void {
    const data: any = {
      user: user,
      option: "edit",
    };
    this.dialogRef = this.dialogService.open(NewUserComponent, {
      data: data,
      header: "Editar usuario",
      width: "80rem",
    });

    this.onCloseModal();
  }

  public showCreateModal(role: string): void {
    const data: any = {
      role: role,
      option: "create",
    };
    this.dialogRef = this.dialogService.open(NewUserComponent, {
      data: data,
      header: "Crear " + (role == "expert" ? "experto" : "usuario"),
      width: "80rem",
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.getUsersList(this.queryPagination);
    });
  }

  public showDniModal(dni: string): void {
    const data: any = {
      dni: dni,
    };
    this.dialogRef = this.dialogService.open(DniViewComponent, {
      data: data,
      header: "Imagen de cédula",
      width: "70rem",
    });

    this.onCloseModal();
  }
}
