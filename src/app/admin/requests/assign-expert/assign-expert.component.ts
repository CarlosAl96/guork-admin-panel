import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsersService } from "../../../core/services/users.service";
import { RequestsService } from "../../../core/services/requests.service";
import { User } from "../../../core/models/user";
import { Assignment } from "../../../core/models/assignment";
import { finalize, switchMap } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-assign-expert",
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule, ButtonModule],
  templateUrl: "./assign-expert.component.html",
  styleUrls: ["./assign-expert.component.scss"],
})
export class AssignExpertComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly requestsService = inject(RequestsService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly toast = inject(ToastService);

  assignment!: Assignment;

  experts: User[] = [];
  filteredExperts: User[] = [];
  selectedExpert: User | null = null;

  loading = false;
  assigning = false;

  ngOnInit(): void {
    this.assignment = this.dialogConfig?.data?.assignment as Assignment;
    this.loadExperts();
  }

  loadExperts(): void {
    this.loading = true;
    this.usersService
      .getUsers({
        page: 1,
        pageSize: 1000,
        role: "expert",
        profile: this.assignment.request.profileId,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.experts = res.items || [];
          this.filteredExperts = [...this.experts];
        },
        error: () => {
          this.toast.setMessage({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar los expertos.",
          });
        },
      });
  }

  searchExperts(event: { query: string }): void {
    const q = (event?.query || "").toLowerCase().trim();
    if (!q) {
      this.filteredExperts = [...this.experts];
      return;
    }
    this.filteredExperts = this.experts.filter((u) => {
      const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }

  assign(): void {
    if (!this.selectedExpert || !this.assignment) return;
    const expertId = this.selectedExpert.id;

    const assignmentPayload: Partial<Assignment> = {
      status: "assigned",
      assignedId: expertId,
    };

    const requestPayload = { status: "assigned" } as const;

    this.assigning = true;
    this.requestsService
      .updateAssignment(this.assignment.id, assignmentPayload)
      .pipe(
        switchMap(() =>
          this.requestsService.updateRequest(
            this.assignment.requestId,
            requestPayload as any
          )
        ),
        finalize(() => (this.assigning = false))
      )
      .subscribe({
        next: () => {
          this.toast.setMessage({
            severity: "success",
            summary: "Asignado",
            detail: "Experto asignado correctamente.",
          });
          this.dialogRef.close(true);
        },
        error: () => {
          this.toast.setMessage({
            severity: "error",
            summary: "Error",
            detail: "No se pudo asignar el experto.",
          });
        },
      });
  }
}
