"use client";

import { useEffect, useRef } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { toast } from "sonner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";
import { useCloudinaryUpload } from "@/features/media/hooks/useCloudinaryUpload";
import type { MediaFolder } from "@/features/media/interfaces/media";
import { EditorToolbar } from "./EditorToolbar";

export type RichEditorValue = { json: JSONContent; html: string };

type RichEditorProps = {
  /** Saved Tiptap JSON if present, otherwise HTML (imported content starts as HTML). */
  initialJson?: JSONContent | null;
  initialHtml?: string;
  onChange: (value: RichEditorValue) => void;
  uploadFolder: MediaFolder;
  placeholder?: string;
};

// Shared by the blog and project editors. The browser only produces raw
// JSON + HTML; the server re-sanitizes and highlights on save (processContent).
export const RichEditor = ({
  initialJson,
  initialHtml,
  onChange,
  uploadFolder,
  placeholder = "Start writing…",
}: RichEditorProps) => {
  const { upload, isUploading } = useCloudinaryUpload(uploadFolder, "image");
  // Paste/drop handlers passed to useEditor are created once, so they reach
  // the latest upload function and editor instance through refs.
  const uploadRef = useRef(upload);
  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    immediatelyRender: false, // avoids SSR hydration mismatches in Next.js
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: initialJson ?? initialHtml ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-80 px-4 py-3 focus:outline-none",
      },
      handlePaste: (_view, event) => insertImageFiles(event.clipboardData?.files),
      handleDrop: (_view, event) => insertImageFiles((event as DragEvent).dataTransfer?.files),
    },
    onUpdate: ({ editor: e }) => onChange({ json: e.getJSON(), html: e.getHTML() }),
  });

  useEffect(() => {
    uploadRef.current = upload;
    editorRef.current = editor;
  });

  // Uploads pasted/dropped images; returns true when it handled the event.
  function insertImageFiles(files: FileList | null | undefined) {
    const images = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return false;
    images.forEach((file) => void insertImage(file));
    return true;
  }

  async function insertImage(file: File) {
    try {
      const media = await uploadRef.current(file);
      editorRef.current
        ?.chain()
        .focus()
        .setImage({
          src: cldUrl(media.publicId, { width: 1280 }),
          alt: media.alt ?? file.name.replace(/\.[^.]+$/, ""),
          width: media.width ?? undefined,
          height: media.height ?? undefined,
        })
        .run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    }
  }

  const words = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.storage.characterCount.words() ?? 0,
  });

  if (!editor) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="overflow-hidden rounded-lg border">
      <EditorToolbar editor={editor} onPickImage={insertImage} isUploading={isUploading} />
      <EditorContent editor={editor} />
      <div className="border-t px-4 py-1.5 text-right text-xs text-muted-foreground">
        {words} words
      </div>
    </div>
  );
};
