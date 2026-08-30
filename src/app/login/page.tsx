"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LeafIcon } from "@/components/ui/icons";
import { signIn, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-bg px-4">
      <div className="w-full max-w-sm rounded-frame bg-white p-10 shadow-letter">
        <div className="text-center">
          <LeafIcon size={26} className="mx-auto text-sage" />
          <h1 className="mt-3 text-h1 text-[36px] text-terracotta">Ever After</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[3px] text-muted">
            Backoffice Sign In
          </p>
        </div>
        <form action={formAction} className="mt-8 flex flex-col gap-5">
          {state.error ? <Alert variant="error">{state.error}</Alert> : null}
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              invalid={Boolean(state.error)}
            />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}
