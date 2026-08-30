import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormCard } from "@/components/ui/card";
import { GuestForm } from "@/components/admin/guest-form";
import { updateGuest } from "@/lib/actions/guests";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Edit Guest" };

export default async function EditGuestPage({
  params,
}: PageProps<"/admin/guests/[id]/edit">) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: guest } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!guest) notFound();

  const action = updateGuest.bind(null, guest.id);

  return (
    <div className="max-w-2xl">
      <FormCard heading="Edit Guest" description={guest.full_name}>
        <GuestForm guest={guest} action={action} submitLabel="Save Changes" />
      </FormCard>
    </div>
  );
}
