import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

type StatCardProps = {
  label: string;
  value: number | string;
  href: string;
  icon: LucideIcon;
  hint?: string;
};

export const StatCard = ({ label, value, href, icon: Icon, hint }: StatCardProps) => {
  return (
    <Link href={href} className="group">
      <Card className="group-hover:ring-card-edge-hover">
        <CardContent className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <Icon className="size-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
};
