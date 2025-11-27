import { Component } from "@angular/core";
import { User } from "../../../core/models/user";
import { UsersService } from "../../../core/services/users.service";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ToastService } from "../../../core/services/toast.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CalendarModule } from "primeng/calendar";
import { PasswordModule } from "primeng/password";
import { Profile } from "../../../core/models/profile";
import { ProfilesService } from "../../../core/services/profiles.service";
import { QueryPagination } from "../../../core/models/queryPagination";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-new-user",
  standalone: true,
  imports: [
    InputTextModule,
    CalendarModule,
    ButtonModule,
    ReactiveFormsModule,
    PasswordModule,
    MultiSelectModule,
  ],
  providers: [],
  templateUrl: "./new-user.component.html",
  styleUrl: "./new-user.component.scss",
})
export class NewUserComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public user!: User;
  public option: string = "";
  public role: string = "";
  public profiles: Profile[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig
  ) {
    this.formGroup = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dni: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      birthdate: ["", [Validators.required]],
      postalCode: ["", []],
      address: ["", []],
      password: ["", []],
      email: ["", [Validators.required, Validators.email]],
      profiles: [[]],
    });

    this.user = this.config.data.user;
    this.option = this.config.data.option;
    this.role = this.config.data.role;

    console.log(this.user);
    console.log(this.option);

    if (this.role === "expert" || this.user?.role === "expert") {
      this.getProfiles();
    }

    if (this.user) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == "edit") {
      this.editUser();
    } else {
      this.saveUser();
    }
  }

  public getProfiles(): void {
    const paginationReq: QueryPagination = {
      page: 1,
      pageSize: 10000,
    };

    this.profilesService.getProfiles(paginationReq).subscribe({
      next: (res) => {
        if (res) {
          this.profiles = res.items;
        }
      },
      error: (error) => {
        this.messageService.setMessage({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al cargar los perfiles",
        });
      },
    });
  }

  public saveUser(): void {
    if (this.formGroup.valid) {
      const user: User = {
        ...this.formGroup.value,
        role: this.role,
      };
      this.usersService.createUser(user).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: "success",
            summary: "Creado exitoso",
            detail: "Usuario creado con éxito",
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

  public editUser() {
    if (this.formGroup.valid) {
      const user: User = {
        ...this.formGroup.value,
      };

      if (user.password === "") {
        delete user.password;
      }

      this.usersService.updateUser(user, this.user.id).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: "success",
            summary: "Editado exitoso",
            detail: "Usuario editado con éxito",
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
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      dni: this.user.dni,
      phone: this.user.phone,
      birthdate: new Date(this.user.birthdate || ""),
      postalCode: this.user.postalCode,
      address: this.user.address,
      email: this.user.email,
      profiles: this.user.profiles?.map((profile) => profile.id) || [],
    });
  }
}
