import { z } from 'zod';

export interface Person {
    id: string;
    name: string;
    email: string;
    phone: string;

    createdAt: string;
    updatedAt: string;
    deletedAt: string;


}
export const personInputSchema = z.object({
    name: z.string().trim().min(1, 'ad zorunludur').max(200),
    email: z.string().trim().email('gecersizdir').max(100).nullish().transform((v) => v ?? null),
    phone: z.string().trim().max(30).nullish().transform((v) => v ?? null),
    });

export type PersonInput = z.infer<typeof personInputSchema>;

