import { Component } from '@angular/core';
import { User } from '../../../core/models/user';
import { UsersService } from '../../../core/services/users.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { DateFormatPipe } from '../../../core/pipes/date-format.pipe';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [InputTextModule, CalendarModule, ButtonModule, ReactiveFormsModule],
  providers: [DateFormatPipe],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss',
})
export class NewUserComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public user!: User;
  public option: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usersService: UsersService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private dateFormatPipe: DateFormatPipe
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      identification: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.user = this.config.data.user;
    this.option = this.config.data.option;

    console.log(this.user);
    console.log(this.option);

    if (this.user) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == 'edit') {
      this.editUser();
    } else {
      this.saveUser();
    }
  }

  public saveUser(): void {}

  public editUser() {
    if (this.formGroup.valid) {
      const birthdate: string = this.dateFormatPipe.transform(
        this.formGroup.controls['birthdate'].value.toString()
      );

      this.formGroup.patchValue({
        birthdate: birthdate,
      });
      this.usersService
        .updateUser(this.formGroup.value, this.user.id)
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.messageService.setMessage({
              severity: 'success',
              summary: 'Editado exitoso',
              detail: 'Usuario editado con éxito',
            });
            this.refDialog.close();
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'Ha ocurrido un error',
            });
            this.loading = false;
          },
        });
    }
  }

  private setFormToEdit(): void {
    this.formGroup.patchValue({
      name: this.user.name,
      last_name: this.user.last_name,
      identification: this.user.identification,
      phone: this.user.phone,
      birthdate: this.user.birthdate ? this.stringToDate(this.user.birthdate) : new Date(),
      postal_code: this.user.postal_code,
      street: this.user.street,
      city: this.user.city,
    });
  }

  private stringToDate(dateString: string): Date {
    const [day, month, year] = dateString
      .split('/')
      .map((num) => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }
}
