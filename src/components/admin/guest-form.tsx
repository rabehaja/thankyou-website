"use client";

import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import type { Guest } from "@/lib/database.types";
import type { GuestFormState } from "@/lib/actions/guests";

const initialState: GuestFormState = { error: null };

/** Chip editor posting its values as a JSON-encoded hidden input. */
function ChipListField({
  label,
  name,
  helper,
  placeholder,
  values,
  onChange,
  maxItems,
}: {
  label: string;
  name: string;
  helper: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  maxItems: number;
}) {
  const [draft, setDraft] = useState("");
  const inputId = `${name}-draft`;

  const add = () => {
    const value = draft.trim();
    if (!value || values.includes(value) || values.length >= maxItems) return;
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <Field label={label} htmlFor={inputId} helper={helper}>
      <input type="hidden" name={name} value={JSON.stringify(values)} />
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button variant="secondary" size="md" onClick={add}>
          Add
        </Button>
      </div>
      {values.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {values.map((value) => (
            <Tag
              key={value}
              onRemove={() => onChange(values.filter((v) => v !== value))}
            >
              {value}
            </Tag>
          ))}
        </div>
      ) : null}
    </Field>
  );
}

export function GuestForm({
  guest,
  action,
  submitLabel,
}: {
  guest?: Guest;
  action: (prev: GuestFormState, formData: FormData) => Promise<GuestFormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [tags, setTags] = useState<string[]>(guest?.tags ?? []);
  const [companions, setCompanions] = useState<string[]>(guest?.companions ?? []);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <Field label="Guest Name" htmlFor="full_name">
        <Input
          id="full_name"
          name="full_name"
          defaultValue={guest?.full_name}
          placeholder="Enter guest name..."
          required
        />
      </Field>

      <Field
        label="Email"
        htmlFor="email"
        helper="Only used by you — never shown on the public pages."
      >
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={guest?.email ?? ""}
          placeholder="guest@example.com"
        />
      </Field>

      <ChipListField
        label="Additional Guests"
        name="companions"
        helper="Partners, kids, or +1s — they'll be greeted in the letter too."
        placeholder="Add a companion's name..."
        values={companions}
        onChange={setCompanions}
        maxItems={10}
      />

      <ChipListField
        label="Tags"
        name="tags"
        helper="Group guests — e.g. Bridal Shower, Groom's Family."
        placeholder="Add a tag..."
        values={tags}
        onChange={setTags}
        maxItems={12}
      />

      <Field label="Status" htmlFor="status">
        <Select id="status" name="status" defaultValue={guest?.status ?? "active"}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </Select>
      </Field>

      <div className="mt-2 flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
