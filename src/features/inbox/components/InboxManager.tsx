"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Archive, Mail, MailOpen, Reply } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { formatDate } from "@/shared/libs/format";
import { cn } from "@/shared/libs/utils";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deleteMessage, markMessage } from "../actions/messageActions";
import type { InboxMessage } from "../queries/messageQueries";

const STATUSES = ["UNREAD", "READ", "ARCHIVED"] as const;

export const InboxManager = ({ messages }: { messages: InboxMessage[] }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(STATUSES).withDefault("UNREAD").withOptions({ shallow: false }),
  );

  const mark = (id: string, next: (typeof STATUSES)[number]) =>
    startTransition(async () => {
      const result = await markMessage(id, next);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Messages from the contact form. Only you can see these."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onValueChange={(v) => void setStatus(v as (typeof STATUSES)[number])}>
          <TabsList>
            <TabsTrigger value="UNREAD">Unread</TabsTrigger>
            <TabsTrigger value="READ">Read</TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "rounded-lg border p-4",
                message.status === "UNREAD" && "border-l-4 border-l-primary",
              )}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{message.name || "Anonymous"}</span>
                {message.source === "FREELANCE" && <Badge variant="secondary">freelance</Badge>}
                {message.email && <span className="text-muted-foreground">{message.email}</span>}
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {message.phone}
                  </a>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDate(message.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-sm whitespace-pre-wrap">{message.message}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {message.email && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message")}`}
                      onClick={() => message.status === "UNREAD" && mark(message.id, "READ")}
                    >
                      <Reply /> Reply
                    </a>
                  </Button>
                )}
                {message.status === "UNREAD" ? (
                  <Button variant="ghost" size="sm" onClick={() => mark(message.id, "READ")}>
                    <MailOpen /> Mark read
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => mark(message.id, "UNREAD")}>
                    <Mail /> Mark unread
                  </Button>
                )}
                {message.status !== "ARCHIVED" && (
                  <Button variant="ghost" size="sm" onClick={() => mark(message.id, "ARCHIVED")}>
                    <Archive /> Archive
                  </Button>
                )}
                <ConfirmDeleteButton
                  itemName="this message"
                  onConfirm={deleteMessage.bind(null, message.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
