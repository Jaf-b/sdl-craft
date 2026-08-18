import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <span className="text-lg font-semibold tracking-tight">SDL Craft</span>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                Create account
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <section className="max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium text-primary">Welcome to SDL Craft</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build your next project with confidence.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your workspace is ready. Create an account or sign in to get started.
          </p>
        </section>
      </main>
    </div>
  );
}
