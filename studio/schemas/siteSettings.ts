export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'branding',  title: 'Branding & Nav' },
    { name: 'meta',      title: 'SEO & Metadata' },
    { name: 'contact',   title: 'Contact & Footer' },
    { name: 'documents', title: 'PDFs & Files' },
  ],
  fields: [
    // ── Branding & Nav ───────────────────────────────────────────────────
    {
      name: 'navLogo',
      title: 'Nav Logo Text',
      type: 'string',
      group: 'branding',
      description: 'Short logomark in the top-left nav, e.g. "wndkrn"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'preloaderName',
      title: 'Preloader Name',
      type: 'string',
      group: 'branding',
      description: 'Full name shown in the loading animation, e.g. "Wondu Dikran"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'accentColor',
      title: 'Accent Color (hex)',
      type: 'string',
      group: 'branding',
      description: 'Used for the contact link underline and scroll indicator. Default: #FF3D00',
      initialValue: '#FF3D00',
    },

    // ── SEO & Metadata ───────────────────────────────────────────────────
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      group: 'meta',
      description: 'Used in <title> and OG tags, e.g. "Wondu Dikran — Executive Producer"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'meta',
      validation: (R: any) => R.required().max(160),
    },
    {
      name: 'ogImage',
      title: 'OG Share Image',
      type: 'image',
      group: 'meta',
      description: 'Recommended 1200×630px. Shown when sharing on social media.',
      options: { hotspot: true },
    },

    // ── Contact & Footer ─────────────────────────────────────────────────
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'contact',
      validation: (R: any) => R.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'contact',
      description: 'Shown in hero pills and contact footer, e.g. "Los Angeles, CA"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'copyrightText',
      title: 'Footer Copyright Text',
      type: 'string',
      group: 'contact',
      description: 'e.g. "© 2026 Wondu Dikran · Executive Producer"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'socialLinks',
      title: 'Social / Footer Links',
      type: 'array',
      group: 'contact',
      description: 'Rendered in the contact footer right column',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', validation: (R: any) => R.required() },
          { name: 'url',   type: 'url',    validation: (R: any) => R.required() },
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      }],
    },

    // ── PDFs & Files ─────────────────────────────────────────────────────
    {
      name: 'pdfUrl',
      title: 'Portfolio PDF URL',
      type: 'url',
      group: 'documents',
      description: 'Linked from the "Looking for more?" strip in the Work section',
    },
    {
      name: 'cvUrl',
      title: 'CV PDF URL',
      type: 'url',
      group: 'documents',
      description: 'Linked from the "View CV" button in the About section',
    },
  ],
}
