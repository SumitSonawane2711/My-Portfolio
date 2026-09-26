"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cldFileUrl } from "@/shared/libs/cloudinaryUrl";
import type { ResumeAdminRow } from "../interfaces/resume";

// Admin links point straight at Cloudinary instead of /resume/<slug>/download,
// so checking your own file doesn't inflate the public download count.
export const resumeFileUrls = (resume: ResumeAdminRow) => {
  const format = resume.file.format ?? "pdf";
  return {
    view: cldFileUrl(resume.file.publicId, format),
    download: cldFileUrl(resume.file.publicId, format, resume.fileName),
  };
};

type ResumePreviewDialogProps = {
  resume: ResumeAdminRow | null;
  onOpenChange: (open: boolean) => void;
};

export const ResumePreviewDialog = ({ resume, onOpenChange }: ResumePreviewDialogProps) => {
  const urls = resume && resumeFileUrls(resume);

  return (
    <Dialog open={resume !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{resume?.title}</DialogTitle>
          <DialogDescription>{resume?.fileName}</DialogDescription>
        </DialogHeader>

        {resume && urls && (
          <>
            <iframe
              key={resume.id}
              src={urls.view}
              title={`${resume.title} preview`}
              className="h-[70vh] w-full rounded-lg border bg-white"
            />
            <DialogFooter>
              <Button variant="outline" asChild>
                <a href={urls.view} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  Open in new tab
                </a>
              </Button>
              <Button asChild>
                <a href={urls.download} download={resume.fileName}>
                  <Download />
                  Download
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
