"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  images: string[];
  alt: string;
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

export const ProjectGallery = ({ images, alt }: ProjectGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setActiveIndex((prev) => (prev + dir + images.length) % images.length);
    },
    [images.length],
  );

  const openPopup = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, paginate]);

  if (images.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => openPopup(activeIndex)}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-lg border border-neutral-200 shadow-xl dark:border-neutral-800"
      >
        <Image
          src={images[activeIndex]}
          alt={alt}
          height={500}
          width={900}
          className="max-h-96 w-full rounded-lg object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "overflow-hidden rounded-md border transition duration-200",
                index === activeIndex
                  ? "border-primary ring-primary/50 ring-2"
                  : "border-neutral-200 opacity-70 hover:opacity-100 dark:border-neutral-800",
              )}
            >
              <Image
                src={image}
                alt={`${alt} screenshot ${index + 1}`}
                height={100}
                width={160}
                className="h-14 w-24 object-cover md:h-16 md:w-28"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <IconX className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 md:left-6"
            >
              <IconChevronLeft className="h-7 w-7" />
            </button>

            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-10 max-h-[85vh] max-w-5xl"
            >
              <Image
                src={images[activeIndex]}
                alt={`${alt} screenshot ${activeIndex + 1}`}
                height={600}
                width={1200}
                className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
              />
            </motion.div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 md:right-6"
            >
              <IconChevronRight className="h-7 w-7" />
            </button>

            <p className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
              {activeIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
