import type { DocumentationConfig } from '@/types/Config';

export const documentationConfig: DocumentationConfig = {
  site: {
    title: 'Boilerplate Documentation',
    description:
      'Documentation for Boilerplate - A reusable project template designed for quick setup and customization.',
    projectDescription: 'A reusable project template designed for quick setup and customization.',
    siteUrl: 'https://github.com/username/boilerplate',
    base: '/boilerplate',
    documentationUrl: 'https://github.com/username/boilerplate',
    websiteLastModified: new Date(),
  },
  author: {
    name: 'Visakan Kirubakaran',
    alternateName: 'Vis Kirubakaran',
    firstName: 'Visakan',
    lastName: 'Kirubakaran',
    jobTitle: 'Software Developer',
    portfolioWebsite: 'https://vikiru.vercel.app',
    githubProfile: 'https://github.com/vikiru',
    linkedinProfile: 'https://linkedin.com/in/viskirubakaran',
    universityName: 'Carleton University',
    universityLogo: 'https://carleton.ca/favicon.ico',
    universityUrl: 'https://carleton.ca/',
  },
  project: {
    name: 'Boilerplate',
    githubRepo: 'https://github.com/username/boilerplate',
    liveDemoUrl: 'https://boilerplate-demo.vercel.app',
    version: '1.0.0',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    programmingLanguage: 'TypeScript',
    keywords: ['boilerplate', 'template', 'starter', 'reusable', 'project', 'setup', 'customization'],
    license: 'https://opensource.org/licenses/MIT',
  },
  assets: {
    themeColor: '#000',
    logoFileName: 'logo.png',
    faviconFileName: 'favicon.ico',
  },
};
