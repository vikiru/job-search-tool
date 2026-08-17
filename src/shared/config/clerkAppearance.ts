const authElements = {
  card: 'w-full rounded-xl bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8',
  headerTitle: 'font-heading text-h2 font-semibold tracking-tight',
  headerSubtitle: 'mt-2 text-small leading-relaxed text-muted-foreground',
  formFieldLabel: 'font-heading text-small font-medium',
  formFieldInput: 'h-11 rounded-lg text-base',
  formButtonPrimary: 'h-11 font-heading font-medium',
  footerActionLink: 'font-heading font-medium',
  socialButtonsBlockButton: 'h-11 font-heading font-medium',
};

const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--primary)',
    colorPrimaryForeground: 'var(--primary-foreground)',
    colorForeground: 'var(--foreground)',
    colorMutedForeground: 'var(--muted-foreground)',
    colorBackground: 'var(--card)',
    colorInput: 'var(--background)',
    colorInputForeground: 'var(--foreground)',
    colorBorder: 'var(--border)',
    colorRing: 'var(--ring)',
    colorDanger: 'var(--destructive)',
    colorNeutral: 'var(--muted-foreground)',
    fontFamily: 'var(--font-body)',
    fontFamilyButtons: 'var(--font-heading)',
    fontFamilyMono: 'var(--font-mono)',
    borderRadius: 'var(--radius)',
    spacing: '1rem',
  },
  signIn: {
    elements: authElements,
  },
  signUp: {
    elements: authElements,
  },
} as const;

export { clerkAppearance };
