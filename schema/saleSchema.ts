import { z } from "zod";

export const saleFormSchema = z.object({
  product: z.string(),
  productSearch: z.string(),
  newProductName: z.string(),
  customer: z.string(),
  customerSearch: z.string(),
  newCustomerName: z.string(),
  commissionRate: z.number().min(0, "Comissão inválida"),
  salesValue: z.string().refine(val => !isNaN(Number(val)), "Valor inválido"),
  expirationInstallmentDate: z.string().min(0, "Data de pagamento inválida"),
});
export type SaleFormType = z.infer<typeof saleFormSchema>;


export const saleSchema = z.object({
  customerID: z.string().min(1),
  productID: z.string().min(1),
  salesValue: z.number().min(1),
  expirationInstallmentDate: z.string().min(1),
  commissionRate: z.number().min(0),
  dtTimestamp: z.string().optional(),
});

export type SaleRequest = z.infer<typeof saleSchema>;


export const modalProductSchema = z.object({
  product: z.string().optional(),
})
export type modalProductType = z.infer<typeof modalProductSchema>;


export const modalCustomerSchema = z.object({
  name: z.string().optional(),
})
export type modalCustomerType = z.infer<typeof modalCustomerSchema>;