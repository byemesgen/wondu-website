export default {
  name: 'workProject',
  title: 'Work Project',
  type: 'document',
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  fields: [
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the position on the page (1 = first). Lower numbers appear first.',
      validation: (R: any) => R.required().integer().positive(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Use <br> for line breaks shown on the card, e.g. "Holiday Touchdown:<br>A Bills Love Story"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'company',
      title: 'Company / Network',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'year',
      title: 'Year or Year Range',
      type: 'string',
      description: 'e.g. "2023" or "2012–2016"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'videoPlatform',
      title: 'Video Platform',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'YouTube',           value: 'youtube' },
          { title: 'YouTube Playlist',  value: 'youtube-playlist' },
          { title: 'Vimeo',             value: 'vimeo' },
          { title: 'Vimeo (with hash)', value: 'vimeo-hash' },
        ],
      },
      validation: (R: any) => R.required(),
    },
    {
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'YouTube: video ID (e.g. j2uXqK-PDZw) or playlist ID. Vimeo: numeric ID. Vimeo-hash: "videoId/hashString" (e.g. 1038816127/095df590ea).',
      validation: (R: any) => R.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Role/discipline labels shown on hover, e.g. "Production", "Co-Creator"',
      validation: (R: any) => R.required().min(1).max(5),
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Card background image. Accepts JPG, PNG, or GIF. Recommended: 16:10 ratio.',
      options: { hotspot: true },
      validation: (R: any) => R.required(),
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'company', order: 'order' },
    prepare: ({ title, subtitle, order }: any) => ({
      title: `${String(order).padStart(2, '0')}. ${title}`,
      subtitle,
    }),
  },
}
