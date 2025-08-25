import { z } from "zod";

export const topProductSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  totalQuantity: z.number(),
  totalSales: z.number(),
});

export type TopProduct = z.infer<typeof topProductSchema>;

export const IndexStateSchema = z.object({
  salesValue: z.number(),
  commissionValue: z.number(),
  commissionValueDyn: z.number(),
  salesQty: z.number(),
  currentMonth: z.string(),
  monthIndex: z.number(),
  currentMonthReceipment: z.string(),
  salesData: z.array(topProductSchema),
});

export type IndexState = z.infer<typeof IndexStateSchema>;
