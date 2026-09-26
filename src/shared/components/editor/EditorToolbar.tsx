"use client";

import { useRef, type ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CODE_LANGUAGES } from "@/shared/libs/content/languages";
import { cn } from "@/shared/libs/utils";

type EditorToolbarProps = {
  editor: Editor;
  onPickImage: (file: File) => void;
  isUploading: boolean;
};

const ToolButton = ({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    aria-label={label}
    title={label}
    aria-pressed={active}
    disabled={disabled}
    onClick={onClick}
    className={cn(active && "bg-muted text-foreground")}
  >
    {children}
  </Button>
);

export const EditorToolbar = ({ editor, onPickImage, isUploading }: EditorToolbarProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  // Tiptap 3 doesn't re-render on every transaction; subscribe to what the toolbar shows.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      codeLanguage: (e.getAttributes("codeBlock").language as string | undefined) ?? "",
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background p-1">
      <ToolButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolButton>
      <ToolButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolButton>
      <ToolButton
        label="Underline"
        active={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      >
        <Underline />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        active={state.strike}
        onClick={() => chain().toggleStrike().run()}
      >
        <Strikethrough />
      </ToolButton>
      <ToolButton
        label="Inline code"
        active={state.code}
        onClick={() => chain().toggleCode().run()}
      >
        <Code />
      </ToolButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolButton
        label="Heading 2"
        active={state.h2}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolButton>
      <ToolButton
        label="Heading 3"
        active={state.h3}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </ToolButton>
      <ToolButton
        label="Bullet list"
        active={state.bulletList}
        onClick={() => chain().toggleBulletList().run()}
      >
        <List />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={state.orderedList}
        onClick={() => chain().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={state.blockquote}
        onClick={() => chain().toggleBlockquote().run()}
      >
        <Quote />
      </ToolButton>
      <ToolButton
        label="Code block"
        active={state.codeBlock}
        onClick={() => chain().toggleCodeBlock().run()}
      >
        <SquareCode />
      </ToolButton>
      {state.codeBlock && (
        <select
          aria-label="Code language"
          value={state.codeLanguage}
          onChange={(e) =>
            chain()
              .updateAttributes("codeBlock", { language: e.target.value || null })
              .run()
          }
          className="h-7 rounded-md border bg-background px-1 text-xs"
        >
          <option value="">Plain text</option>
          {CODE_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      )}
      <ToolButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </ToolButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolButton label="Link" active={state.link} onClick={setLink}>
        <Link2 />
      </ToolButton>
      <ToolButton label="Image" disabled={isUploading} onClick={() => fileRef.current?.click()}>
        {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
      </ToolButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPickImage(file);
          e.target.value = "";
        }}
      />
      <ToolButton
        label="Table"
        onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <Table />
      </ToolButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </ToolButton>
      <ToolButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </ToolButton>
    </div>
  );
};
