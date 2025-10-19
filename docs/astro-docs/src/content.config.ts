import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
	// Load Markdown files from src/content directory
	loader: glob({ base: './src/content', pattern: '*.md' }),
	schema: z.object({}).passthrough(),
});

export const collections = { docs };
