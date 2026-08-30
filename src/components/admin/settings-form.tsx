"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { updateSettings, type SettingsFormState } from "@/lib/actions/settings";
import type { Settings } from "@/lib/database.types";

const initialState: SettingsFormState = { error: null, saved: false };

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}
      {state.saved ? (
        <Alert variant="success">Settings saved — the public pages are updated.</Alert>
      ) : null}

      <Field label="Couple Names" htmlFor="couple_names">
        <Input
          id="couple_names"
          name="couple_names"
          defaultValue={settings.couple_names}
          placeholder="Julian & Charlotte"
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Wedding Date" htmlFor="wedding_date">
          <Input
            id="wedding_date"
            name="wedding_date"
            type="date"
            defaultValue={settings.wedding_date ?? ""}
          />
        </Field>
        <Field label="Venue" htmlFor="venue">
          <Input
            id="venue"
            name="venue"
            defaultValue={settings.venue ?? ""}
            placeholder="The Glasshouse at Botanic Gardens • Seattle, WA"
          />
        </Field>
      </div>

      <Field
        label="Thank You Message"
        htmlFor="thank_you_message"
        helper="Shown on the main landing page for every visitor."
      >
        <Textarea
          id="thank_you_message"
          name="thank_you_message"
          rows={5}
          defaultValue={settings.thank_you_message ?? ""}
          placeholder="We are forever grateful for your presence…"
        />
      </Field>

      <Field
        label="Gallery Link"
        htmlFor="gallery_url"
        helper="External photo gallery (e.g. a Google Drive folder). Used by the 'View Gallery' buttons; leave empty to use the built-in gallery page."
      >
        <Input
          id="gallery_url"
          name="gallery_url"
          type="url"
          defaultValue={settings.gallery_url ?? ""}
          placeholder="https://drive.google.com/…"
        />
      </Field>

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Design"}
        </Button>
      </div>
    </form>
  );
}
