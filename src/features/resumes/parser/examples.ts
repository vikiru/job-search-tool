export const resumeParserExamples = {
  compact: `John Doe\n||linkedin.com/in/john-doe-4827|github.com/jdoe-labs\nEducation\nNorthbridge InstituteHalifax, NS\nBachelor of Arts, Environmental Studies09/2021 – 04/2025\nTechnical Skills\nLanguages: Ruby, SQL\nProjects\nHarbor Atlas|Ruby, Rails, PostgreSQL03/2024 – 08/2024\n• Created a coastal trail directory for local volunteers.`,
  inlineHeading: `John Doe\nSkills: Languages: Ruby, SQL\nCertificates\nUrban Sketching BasicsCoursera02/2025 – 03/2025`,
  unknownSection: `John Doe\nCommunity Work\nOrganized weekly neighborhood repair workshops.\nProjects\nCedar Signal|Ruby\n• Built the notification service.`,
} as const;
