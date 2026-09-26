import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireAdmin } from "@/shared/libs/authGuard";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { getSettingsForEdit } from "@/features/settings/queries/settingsQueries";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="Settings"
        description="Site-wide details: profile, hero text, SEO, contact and social links."
        actions={
          <Button asChild variant="outline">
            <a href="/api/admin/export" download>
              <Download />
              Download backup
            </a>
          </Button>
        }
      />
      <SettingsForm settings={await getSettingsForEdit()} />
    </>
  );
}
