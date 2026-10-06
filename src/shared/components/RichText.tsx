import { toParagraphs, toSegments } from "@/shared/libs/richText";
import { cn } from "@/shared/libs/utils";

type RichTextProps = {
  text: string;
  className?: string;
  /** Classes for the **bold** phrases (e.g. a brighter colour on dark sections). */
  boldClassName?: string;
};

/** Paragraphs with **bold** highlights, from dashboard copy (see shared/libs/richText). */
export const RichText = ({ text, className, boldClassName }: RichTextProps) => (
  <div className={cn("space-y-4", className)}>
    {toParagraphs(text).map((paragraph, index) => (
      <p key={index}>
        {toSegments(paragraph).map((segment, i) =>
          segment.bold ? (
            <strong key={i} className={cn("font-semibold", boldClassName)}>
              {segment.text}
            </strong>
          ) : (
            segment.text
          ),
        )}
      </p>
    ))}
  </div>
);
