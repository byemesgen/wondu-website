export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small label above the name, e.g. "Executive Producer"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'nameLineOne',
      title: 'Name — Line 1',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'nameLineTwo',
      title: 'Name — Line 2',
      type: 'string',
      validation: (R: any) => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Short intro shown below the name on the left side',
      validation: (R: any) => R.required(),
    },
    {
      name: 'availableForWork',
      title: 'Available for Work',
      type: 'boolean',
      description: 'Controls whether the green pulsing dot appears on the availability pill',
      initialValue: false,
    },
    {
      name: 'pills',
      title: 'Info Pills (right column)',
      type: 'array',
      description: 'Small label chips shown to the right of the description',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'text',
            title: 'Text',
            type: 'string',
            validation: (R: any) => R.required(),
          },
          {
            name: 'isAvailabilityPill',
            title: 'Is Availability Pill?',
            type: 'boolean',
            description: 'If true, renders with the green pulsing dot and available styling',
            initialValue: false,
          },
        ],
        preview: { select: { title: 'text' } },
      }],
    },
  ],
}
