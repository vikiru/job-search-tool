import { Link } from '@tanstack/react-router';

function Logo() {
  return (
    <Link
      to="/"
      aria-label="JobApp home"
      className="font-heading text-xl leading-none font-semibold tracking-tight text-foreground transition-opacity motion-reduce:transition-none hover:opacity-80 sm:text-2xl"
    >
      JobApp
    </Link>
  );
}

export { Logo };
