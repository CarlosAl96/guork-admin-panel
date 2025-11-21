import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Seller } from '../../../core/models/seller';
import { SellersService } from '../../../core/services/sellers.service';
import { ToastService } from '../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-new-seller',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, MessagesModule],
  templateUrl: './new-seller.component.html',
  styleUrl: './new-seller.component.scss',
})
export class NewSellerComponent {
  public formGroup!: FormGroup;
  public seller!: Seller;
  public loading: boolean = false;
  public option: string = '';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sellersService: SellersService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig
  ) {
    this.seller = this.config.data.seller;
    this.option = this.config.data.option;

    this.formGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      identification: ['', [Validators.required]],
      email: ['', [Validators.required]],
      username: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    console.log(this.seller);
    console.log(this.option);

    if (this.seller) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == 'edit') {
      this.editSeller();
    } else {
      this.saveSeller();
    }
  }

  public saveSeller(): void {
    console.log(this.formGroup.value);

    this.markFormControlsAsDirty(this.formGroup);

    if (this.formGroup.valid) {
      this.sellersService.createSeller(this.formGroup.value).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'success',
            summary: 'Guardado exitoso',
            detail: 'Vendedor creado con éxito',
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

  public editSeller() {
    this.markFormControlsAsDirty(this.formGroup);

    if (this.formGroup.valid) {
      this.sellersService
        .updateSeller(this.formGroup.value, this.seller.id)
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.messageService.setMessage({
              severity: 'success',
              summary: 'Editado exitoso',
              detail: 'Vendedor editado con éxito',
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
    this.formGroup.patchValue({
      first_name: this.seller.first_name,
      last_name: this.seller.last_name,
      identification: this.seller.identification,
      email: this.seller.email,
      username: this.seller.username,
      phone: this.seller.phone,
      address: this.seller.address,
    });
  }
}
