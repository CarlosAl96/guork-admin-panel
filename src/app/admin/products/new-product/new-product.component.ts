import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsService } from '../../../core/services/products.service';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product';
import { DropOption } from '../../../core/models/dropOption';

import { Dealer } from '../../../core/models/dealer';
import { DealersService } from '../../../core/services/dealers.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ChipsModule,
    DropdownModule,
    FileUploadModule,
    InputSwitchModule,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
})
export class NewProductComponent {
  public formGroup!: FormGroup;
  public files: any[] = [];
  public loading: boolean = false;
  public product!: Product;
  public option: string = '';
  private delaers: Dealer[] = [];
  public dealersDrop: DropOption[] = [];

  public categories: DropOption[] = [
    { name: 'Motos', code: 'vehicle' },
    { name: 'Hogar', code: 'home' },
    { name: 'Tecnología', code: 'technology' },
    { name: 'Aire', code: 'air' },
  ];

  public vehiclesSubCategories: DropOption[] = [
    { name: 'Urbanas', code: 'scooter' },
    { name: 'Rústicas', code: 'cruiser' },
    { name: 'Deportivas', code: 'touring' },
    { name: 'Viajeras', code: 'street' },
  ];

  public techSubCategories: DropOption[] = [
    { name: 'Celulares', code: 'phone' },
    { name: 'Juegos', code: 'game' },
    { name: 'Computadoras', code: 'pc' },
    { name: 'Tabletas', code: 'tablet' },
    { name: 'Relojes', code: 'watch' },
    { name: 'TVBox', code: 'tvbox' },
    { name: 'Internet', code: 'ethernet' },
    { name: 'Accesorios', code: 'accessory' },
  ];

  public homeSubCategories: DropOption[] = [
    { name: 'Cocina', code: 'kitchen' },
    { name: 'Refrigeración', code: 'freezer' },
    { name: 'Lavado', code: 'washing' },
  ];

  public subCategoryOptions: DropOption[] = this.vehiclesSubCategories;
  public uploadedFiles: any[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productsService: ProductsService,
    private readonly messageService: ToastService,
    private readonly refDialog: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly dealersService: DealersService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      differential: [1, [Validators.required]],
      earnings_percent: [1, [Validators.required]],
      discount_usd: [0, [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: [''],
      atributes: ['', [Validators.required]],
      code_dealer: [0, [Validators.required]],
      outstanding: [false],
    });

    this.dealersService.getAllDealers().subscribe((res) => {
      if (res) {
        this.delaers = res.response;

        this.dealersDrop = [];
        this.delaers.map((dealer) => {
          this.dealersDrop.push({
            name: dealer.code + ' - ' + dealer.name,
            code: dealer.code,
          });
        });
      }
    });

    this.product = this.config.data.product;
    this.option = this.config.data.option;

    console.log(this.product);
    console.log(this.option);

    if (this.product) {
      this.setFormToEdit();
    }
  }

  public createOrEdit() {
    this.loading = true;
    if (this.option == 'edit') {
      this.editProduct();
    } else {
      this.saveProduct();
    }
  }

  public saveProduct(): void {
    console.log(this.formGroup.value);

    if (this.formGroup.valid && this.files.length) {
      const formData: FormData = new FormData();

      this.loading = true;

      formData.append('name', this.formGroup.controls['name'].value);
      formData.append(
        'code_dealer',
        this.formGroup.controls['code_dealer'].value
      );
      formData.append('price', this.formGroup.controls['price'].value);
      formData.append('category', this.formGroup.controls['category'].value);

      formData.append(
        'sub_category',
        this.formGroup.controls['sub_category'].value ?? ''
      );

      formData.append(
        'atributes',
        JSON.stringify(this.formGroup.controls['atributes'].value)
      );
      formData.append(
        'outstanding',
        this.formGroup.controls['outstanding'].value
      );
      formData.append('img', this.files[0]);

      formData.append(
        'differential',
        this.formGroup.controls['differential'].value
      );

      formData.append(
        'earnings_percent',
        this.formGroup.controls['earnings_percent'].value
      );

      formData.append(
        'code_dealer',
        this.formGroup.controls['code_dealer'].value
      );

      formData.append(
        'discount_usd',
        this.formGroup.controls['discount_usd'].value
          ? this.formGroup.controls['discount_usd'].value / 100
          : this.formGroup.controls['discount_usd'].value
      );

      this.productsService.createProduct(formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'success',
            summary: 'Guardado exitoso',
            detail: 'Producto creado con éxito',
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

  public editProduct() {
    if (this.formGroup.valid) {
      const formData: FormData = new FormData();

      formData.append('name', this.formGroup.controls['name'].value);
      formData.append('price', this.formGroup.controls['price'].value);
      formData.append('category', this.formGroup.controls['category'].value);

      formData.append(
        'sub_category',
        this.formGroup.controls['sub_category'].value ?? ''
      );

      formData.append(
        'outstanding',
        this.formGroup.controls['outstanding'].value
      );
      formData.append(
        'atributes',
        JSON.stringify(this.formGroup.controls['atributes'].value)
      );

      if (this.files.length) {
        formData.append('img', this.files[0]);
        formData.append('oldImg', this.product.url_image);
      }

      formData.append(
        'differential',
        this.formGroup.controls['differential'].value
      );

      formData.append(
        'earnings_percent',
        this.formGroup.controls['earnings_percent'].value
      );

      formData.append(
        'code_dealer',
        this.formGroup.controls['code_dealer'].value
      );

      formData.append(
        'discount_usd',
        this.formGroup.controls['discount_usd'].value
          ? this.formGroup.controls['discount_usd'].value / 100
          : this.formGroup.controls['discount_usd'].value
      );

      this.productsService.updateProduct(formData, this.product.id).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.setMessage({
            severity: 'success',
            summary: 'Editado exitoso',
            detail: 'Producto editado con éxito',
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
    this.onChangeCategory(this.product.category);
    this.formGroup.patchValue({
      name: this.product.name,
      price: this.product.price,
      category: this.product.category,
      outstanding: this.product.outstanding,
      atributes: JSON.parse(this.product.atributes),
      sub_category: this.product.sub_category,
      differential: this.product.differential,
      earnings_percent: this.product.earnings_percent,
      discount_usd: (this.product.discount_usd ?? 0) * 100,
      code_dealer: this.product.code_dealer ?? 0,
    });
  }

  public onSelectFile(event: FileSelectEvent): void {
    this.files = event.currentFiles;
  }

  public onChangeCategory(value: string): void {
    if (value == 'vehicle') {
      this.subCategoryOptions = this.vehiclesSubCategories;
    } else if (value == 'home') {
      this.subCategoryOptions = this.homeSubCategories;
    } else {
      this.subCategoryOptions = [];
    }
  }
}
