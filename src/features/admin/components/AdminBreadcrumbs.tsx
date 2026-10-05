"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { ADMIN_NAV } from "../constants/adminNav";

type Crumb = { label: string; href: string };

// Labels for fixed segments; anything else under a section is a record id.
const SEGMENT_LABELS: Record<string, string> = {
  new: "New",
};

const EDIT_LABELS: Record<string, string> = {
  projects: "Edit project",
  experience: "Edit experience",
};

/** "/admin/projects/abc123" → Dashboard › Projects › Edit project */
export function toCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean); // ["admin", "projects", "abc123"]
  if (segments[0] !== "admin") return [];

  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/admin" }];
  let href = "/admin";
  const section = segments[1];

  segments.slice(1).forEach((segment, index) => {
    href += `/${segment}`;
    const label =
      index === 0
        ? (ADMIN_NAV.find((item) => item.href === href)?.title ?? segment)
        : (SEGMENT_LABELS[segment] ?? EDIT_LABELS[section] ?? "Edit");
    crumbs.push({ label, href });
  });

  return crumbs;
}

export const AdminBreadcrumbs = () => {
  const crumbs = toCrumbs(usePathname());
  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
