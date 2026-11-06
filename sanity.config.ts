import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './sanity/schemas';
import { presentationResolve } from './sanity/presentation/resolve';
import { getPublicSiteOrigin } from './lib/site-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const previewUrl = getPublicSiteOrigin();

export default defineConfig({
  name: 'persona-institute',
  title: 'Persona Institute CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    presentationTool({
      title: 'Visual Website Editor',
      previewUrl: {
        initial: previewUrl,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      allowOrigins: [
        'http://localhost:3000',
        previewUrl,
      ],
      resolve: presentationResolve,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
