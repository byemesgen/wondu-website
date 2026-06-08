import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

const singletonTypes = new Set(['siteSettings', 'hero', 'marquee', 'about', 'contact'])

export default defineConfig({
  name: 'default',
  title: 'Wondu Dikran Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('🌐 Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings'),
              ),
            S.divider(),
            S.listItem()
              .title('✦ Hero')
              .id('hero')
              .child(
                S.document()
                  .schemaType('hero')
                  .documentId('hero')
                  .title('Hero Section'),
              ),
            S.listItem()
              .title('↔ Marquee Ticker')
              .id('marquee')
              .child(
                S.document()
                  .schemaType('marquee')
                  .documentId('marquee')
                  .title('Marquee Ticker'),
              ),
            S.divider(),
            S.documentTypeListItem('workProject').title('▶ Work Projects'),
            S.divider(),
            S.listItem()
              .title('◉ About')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
                  .title('About Section'),
              ),
            S.listItem()
              .title('✉ Contact')
              .id('contact')
              .child(
                S.document()
                  .schemaType('contact')
                  .documentId('contact')
                  .title('Contact Section'),
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    // Prevent creating more than one of each singleton
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
})
