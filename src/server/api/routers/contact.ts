import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const contactInputSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre completo")
    .max(120, "El nombre es demasiado largo"),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(200),
  telefono: z
    .string()
    .trim()
    .min(6, "Ingresa un número de teléfono válido")
    .max(40),
  tratamiento: z
    .string()
    .trim()
    .min(1, "Selecciona un tratamiento de interés")
    .max(80),
  mensaje: z
    .string()
    .trim()
    .min(5, "Cuéntanos un poco más")
    .max(2000, "El mensaje es demasiado largo"),
  sede: z.string().trim().max(80).optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export const contactRouter = createTRPCRouter({
  createLead: publicProcedure
    .input(contactInputSchema)
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.db.lead.create({
        data: {
          nombre: input.nombre,
          email: input.email,
          telefono: input.telefono,
          tratamiento: input.tratamiento,
          mensaje: input.mensaje,
          sede: input.sede,
        },
        select: { id: true, createdAt: true },
      });

      return { ok: true as const, id: lead.id, createdAt: lead.createdAt };
    }),
});
