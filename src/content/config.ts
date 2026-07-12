import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    pubDate:     z.date(),
    description: z.string(),
    author:      z.string().default('Kixlogic Team'),
    tags:        z.array(z.string()).default([]),
    image:       z.string().optional(),
  }),
});

export const collections = { blog };
