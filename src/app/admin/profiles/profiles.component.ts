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
import { ProfilesService } from "../../core/services/profiles.service";
import { SessionService } from "../../core/services/session.service";
import { QueryPagination } from "../../core/models/queryPagination";
import { User } from "../../core/models/user";
import { NewProfileComponent } from "./new-profile/new-profile.component";
import { Profile } from "../../core/models/profile";
import { DateFormatPipe } from "../../core/pipes/date-format.pipe";

@Component({
  selector: "app-profiles",
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
  templateUrl: "./profiles.component.html",
  styleUrl: "./profiles.component.scss",
})
export class ProfilesComponent {
  public profiles: Profile[] = [];
  public userLogged!: User | undefined;
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearch: string = "";
  public isLoading: boolean = false;

  public queryPagination: QueryPagination = {
    page: 1,
    pageSize: 10,
    search: "",
  };

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly sessionService: SessionService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.userLogged = this.sessionService.readSession("USER_TOKEN")?.user;
    this.getProfilesList(this.queryPagination);
  }

  public getProfilesList(query: QueryPagination): void {
    this.isLoading = true;
    this.profilesService.getProfiles(query).subscribe({
      next: (res) => {
        this.profiles = res.items;
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
    this.getProfilesList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getProfilesList(this.queryPagination);
  }

  public showEditModal(profile: Profile): void {
    const data: any = {
      profile: profile,
      option: "edit",
    };
    this.dialogRef = this.dialogService.open(NewProfileComponent, {
      data: data,
      header: "Editar perfil",
      width: "80rem",
    });

    this.onCloseModal();
  }

  public showCreateModal(): void {
    const data: any = {
      option: "create",
    };
    this.dialogRef = this.dialogService.open(NewProfileComponent, {
      data: data,
      header: "Crear perfil",
      width: "80rem",
    });

    this.onCloseModal();
  }

  public deleteProfile(profileId: string): void {
    this.profilesService.deleteProfile(profileId).subscribe({
      next: () => {
        this.getProfilesList(this.queryPagination);
      },
    });
  }

  public getArrayFromJson(jsonString: string): string[] {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.getProfilesList(this.queryPagination);
    });
  }
}
