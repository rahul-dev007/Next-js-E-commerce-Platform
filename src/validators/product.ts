import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  description: z.string().optional(),
  category: z.string(),
});
