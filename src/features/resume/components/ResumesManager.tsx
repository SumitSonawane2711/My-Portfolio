"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Eye, Pencil, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { clientEnv } from "@/shared/configs/clientEnv";
import { cldUrl, isLocalMedia } from "@/shared/libs/cloudinaryUrl";
import { cn } from "@/shared/libs/utils";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { SortableList } from "@/features/admin/components/SortableList";
import {
  deleteResume,
  reorderResumes,
  setPrimaryResume,
  setResumeStatus,
} from "../actions/resumeActions";
import type { ResumeAdminRow } from "../interfaces/resume";
import { ResumeDialog } from "./ResumeDialog";
import { ResumePreviewDialog, resumeFileUrls } from "./ResumePreviewDialog";

export const ResumesManager = ({ resumes }: { resumes: ResumeAdminRow[] }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ open: boolean; resume: ResumeAdminRow | null }>({
    open: false,
    resume: null,
  });
  const [preview, setPreview] = useState<ResumeAdminRow | null>(null);

  const act = (task: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
    startTransition(async () => {
      const result = await task();
      if (result.ok) toast.success(success);
      else toast.error(result.error);
      router.refresh();
    });

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${clientEnv.siteUrl}/resume/${slug}`);
    toast.success("Link copied");
  };

  return (
    <>
      <PageHeader
        title="Resumes"
        description="Active resumes are listed on /resume (the ★ primary one is the default and the Resume button). Unlisted ones work only by link."
        actions={
          <Button onClick={() => setDialog({ open: true, resume: null })}>
            <Plus />
            Add resume
          </Button>
        }
      />

      <SortableList
        items={resumes}
        onReorder={reorderResumes}
        empty={<p className="text-sm text-muted-foreground">No resumes yet.</p>}
        renderItem={(resume) => (
          <>
            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded border bg-muted">
              {isLocalMedia(resume.file.publicId) ? (
                <span className="flex h-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  PDF
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-rendered PDF page
                <img
                  src={cldUrl(resume.file.publicId, { page: 1, format: "jpg", width: 88 })}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                {resume.title}
                {resume.isPrimary && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="size-3 fill-current" /> primary
                  </Badge>
                )}
              </p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                /resume/{resume.slug}
                <span className="inline-flex items-center gap-0.5">
                  <Download className="size-3" />
                  {resume.downloadCount}
                </span>
              </p>
            </div>

            <Select
              value={resume.status}
              onValueChange={(status) =>
                act(() => setResumeStatus(resume.id, status), "Status updated")
              }
              disabled={pending}
            >
              <SelectTrigger size="sm" className="w-28" aria-label="Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNLISTED">Unlisted</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Set as primary"
              title="Set as primary"
              disabled={pending || resume.isPrimary}
              onClick={() => act(() => setPrimaryResume(resume.id), "Primary resume updated")}
            >
              <Star className={cn(resume.isPrimary && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Preview ${resume.title}`}
              title="Preview"
              onClick={() => setPreview(resume)}
            >
              <Eye />
            </Button>
            <Button variant="ghost" size="icon" title="Download" asChild>
              <a
                href={resumeFileUrls(resume).download}
                download={resume.fileName}
                aria-label={`Download ${resume.title}`}
              >
                <Download />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy link"
              title="Copy link"
              disabled={resume.status === "ARCHIVED"}
              onClick={() => void copyLink(resume.slug)}
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${resume.title}`}
              onClick={() => setDialog({ open: true, resume })}
            >
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              itemName={resume.title}
              description="Its download count is lost too. Archive it instead to keep the history."
              onConfirm={deleteResume.bind(null, resume.id)}
            />
          </>
        )}
      />

      <ResumeDialog
        open={dialog.open}
        resume={dialog.resume}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
      <ResumePreviewDialog resume={preview} onOpenChange={(open) => !open && setPreview(null)} />
    </>
  );
};
