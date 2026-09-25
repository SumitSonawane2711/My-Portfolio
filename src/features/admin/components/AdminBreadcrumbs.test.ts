import { describe, expect, it } from "vitest";
import { toCrumbs } from "./AdminBreadcrumbs";

const labels = (path: string) => toCrumbs(path).map((c) => c.label);

describe("admin breadcrumbs", () => {
  it("starts at the dashboard", () => {
    expect(toCrumbs("/admin")).toEqual([{ label: "Dashboard", href: "/admin" }]);
  });

  it("names sections after the sidebar", () => {
    expect(labels("/admin/resumes")).toEqual(["Dashboard", "Resumes"]);
    expect(labels("/admin/inbox")).toEqual(["Dashboard", "Inbox"]);
  });

  it("labels new and edit pages", () => {
    expect(labels("/admin/projects/new")).toEqual(["Dashboard", "Projects", "New"]);
    expect(labels("/admin/projects/cmabc123")).toEqual(["Dashboard", "Projects", "Edit project"]);
  });

  it("handles nested pages with links to each level", () => {
    expect(toCrumbs("/admin/blog/cmabc123/preview")).toEqual([
      { label: "Dashboard", href: "/admin" },
      { label: "Blog", href: "/admin/blog" },
      { label: "Edit post", href: "/admin/blog/cmabc123" },
      { label: "Preview", href: "/admin/blog/cmabc123/preview" },
    ]);
  });

  it("ignores non-admin paths", () => {
    expect(toCrumbs("/blog")).toEqual([]);
  });
});
