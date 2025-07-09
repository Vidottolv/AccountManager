import { z } from "zod";

export const saleFormSchema = z.object({
  product: z.string().optional(),
  productSearch: z.string(),
  newProductName: z.string(),
  customer: z.string().optional(),
  customerSearch: z.string(),
  commission: z.number().min(0, "Comissão inválida"),
  qty: z.string().refine(val => !isNaN(Number(val)), "Quantidade inválida")
});

export type SaleFormType = z.infer<typeof saleFormSchema>;