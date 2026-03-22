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
import { NotificationsService } from "../../../core/services/notifications.service";
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
  ],
  templateUrl: "./new-notification.component.html",
  styleUrl: "./new-notification.component.scss",
})
export class NewNotificationComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public options: DropOption[] = [
    { name: "Contratos sin pagos", code: "no-invoices" },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly notificationsService: NotificationsService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
  ) {
    this.formGroup = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      option: ["no-invoices", [Validators.required]],
    });
  }

  public sendNotification(): void {
    if (this.formGroup.valid) {
      const notification: PushNotification = {
        id: 0,
        title: this.formGroup.value.title,
        content: this.formGroup.value.description,
        //option: this.formGroup.value.option,
        userIds: [],
        created_date: new Date(),
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
