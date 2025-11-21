import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropOption } from '../../../core/models/dropOption';
import { ProductsService } from '../../../core/services/products.service';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-set-category-values',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './set-category-values.component.html',
  styleUrl: './set-category-values.component.scss',
})
export class SetCategoryValuesComponent {
  public formGroup!: FormGroup;
  public loading: boolean = false;
  public categories: DropOption[] = [
    { name: 'Motos', code: 'vehicle' },
    { name: 'Hogar', code: 'home' },
    { name: 'Tecnología', code: 'technology' },
    { name: 'Aire', code: 'air' },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productsService: ProductsService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef
  ) {
    this.formGroup = this.formBuilder.group({
      category: ['vehicle', [Validators.required]],
      differential: [1, [Validators.required]],
      earnings_percent: [1, [Validators.required]],
      discount_usd: [0, [Validators.required]],
    });
  }

  public save(): void {
    console.log(this.formGroup.value);

    if (this.formGroup.valid) {
      const obj: any = this.formGroup.value;

      obj.discount_usd = obj.discount_usd / 100;

      console.log(obj);
      
      this.loading = true;

      this.productsService.updateCategoryValues(obj).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'success',
            summary: 'Guardado exitoso',
            detail: 'Los productos se actualizaron correctamente',
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
}
