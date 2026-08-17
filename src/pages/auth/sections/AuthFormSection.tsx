import { Outlet } from '@tanstack/react-router';

export function AuthFormSection() {
  return (
    <section className="flex w-full justify-center">
      <Outlet />
    </section>
  );
}
