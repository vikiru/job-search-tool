export interface UserContactLink {
  href: string;
  label: string;
}

export interface UserContactData {
  email: string | null;
  links: UserContactLink[];
  phoneNumber: string | null;
}

export interface UserContactUpdate {
  email: string;
  links: UserContactLink[];
  phoneNumber: string;
}
