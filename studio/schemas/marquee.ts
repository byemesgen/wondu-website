export default {
  name: 'marquee',
  title: 'Marquee Ticker',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'items',
      title: 'Ticker Items',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'The build script automatically duplicates this list for seamless looping. Add or remove items freely.',
      validation: (R: any) => R.required().min(1),
    },
  ],
}
