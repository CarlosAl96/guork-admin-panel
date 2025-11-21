import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product';
import { QueryPagination } from '../../core/models/queryPagination';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewProductComponent } from './new-product/new-product.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropOption } from '../../core/models/dropOption';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';
import { SetCategoryValuesComponent } from './set-category-values/set-category-values.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FormsModule,
    PaginatorModule,
    TooltipModule,
    CardModule,
    InputTextModule,
    InputGroupModule,
    DropdownModule,
    ConfirmDialogModule,
    DateFormatPipe,
    InputSwitchModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  public products: Product[] = [];
  public dialogRef!: DynamicDialogRef;
  public totalRows: number = 0;
  public initPage: boolean = true;
  public modelSearch: string = '';
  public modelCategory: string = '';
  public user!: User | undefined;

  public categories: DropOption[] = [
    { name: 'Todos', code: '' },
    { name: 'Motos', code: 'vehicle' },
    { name: 'Hogar', code: 'home' },
    { name: 'Tecnología', code: 'technology' },
    { name: 'Aire', code: 'air' },
  ];

  public queryPagination: QueryPagination = {
    page: 1,
    size: 50,
    search: '',
    code_dealer: 0,
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly dialogService: DialogService,
    private readonly messageService: ToastService,
    private readonly confirmationService: ConfirmationService,
    private readonly sessionService: SessionService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.queryPagination.code_dealer = this.user?.code_dealer ?? 0;
    this.getProductsList(this.queryPagination);
  }

  private getProductsList(query: QueryPagination): void {
    this.productsService.getProducts(query).subscribe((res) => {
      if (res) {
        this.products = res.response.data;
        this.totalRows = res.response.totalRows;
      }
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.category = this.modelCategory;
    this.queryPagination.page = 1;
    this.getProductsList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getProductsList(this.queryPagination);
  }

  public showCreateModal(product?: Product): void {
    const data: any = {
      product: product ? product : null,
      option: product ? 'clone' : 'create',
    };
    this.dialogRef = this.dialogService.open(NewProductComponent, {
      data: data,
      header: 'Crear nuevo producto',
      width: '70rem',
    });

    this.onCloseModal();
  }

  public showEditModal(product: Product): void {
    const data: any = {
      product: product,
      option: 'edit',
    };
    this.dialogRef = this.dialogService.open(NewProductComponent, {
      data: data,
      header: 'Editar producto',
      width: '70rem',
    });

    this.onCloseModal();
  }

  public showCategoryValuesModal(): void {
    this.dialogRef = this.dialogService.open(SetCategoryValuesComponent, {
      header: 'Ajustar diferencial por categoría',
      width: '70rem',
    });

    this.onCloseModal();
  }

  private onCloseModal(): void {
    this.dialogRef.onClose.subscribe(() => {
      this.queryPagination.page = 1;
      this.paginator.changePage(0);
      this.getProductsList(this.queryPagination);
    });
  }

  public deleteProduct(id: number, url_image: string): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar este producto de forma permanente?`,
      header: 'Eliminar producto',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.productsService.deleteProduct(id, url_image).subscribe({
          next: (res) => {
            this.queryPagination.page = 1;
            this.paginator.changePage(0);
            this.getProductsList(this.queryPagination);

            this.messageService.setMessage({
              severity: 'success',
              summary: 'Eliminado exitoso',
              detail: 'Producto eliminado con éxito',
            });
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail:
                'No puedes eliminar un producto que esté ligado a un contrato',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  public editStatusProduct(id: number, name: string, status: boolean): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de ${
        status ? 'pausar la venta de ' + name : 'reanudar la venta de ' + name
      }?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const formData: FormData = new FormData();

        formData.append('is_view', status ? 'false' : 'true');

        this.productsService.updateProduct(formData, id).subscribe({
          next: (res) => {
            this.getProductsList(this.queryPagination);
            this.messageService.setMessage({
              severity: 'success',
              summary: 'Editado exitoso',
              detail: 'Producto editado con éxito',
            });
          },
          error: (error) => {
            this.messageService.setMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'Ha ocurrido un error',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  public getCategoryName(category: string): string {
    return this.categories.filter((cat) => cat.code == category)[0].name;
  }
}
