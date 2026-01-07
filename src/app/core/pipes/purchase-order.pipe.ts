import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "purchaseOrder",
  standalone: true,
})
export class PurchaseOrderPipe implements PipeTransform {
  transform(data: { fechaISO: string; order: number }): string {
    const _date = data.fechaISO.replace("Z", "");
    const date = new Date(_date);
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${formattedDate.replaceAll("/", "")}-${data.order}`;
  }
}
