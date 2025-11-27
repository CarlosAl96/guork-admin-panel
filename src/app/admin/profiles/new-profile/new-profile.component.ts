import { Component } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Profile } from "../../../core/models/profile";
import { ProfilesService } from "../../../core/services/profiles.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../../core/services/toast.service";
import { DropOption } from "../../../core/models/dropOption";
import { DropdownModule } from "primeng/dropdown";
import { ChipsModule } from "primeng/chips";

@Component({
  selector: "app-new-profile",
  standalone: true,
  imports: [
    InputTextModule,
    CalendarModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    ChipsModule,
  ],
  providers: [],
  templateUrl: "./new-profile.component.html",
  styleUrl: "./new-profile.component.scss",
})
export class NewProfileComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public profile!: Profile;
  public option: string = "";
  public statusOptions: DropOption[] = [
    { name: "Disponible", code: "available" },
    { name: "No disponible", code: "unavailable" },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profilesService: ProfilesService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig
  ) {
    this.formGroup = this.formBuilder.group({
      name: ["", Validators.required],
      status: ["available", Validators.required],
      descriptions: ["", []],
    });

    this.profile = this.config.data.profile;
    this.option = this.config.data.option;

    console.log(this.profile);
    console.log(this.option);

    if (this.profile) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == "edit") {
      this.editProfile();
    } else {
      this.saveProfile();
    }
  }

  public saveProfile(): void {
    if (this.formGroup.valid) {
      const profile: Profile = {
        id: "",
        name: this.formGroup.get("name")?.value,
        status: this.formGroup.get("status")?.value,
        descriptions: JSON.stringify(this.formGroup.get("descriptions")?.value),
      };

      this.profilesService.createProfile(profile).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: "success",
            summary: "Creación exitosa",
            detail: "Perfil creado con éxito",
          });
          this.refDialog.close();
        },
        error: (error) => {
          this.messageService.setMessage({
            severity: "error",
            summary: "Error",
            detail: "Ha ocurrido un error",
          });
          this.loading = false;
        },
      });
    }
  }

  public editProfile() {
    if (this.formGroup.valid) {
      const profile: Partial<Profile> = {
        name: this.formGroup.get("name")?.value,
        status: this.formGroup.get("status")?.value,
        descriptions: JSON.stringify(this.formGroup.get("descriptions")?.value),
      };

      this.profilesService.updateProfile(profile, this.profile.id).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: "success",
            summary: "Editado exitoso",
            detail: "Perfil editado con éxito",
          });
          this.refDialog.close();
        },
        error: (error) => {
          this.messageService.setMessage({
            severity: "error",
            summary: "Error",
            detail: "Ha ocurrido un error",
          });
          this.loading = false;
        },
      });
    }
  }

  private setFormToEdit(): void {
    this.formGroup.patchValue({
      name: this.profile.name,
      status: this.profile.status,
      descriptions: JSON.parse(this.profile.descriptions || "[]"),
    });
  }
}
