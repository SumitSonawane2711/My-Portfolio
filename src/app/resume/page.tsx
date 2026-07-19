import Link from "next/link";
import { IconDownload, IconArrowLeft } from "@tabler/icons-react";
import Container from "../components/container";

export default function ResumePage() {
  return (
    <Container className="min-h-screen py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <a
          href="/Sumit_Resume_2026.pdf"
          download="Sumit_Resume_2026.pdf"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <IconDownload className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <iframe
          src="/Sumit_Resume_2026.pdf"
          title="Sumit Resume Preview"
          className="h-[80vh] w-full"
        />
      </div>
    </Container>
  );
}
