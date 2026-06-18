export default {
  name: 'about',
  title: 'About Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'headshot',
      title: 'Headshot Photo',
      type: 'image',
      description: 'Portrait photo shown above the bio. Accepts JPG, PNG, or GIF.',
      options: { hotspot: true },
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      description: 'Rich text bio. Use Bold for highlighted phrases, Italic for film/show titles.',
      of: [{
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        marks: {
          decorators: [
            { title: 'Bold',   value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [],
        },
      }],
      validation: (R: any) => R.required(),
    },
    {
      name: 'cv',
      title: 'CV / Resume (PDF)',
      type: 'file',
      description: 'Upload your CV as a PDF. Linked from the "View CV" button below the bio.',
      options: { accept: 'application/pdf' },
    },
    {
      name: 'imdbUrl',
      title: 'IMDB Profile URL',
      type: 'url',
      description: 'Linked from the "View full profile on IMDB" button',
    },
    {
      name: 'imdbCredits',
      title: 'IMDB Credits',
      type: 'array',
      description: 'List newest to oldest',
      of: [{
        type: 'object',
        fields: [
          { name: 'projectTitle', title: 'Project Title', type: 'string', validation: (R: any) => R.required() },
          { name: 'role',         title: 'Role',          type: 'string', validation: (R: any) => R.required() },
          { name: 'year',         title: 'Year',          type: 'string', validation: (R: any) => R.required() },
        ],
        preview: { select: { title: 'projectTitle', subtitle: 'role' } },
      }],
    },
    {
      name: 'awards',
      title: 'Awards & Recognition',
      type: 'array',
      description: 'List newest to oldest',
      of: [{
        type: 'object',
        fields: [
          { name: 'awardTitle', title: 'Award Title', type: 'string', validation: (R: any) => R.required() },
          { name: 'issuer',     title: 'Issuer',      type: 'string', validation: (R: any) => R.required() },
          { name: 'year',       title: 'Year',        type: 'string', validation: (R: any) => R.required() },
        ],
        preview: { select: { title: 'awardTitle', subtitle: 'issuer' } },
      }],
    },
    {
      name: 'press',
      title: 'Press Coverage',
      type: 'array',
      description: 'List newest to oldest',
      of: [{
        type: 'object',
        fields: [
          { name: 'headline',    title: 'Headline',    type: 'string', validation: (R: any) => R.required() },
          { name: 'publication', title: 'Publication', type: 'string', validation: (R: any) => R.required() },
          { name: 'url',         title: 'Article URL', type: 'url' },
          { name: 'year',        title: 'Year',        type: 'string', validation: (R: any) => R.required() },
        ],
        preview: { select: { title: 'headline', subtitle: 'publication' } },
      }],
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      description: 'Pill tags shown in the skills row',
      of: [{ type: 'string' }],
      validation: (R: any) => R.required().min(1),
    },
  ],
}
