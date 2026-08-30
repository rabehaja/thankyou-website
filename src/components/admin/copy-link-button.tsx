"use client";

import { useToast } from "@/components/ui/toast";
import { CopyIcon } from "@/components/ui/icons";

export function CopyLinkButton({ url, label }: { url: string; label?: string }) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Guest card link copied to clipboard!");
    } catch {
      toast("Could not copy the link — copy it from the address bar instead.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-terracotta hover:underline"
    >
      <CopyIcon size={15} />
      {label ?? "Copy Link"}
    </button>
  );
}
