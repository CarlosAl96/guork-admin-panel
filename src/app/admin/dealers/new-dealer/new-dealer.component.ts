import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { Dealer } from '../../../core/models/dealer';
import { DealersService } from '../../../core/services/dealers.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-new-dealer',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    PasswordModule,
    InputNumberModule,
    MessagesModule,
  ],
  templateUrl: './new-dealer.component.html',
  styleUrl: './new-dealer.component.scss',
})
export class NewDealerComponent {
  public formGroupCreate!: FormGroup;
  public formGroupEdit!: FormGroup;
  public loading: boolean = false;
  public dealer!: Dealer;
  public option: string = '';
  public errorPassword!: Message[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dealersService: DealersService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig
  ) {
    this.dealer = this.config.data.dealer;
    this.option = this.config.data.option;

    if (this.option == 'edit') {
      this.formGroupEdit = this.formBuilder.group({
        name: ['', Validators.required],
        rif: ['', Validators.required],
        street: ['', [Validators.required]],
        percent: ['', [Validators.required]],
        code: ['', [Validators.required]],
      });
    } else {
      this.formGroupCreate = this.formBuilder.group({
        name: ['', Validators.required],
        rif: ['', Validators.required],
        street: ['', [Validators.required]],
        email: [''],
        password: ['', [Validators.required]],
        password2: ['', [Validators.required]],
        percent: [null, [Validators.required]],
        code: ['1234', [Validators.required]],
      });
    }

    console.log(this.dealer);
    console.log(this.option);

    if (this.dealer) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == 'edit') {
      this.editDelaer();
    } else {
      this.saveDelaer();
    }
  }

  public saveDelaer(): void {
    console.log(this.formGroupCreate.value);

    this.markFormControlsAsDirty(this.formGroupCreate);

    if (
      this.formGroupCreate.controls['password'].value !=
      this.formGroupCreate.controls['password2'].value
    ) {
      this.loading = false;
      this.errorPassword = [
        {
          severity: 'error',
          detail: 'Las contraseñas no coinciden',
        },
      ];
      return;
    }

    if (this.formGroupCreate.valid) {
      this.dealersService.createDealer(this.formGroupCreate.value).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'success',
            summary: 'Guardado exitoso',
            detail: 'Dealer creado con éxito',
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

  public editDelaer() {
    this.markFormControlsAsDirty(this.formGroupEdit);

    if (this.formGroupEdit.valid) {
      this.dealersService
        .updateDealer(this.formGroupEdit.value, this.dealer.id)
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.messageService.setMessage({
              severity: 'success',
              summary: 'Editado exitoso',
              detail: 'Dealer editado con éxito',
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

  private markFormControlsAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control) control.markAsDirty({ onlySelf: true });
    });
  }

  private setFormToEdit(): void {
    this.formGroupEdit.patchValue({
      name: this.dealer.name,
      rif: this.dealer.rif,
      street: this.dealer.street,
      percent: this.dealer.percent,
      code: this.dealer.code,
    });
  }

  public generateCode(): void {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.formGroupCreate.controls['code'].setValue(random);
  }
}
