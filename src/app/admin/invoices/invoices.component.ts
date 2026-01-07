import { CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { DateFormatPipe } from "../../core/pipes/date-format.pipe";
import { Invoice } from "../../core/models/invoice";
import { QueryPagination } from "../../core/models/queryPagination";
import { InvoicesService } from "../../core/services/invoices.service";
import { PurchaseOrderPipe } from "../../core/pipes/purchase-order.pipe";

@Component({
  selector: "app-invoices",
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
    DateFormatPipe,
    CurrencyPipe,
    PurchaseOrderPipe,
  ],
  templateUrl: "./invoices.component.html",
  styleUrl: "./invoices.component.scss",
})
export class InvoicesComponent {
  public invoices: Invoice[] = [];
  public totalRows: number = 0;
  public modelSearch: string = "";
  public isLoading: boolean = false;

  public queryPagination: QueryPagination = {
    page: 1,
    pageSize: 10,
    search: "",
  };

  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly purchaseOrderPipe: PurchaseOrderPipe
  ) {
    this.getInvoicesList(this.queryPagination);
  }

  public getInvoicesList(query: QueryPagination): void {
    this.isLoading = true;
    this.invoicesService.getInvoices(query).subscribe({
      next: (res) => {
        this.invoices = res.items;
        this.totalRows = res.totalItems;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  public search(): void {
    this.queryPagination.search = this.modelSearch;
    this.queryPagination.page = 1;
    this.getInvoicesList(this.queryPagination);
  }

  public onPageChange(event: any): void {
    this.queryPagination.page = event.page + 1;
    this.getInvoicesList(this.queryPagination);
  }

  public download(invoice: Invoice): void {
    const fileName = this.purchaseOrderPipe.transform({
      fechaISO: invoice.createdAt,
      order: invoice.purchaseOrder || 0,
    }) + ".pdf";
    this.invoicesService
      .downloadInvoicePdf(invoice.urlInvoice)
      .subscribe((res) => {
        if (res) {
          this.downloadFile(res, fileName || "invoice.pdf");
        }
      });
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
