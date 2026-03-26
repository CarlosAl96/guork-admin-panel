import { Component } from "@angular/core";
import { DropOption } from "../../../core/models/dropOption";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ToastService } from "../../../core/services/toast.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MultiSelectModule } from "primeng/multiselect";
import { CommonModule } from "@angular/common";
import { NotificationsService } from "../../../core/services/notifications.service";
import { UsersService } from "../../../core/services/users.service";
import { User } from "../../../core/models/user";
import { PushNotification } from "../../../core/models/notification";

@Component({
  selector: "app-new-notification",
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule,
    MultiSelectModule,
    CommonModule,
  ],
  templateUrl: "./new-notification.component.html",
  styleUrl: "./new-notification.component.scss",
})
export class NewNotificationComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public loadingUsers: boolean = false;
  public userOptions: { label: string; value: string }[] = [
    { label: "Todos", value: "ALL" },
  ];
  private allUsers: User[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
  ) {
    this.formGroup = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      users: [[], Validators.required],
    });
    this.loadUsers();
  }

  private loadUsers(filter: string = ""): void {
    this.loadingUsers = true;
    this.usersService
      .getUsers({ page: 1, pageSize: 20, search: filter })
      .subscribe({
        next: (res) => {
          this.allUsers = res.items;
          const userOpts = res.items.map((u) => ({
            label: `${u.firstName || ""} ${u.lastName || ""} (${u.email})`,
            value: u.id,
          }));
          this.userOptions = [{ label: "Todos", value: "ALL" }, ...userOpts];
          this.loadingUsers = false;
        },
        error: () => {
          this.loadingUsers = false;
        },
      });
  }

  public onUserFilter(event: any): void {
    const filter = event?.filter || "";
    this.loadUsers(filter);
  }

  public onUsersChange(): void {
    const selected = this.formGroup.value.users;
    if (selected && selected.includes("ALL")) {
      this.formGroup.patchValue({ users: ["ALL"] });
    } else if (
      selected &&
      selected.length > 1 &&
      selected.includes("ALL") === false
    ) {
      // Si se selecciona cualquier usuario, deselecciona 'Todos' si estaba
      this.formGroup.patchValue({
        users: selected.filter((v: string) => v !== "ALL"),
      });
    }
  }

  public sendNotification(): void {
    if (this.formGroup.valid) {
      let userIds: string[] = [];
      const selected = this.formGroup.value.users;
      if (selected && selected.length === 1 && selected[0] === "ALL") {
        userIds = [];
      } else {
        userIds = selected.filter((v: string) => v !== "ALL");
      }
      const notification: PushNotification = {
        id: 0,
        title: this.formGroup.value.title,
        content: this.formGroup.value.description,
        userIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.notificationsService.sendNotification(notification).subscribe({
        next: (res) => {},
        error: (error) => {
          this.messageService.setMessage({
            severity: "error",
            summary: "Error",
            detail: "No se ha podido crear la notificación",
          });
        },
      });

      this.messageService.setMessage({
        severity: "success",
        summary: "Notificación creada",
        detail: "La notificación se enviará en un instante",
      });
      this.refDialog.close();
    }
  }
}
