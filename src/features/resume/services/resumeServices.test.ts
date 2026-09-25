import { beforeEach, describe, expect, it, vi } from "vitest";

// In-memory stand-in for the resumes table, so the rules can be tested
// without a database.
type Row = {
  id: string;
  slug: string;
  status: string;
  isPrimary: boolean;
  fileId: string;
  order: number;
};
let rows: Row[] = [];

vi.mock("../repositories/resumeRepository", () => ({
  resumeRepository: {
    findById: async (id: string) => rows.find((r) => r.id === id) ?? null,
    slugExists: async (slug: string, exceptId?: string) =>
      rows.some((r) => r.slug === slug && r.id !== exceptId),
    maxOrder: async () => Math.max(-1, ...rows.map((r) => r.order)),
    hasPrimary: async () => rows.some((r) => r.isPrimary),
    create: async (data: Omit<Row, "id" | "isPrimary">) => {
      const row = { ...data, id: `r${rows.length + 1}`, isPrimary: false } as Row;
      rows.push(row);
      return row;
    },
    update: async (id: string, data: Partial<Row>) =>
      Object.assign(rows.find((r) => r.id === id)!, data),
    setPrimary: async (id: string) => {
      rows.forEach((r) => (r.isPrimary = r.id === id));
      Object.assign(rows.find((r) => r.id === id)!, { status: "ACTIVE" });
    },
    firstActiveId: async (exceptId?: string) =>
      rows
        .filter((r) => r.status === "ACTIVE" && r.id !== exceptId)
        .sort((a, b) => a.order - b.order)[0]?.id ?? null,
    delete: async (id: string) => {
      rows = rows.filter((r) => r.id !== id);
    },
  },
}));
vi.mock("@/features/media/repositories/mediaRepository", () => ({
  mediaRepository: { findById: async () => ({ format: "pdf" }) },
}));
vi.mock("@/features/media/services/mediaServices", () => ({
  mediaServices: { releaseIfUnused: async () => {} },
}));

const { resumeServices } = await import("./resumeServices");

const input = (title: string, status: "ACTIVE" | "UNLISTED" | "ARCHIVED" = "ACTIVE") => ({
  title,
  slug: "",
  description: "",
  fileId: "file",
  fileName: "cv.pdf",
  status,
  notes: "",
});

const primary = () => rows.filter((r) => r.isPrimary).map((r) => r.slug);

describe("resume rules", () => {
  beforeEach(() => {
    rows = [];
  });

  it("makes the first active resume primary automatically", async () => {
    await resumeServices.create(input("Full-stack"));
    await resumeServices.create(input("Frontend"));
    expect(primary()).toEqual(["full-stack"]);
  });

  it("does not make an unlisted resume primary", async () => {
    await resumeServices.create(input("Tailored", "UNLISTED"));
    expect(primary()).toEqual([]);
  });

  it("keeps exactly one primary when switching", async () => {
    await resumeServices.create(input("Full-stack"));
    await resumeServices.create(input("Frontend"));
    await resumeServices.setPrimary("r2");
    expect(primary()).toEqual(["frontend"]);
  });

  it("promotes the next active resume when the primary is archived", async () => {
    await resumeServices.create(input("Full-stack"));
    await resumeServices.create(input("Frontend"));
    await resumeServices.setStatus("r1", "ARCHIVED");
    expect(primary()).toEqual(["frontend"]);
    expect(rows.find((r) => r.id === "r1")!.isPrimary).toBe(false);
  });

  it("promotes the next active resume when the primary is deleted", async () => {
    await resumeServices.create(input("Full-stack"));
    await resumeServices.create(input("Frontend"));
    await resumeServices.delete("r1");
    expect(primary()).toEqual(["frontend"]);
  });

  it("keeps the slug (and shared links) when the file is replaced", async () => {
    await resumeServices.create(input("Full-stack"));
    const result = await resumeServices.update("r1", {
      ...input("Full-stack"),
      fileId: "new-file",
    });
    expect(result.slug).toBe("full-stack");
    expect(rows[0].fileId).toBe("new-file");
  });
});
