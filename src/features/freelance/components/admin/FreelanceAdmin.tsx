"use client";

import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { PageHeader } from "@/features/admin/components/PageHeader";
import type {
  FreelanceOfferAdminRow,
  FreelanceServiceAdminRow,
  FreelanceSettingsFormData,
} from "@/features/freelance/interfaces/freelance";
import { FreelanceOffersPanel } from "./FreelanceOffersPanel";
import { FreelanceServicesPanel } from "./FreelanceServicesPanel";
import { FreelanceSettingsForm } from "./FreelanceSettingsForm";

const TABS = ["page", "services", "offers"] as const;

type FreelanceAdminProps = {
  settings: FreelanceSettingsFormData;
  services: FreelanceServiceAdminRow[];
  offers: FreelanceOfferAdminRow[];
};

export const FreelanceAdmin = ({ settings, services, offers }: FreelanceAdminProps) => {
  const [tab, setTab] = useQueryState("tab", parseAsStringLiteral(TABS).withDefault("page"));

  return (
    <>
      <PageHeader
        title="Freelance page"
        description="The one-page site for clients at /freelance. Projects and testimonials appear when “Show on /freelance” is on in their own editors."
        actions={
          <Button asChild variant="outline">
            <Link href="/freelance" target="_blank">
              <ExternalLink />
              View page
            </Link>
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={(value) => void setTab(value as (typeof TABS)[number])}>
        <TabsList>
          <TabsTrigger value="page">Page</TabsTrigger>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="offers">Ways to begin ({offers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="page" className="mt-4">
          <FreelanceSettingsForm settings={settings} />
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <FreelanceServicesPanel items={services} />
        </TabsContent>
        <TabsContent value="offers" className="mt-4">
          <FreelanceOffersPanel items={offers} />
        </TabsContent>
      </Tabs>
    </>
  );
};
