"use client";
import React from "react";
import { motion } from "motion/react";
import type { ProjectCard } from "../interfaces/project";
import { SectionHeading } from "@/shared/components/SectionHeading";
import Link from "next/link";
import { TechIconGroup } from "@/shared/components/TechIcons";
import { CloudImage } from "@/shared/components/CloudImage";
import { truncate } from "@/shared/libs/format";

export const Projects = ({ projects }: { projects: ProjectCard[] }) => {
  return (
    <div className="py-10">
      <SectionHeading delay={0.3}>
        Projects | A showcase of my work, highlighting the technologies and skills I have applied in
        real-world projects.
      </SectionHeading>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
        {projects.map((project, idx) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 50 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: idx * 0.1,
                ease: "easeInOut",
              }}
              className="group rounded-lg shadow-lg transition duration-200 hover:scale-105 dark:border-neutral-800 dark:bg-neutral-950"
            >
              {project.coverPublicId && (
                <CloudImage
                  publicId={project.coverPublicId}
                  alt={project.coverAlt || project.title}
                  height={300}
                  width={500}
                  className="w-full rounded-t-xl object-cover transition duration-200"
                />
              )}
              <div className="p-4">
                <h2 className="max-w-lg pt-4 text-sm font-semibold text-primary md:text-base">
                  {project.title}
                </h2>
                <p className="shrink-0 py-2 text-sm text-secondary">{project.displayDate}</p>
                {project.technologies.length > 0 && (
                  <div className="mt-4">
                    <TechIconGroup
                      technologies={project.technologies}
                      iconClassName="h-4 w-4"
                      itemClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm transition-transform group-hover:scale-105 dark:border-neutral-800 dark:bg-neutral-900"
                    />
                  </div>
                )}
                <p className="mt-4 max-w-lg text-sm font-normal text-secondary md:text-sm">
                  {truncate(project.summary, 150)}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
