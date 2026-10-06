"use client";

import { useId, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import { cn } from "@/shared/libs/utils";
import type { FreelanceService } from "@/features/freelance/interfaces/freelance";

const EASE = [0.22, 1, 0.36, 1] as const;

// Numbered steps, one open at a time (the first by default). The panel
// height, the number badge and the chevron all animate between states.
export const ServicesAccordion = ({ services }: { services: FreelanceService[] }) => {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="relative">
      {/* The rail connecting the numbers. */}
      <span aria-hidden className="absolute top-6 bottom-6 left-5 w-px bg-white/15 md:left-6" />
      <ol className="relative flex flex-col gap-3">
        {services.map((service, index) => {
          const isOpen = open === service.id;
          const buttonId = `${baseId}-button-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <li key={service.id} className="reveal relative flex gap-4 md:gap-6">
              <motion.span
                aria-hidden
                animate={{
                  scale: isOpen ? 1.08 : 1,
                  backgroundColor: isOpen ? "#fbbf24" : "#262626",
                  color: isOpen ? "#0a0a0a" : "#d4d4d4",
                }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                className="relative z-10 mt-4 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-neutral-950 md:size-12"
              >
                {index + 1}
              </motion.span>

              <div
                data-active={isOpen || undefined}
                // Each card's light starts at a different point on its border.
                style={{ "--beam-delay": `${index * -1.7}s` } as CSSProperties}
                className={cn(
                  "border-beam min-w-0 flex-1 rounded-3xl ring-1 transition-colors duration-300",
                  isOpen
                    ? "bg-white/[0.07] ring-white/15"
                    : "bg-white/[0.04] ring-white/10 hover:ring-white/20",
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : service.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-3xl px-6 py-5 text-left text-lg font-semibold focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none md:px-8 md:py-6 md:text-xl"
                  >
                    {service.title}
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                      className="shrink-0 text-neutral-400"
                    >
                      <IconChevronDown className="size-5" />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        exit={{ y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                        className="px-6 pb-6 text-base leading-relaxed text-neutral-300 md:px-8 md:pb-8"
                      >
                        <p>{service.summary}</p>
                        {service.details && (
                          <RichText
                            text={service.details}
                            className="mt-4"
                            boldClassName="text-white"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
