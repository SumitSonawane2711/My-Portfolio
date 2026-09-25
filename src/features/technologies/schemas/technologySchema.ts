import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(40),
  icon: z
    .string()
    .regex(/^(tabler|logos|devicon):[a-z0-9-]+$/, "Pick an icon from the list")
    .nullable()
    .or(z.literal("").transform(() => null)),
  customIconId: z.string().nullable(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #61DAFB")
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export type TechnologyInput = z.input<typeof technologySchema>;
