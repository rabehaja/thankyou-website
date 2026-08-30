import type { Metadata } from "next";
import { FormCard } from "@/components/ui/card";
import { GuestForm } from "@/components/admin/guest-form";
import { createGuest } from "@/lib/actions/guests";

export const metadata: Metadata = { title: "Add Guest" };

export default function NewGuestPage() {
  return (
    <div className="max-w-2xl">
      <FormCard
        heading="Add a Guest"
        description="New guests start on the list right away — you can generate their thank-you card afterwards."
      >
        <GuestForm action={createGuest} submitLabel="Save Guest" />
      </FormCard>
    </div>
  );
}
