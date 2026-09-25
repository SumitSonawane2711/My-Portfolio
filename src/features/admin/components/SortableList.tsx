"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { ActionResult } from "@/shared/libs/actionResult";
import { cn } from "@/shared/libs/utils";

type SortableListProps<T extends { id: string }> = {
  items: T[];
  /** Server action that saves the new order (ids in display order). */
  onReorder: (ids: string[]) => Promise<ActionResult<unknown>>;
  renderItem: (item: T) => ReactNode;
  empty?: ReactNode;
};

// Drag-to-reorder list used by every admin section. Reorders optimistically,
// then saves; on failure it rolls back.
export function SortableList<T extends { id: string }>({
  items: initial,
  onReorder,
  renderItem,
  empty,
}: SortableListProps<T>) {
  const [items, setItems] = useState(initial);
  const [synced, setSynced] = useState(initial);
  const [, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Pick up server changes (create/delete elsewhere) without an effect.
  if (initial !== synced) {
    setSynced(initial);
    setItems(initial);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const previous = items;
    const next = arrayMove(
      items,
      items.findIndex((i) => i.id === active.id),
      items.findIndex((i) => i.id === over.id),
    );
    setItems(next);
    startTransition(async () => {
      const result = await onReorder(next.map((i) => i.id));
      if (!result.ok) {
        setItems(previous);
        toast.error(result.error);
      }
    });
  }

  if (items.length === 0) return <>{empty}</>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="divide-y rounded-lg border">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 bg-background px-3 py-2",
        isDragging && "relative z-10 shadow-md",
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
    </li>
  );
}
