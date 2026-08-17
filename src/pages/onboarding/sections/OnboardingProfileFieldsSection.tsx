import { Field, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

interface OnboardingProfileFieldsSectionProps {
  firstName: string;
  lastName: string;
  location: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  phoneNumber: string;
}

export function OnboardingProfileFieldsSection({
  firstName,
  lastName,
  location,
  onFirstNameChange,
  onLastNameChange,
  onLocationChange,
  onPhoneNumberChange,
  phoneNumber,
}: OnboardingProfileFieldsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <Input
            id="firstName"
            required
            autoComplete="given-name"
            className="h-11 text-base"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            placeholder="Jane"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <Input
            id="lastName"
            required
            autoComplete="family-name"
            className="h-11 text-base"
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            placeholder="Doe"
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="phoneNumber">
          Phone number <span className="font-body text-muted-foreground">(optional)</span>
        </FieldLabel>
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          className="h-11 text-base"
          value={phoneNumber}
          onChange={(event) => onPhoneNumberChange(event.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="location">
          Location <span className="font-body text-muted-foreground">(optional)</span>
        </FieldLabel>
        <Input
          id="location"
          autoComplete="address-level2"
          className="h-11 text-base"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="Toronto, ON, Canada"
        />
      </Field>
    </div>
  );
}
