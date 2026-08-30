"use client";

import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import type { Guest } from "@/lib/database.types";
import type { GuestFormState } from "@/lib/actions/guests";

const TABLE_OPTIONS = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4 (Bridal Party)",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
  "Table 9",
];

const initialState: GuestFormState = { error: null };

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
  const [tagDraft, setTagDraft] = useState("");

  const addTag = () => {
    const value = tagDraft.trim();
    if (!value || tags.includes(value) || tags.length >= 12) return;
    setTags((current) => [...current, value]);
    setTagDraft("");
  };

  const tableOptions = TABLE_OPTIONS.includes(guest?.table_assignment ?? "")
    ? TABLE_OPTIONS
    : guest?.table_assignment
      ? [guest.table_assignment, ...TABLE_OPTIONS]
      : TABLE_OPTIONS;

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

      <Field label="Table Assignment" htmlFor="table_assignment">
        <Select
          id="table_assignment"
          name="table_assignment"
          defaultValue={guest?.table_assignment ?? ""}
        >
          <option value="">No table assigned</option>
          {tableOptions.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Tags"
        htmlFor="tag-draft"
        helper="Group guests — e.g. Bridal Shower, Groom's Family."
      >
        <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        <div className="flex gap-2">
          <Input
            id="tag-draft"
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
          />
          <Button variant="secondary" size="md" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag
                key={tag}
                onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
              >
                {tag}
              </Tag>
            ))}
          </div>
        ) : null}
      </Field>

      <Field label="Status" htmlFor="status">
        <Select id="status" name="status" defaultValue={guest?.status ?? "active"}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </Select>
      </Field>

      <Toggle
        name="rsvp_received"
        defaultChecked={guest?.rsvp_received ?? false}
        label="RSVP received"
      />

      <div className="mt-2 flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
