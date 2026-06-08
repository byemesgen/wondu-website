import 'dotenv/config'
import { createClient } from '@sanity/client'
import { toHTML } from '@portabletext/to-html'
import { renderTemplate } from './template.js'
import { writeFileSync, mkdirSync, cpSync, existsSync } from 'fs'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset:   process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     process.env.SANITY_TOKEN,
})

function imageUrlFor(asset) {
  if (!asset?._ref) return null
  const parts = asset._ref.split('-') // image-<id>-<dims>-<ext>
  const ext  = parts[parts.length - 1]
  const dims = parts[parts.length - 2]
  const id   = parts.slice(1, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET ?? 'production'}/${id}-${dims}.${ext}`
}

async function build() {
  console.log('📡 Fetching content from Sanity…')

  const [settings, hero, marquee, projects, about, contact] = await Promise.all([
    client.fetch(`*[_type == "siteSettings"][0]`),
    client.fetch(`*[_type == "hero"][0]`),
    client.fetch(`*[_type == "marquee"][0]`),
    client.fetch(`*[_type == "workProject"] | order(order asc)`),
    client.fetch(`*[_type == "about"][0]`),
    client.fetch(`*[_type == "contact"][0]`),
  ])

  if (!settings) throw new Error('No siteSettings document found in Sanity. Please create it.')
  if (!hero)     throw new Error('No hero document found in Sanity. Please create it.')
  if (!marquee)  throw new Error('No marquee document found in Sanity. Please create it.')
  if (!about)    throw new Error('No about document found in Sanity. Please create it.')
  if (!contact)  throw new Error('No contact document found in Sanity. Please create it.')

  // Render Portable Text bio to HTML
  const bioHtml = about.bio ? toHTML(about.bio, {
    components: {
      marks: {
        strong: ({ children }) => `<strong>${children}</strong>`,
        em:     ({ children }) => `<em>${children}</em>`,
      },
    },
  }) : ''

  const data = {
    settings,
    hero,
    marqueeItems: marquee.items ?? [],
    projects: (projects ?? []).map((p, i) => ({
      ...p,
      index:        i + 1,
      thumbnailUrl: p.thumbnail?.asset ? imageUrlFor(p.thumbnail.asset) : null,
    })),
    about: { ...about, bioHtml },
    contact,
  }

  console.log(`🔨 Building with ${data.projects.length} projects…`)
  const html = renderTemplate(data)

  mkdirSync('public', { recursive: true })
  writeFileSync('public/index.html', html, 'utf-8')

  // Copy static assets (images folder)
  if (existsSync('images')) {
    cpSync('images', 'public/images', { recursive: true })
  }

  console.log(`✅ Done → public/index.html`)
}

build().catch(err => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})
