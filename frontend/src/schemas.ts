import { z } from "zod";

export const imageSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const imagesSchema = z.array(imageSchema);
