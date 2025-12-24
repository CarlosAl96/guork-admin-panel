import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { DateFormatPipe } from "../../core/pipes/date-format.pipe";
import { User } from "../../core/models/user";
import { QueryPagination } from "../../core/models/queryPagination";
import { RequestsService } from "../../core/services/requests.service";
import { SessionService } from "../../core/services/session.service";
import { TabMenuModule } from "primeng/tabmenu";
import { MenuItem } from "primeng/api";
import { Assignment } from "../../core/models/assignment";
import { AssignExpertComponent } from "./assign-expert/assign-expert.component";

@Component({
  selector: "app-requests",
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
    TabMenuModule,
  ],
  providers: [DialogService],
  templateUrl: "./requests.component.html",
  styleUrl: "./requests.component.scss",
})
export class RequestsComponent {
  public assignments: Assignment[] = [];
  public userLogged!: User | undefined;
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearchAssignment: string = "";
  public modelSearchInProgress: string = "";
  public isLoading: boolean = false;

  public queryPagination: QueryPagination = {
    page: 1,
    pageSize: 10,
    search: "",
    status: "in-progress",
  };

  public items: MenuItem[] = [
    { label: "En espera", icon: "pi pi-clock" },
    { label: "Asignados", icon: "pi pi-check-square" },
  ];

  public activeTab: MenuItem = this.items[0];

  constructor(
    private readonly requestsService: RequestsService,
    private readonly sessionService: SessionService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.userLogged = this.sessionService.readSession("USER_TOKEN")?.user;
    this.getAssignmentsList(this.queryPagination);
  }

  public getAssignmentsList(query: QueryPagination): void {
    this.isLoading = true;
    this.requestsService.getAssignments(query).subscribe({
      next: (res) => {
        this.assignments = res.items;
        this.totalRows = res.totalItems;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  public search(): void {
    if (this.activeTab === this.items[0]) {
      this.queryPagination.search = this.modelSearchInProgress;
    } else {
      this.queryPagination.search = this.modelSearchAssignment;
    }

    this.queryPagination.page = 1;
    this.getAssignmentsList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getAssignmentsList(this.queryPagination);
  }

  public showAssignExpertModal(assignment: Assignment): void {
    const data: any = {
      assignment: assignment,
    };
    this.dialogRef = this.dialogService.open(AssignExpertComponent, {
      data: data,
      header: "Asignar experto",
      width: "80rem",
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.getAssignmentsList(this.queryPagination);
    });
  }

  public deleteRequest(requestId: string): void {
    this.requestsService.deleteRequest(requestId).subscribe({
      next: () => {
        this.getAssignmentsList(this.queryPagination);
      },
    });
  }

  public onActiveTabChange(event: MenuItem): void {
    this.assignments = [];
    this.queryPagination.page = 1;
    this.queryPagination.search = "";
    this.queryPagination.status =
      event === this.items[0] ? "in-progress" : "assigned";
    this.modelSearchInProgress = "";
    this.modelSearchAssignment = "";
    this.activeTab = event;
    this.getAssignmentsList(this.queryPagination);
  }

  public getStatusLabel(status: string): string {
    switch (status) {
      case "in-progress":
        return "En espera";
      case "assigned":
        return "Asignado";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  }
}
