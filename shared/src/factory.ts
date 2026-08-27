import { z } from 'zod';

/** Factory — a physical plant/site (spec madde 9). */
export interface Factory {
  id: string;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// Input schema shared by create/update. IDs & timestamps are server-generated.
export const factoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Fabrika adi zorunludur').max(200),
  code: z.string().trim().min(1, 'Kod zorunludur').max(30),
  description: z.string().trim().max(1000).nullish().transform((v) => v ?? null),
});

export type FactoryInput = z.infer<typeof factoryInputSchema>;
