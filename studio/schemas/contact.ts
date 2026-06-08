export default {
  name: 'contact',
  title: 'Contact Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Small uppercase label above the headline, e.g. "Get in touch"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'headlineLineOne',
      title: 'Headline — Line 1',
      type: 'string',
      description: 'e.g. "Say hi!"',
      validation: (R: any) => R.required(),
    },
    {
      name: 'headlineLineTwo',
      title: 'Headline — Line 2 (email link text)',
      type: 'string',
      description: 'This line renders as a clickable mailto link. The email address comes from Site Settings.',
      validation: (R: any) => R.required(),
    },
  ],
}
