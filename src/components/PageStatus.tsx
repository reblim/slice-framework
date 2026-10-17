import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function PageNotFound() {
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-20">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="mt-4 text-muted-foreground">Page not found.</p>
      <Button asChild className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </main>
  );
}

export function PageError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-20">
      <h1 className="text-xl font-semibold">This page didn’t load</h1>
      <div className="mt-6 flex gap-3">
        <Button
          onClick={async () => {
            await router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
