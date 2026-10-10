import Link from "next/link";
import { IconDownload, IconArrowLeft } from "@tabler/icons-react";
import { ChaiButton } from "@/shared/components/chai/Button";
import { Container } from "@/shared/components/Container";
import type { PublicResume } from "../interfaces/resume";
import { ResumeSelector } from "./ResumeSelector";

type ResumePageProps = {
  resume: PublicResume;
  /** Active resumes to switch between (the selector shows when there are 2+). */
  options: PublicResume[];
};

// Same layout as before (back link, download button, PDF preview), now for
// whichever resume is selected. Downloads go through a counting route.
export const ResumePage = ({ resume, options }: ResumePageProps) => {
  return (
    <Container>
      <div className="mb-6 flex items-center justify-between gap-3">
        <ChaiButton asChild variant="ghost">
          <Link href="/">
            <IconArrowLeft className="size-4" />
            Back home
          </Link>
        </ChaiButton>

        <ChaiButton asChild variant="solid" iconRight={<IconDownload />}>
          <a href={resume.downloadPath}>Download PDF</a>
        </ChaiButton>
      </div>

      {options.length > 1 && <ResumeSelector options={options} selected={resume.slug} />}
      {resume.description && (
        <p className="mb-4 text-sm text-muted-foreground">{resume.description}</p>
      )}

      <div className="overflow-hidden card-chai">
        <iframe
          key={resume.slug}
          src={resume.viewUrl}
          title={`${resume.title} resume preview`}
          className="h-[80vh] w-full"
        />
      </div>
    </Container>
  );
};
