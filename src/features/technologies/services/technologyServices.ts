import "server-only";
import { AppError } from "@/shared/libs/errors";
import { renderIconSvg } from "@/shared/libs/icons";
import { slugify, uniqueSlug } from "@/shared/libs/slug";
import { mediaServices } from "@/features/media/services/mediaServices";
import type { TechBadge } from "../interfaces/technology";
import { technologyRepository } from "../repositories/technologyRepository";
import { technologySchema, type TechnologyInput } from "../schemas/technologySchema";

type BadgeSource = {
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  customIcon: { publicId: string } | null;
};

/** Renders a technology's icon once, on the server. */
export const toTechBadge = (tech: BadgeSource): TechBadge => ({
  name: tech.name,
  slug: tech.slug,
  svg: renderIconSvg(tech.icon, { color: tech.color }),
  customIconPublicId: tech.customIcon?.publicId ?? null,
  color: tech.color,
});

export const technologyServices = {
  async create(input: TechnologyInput) {
    const data = technologySchema.parse(input);
    if (await technologyRepository.nameOrSlugTaken(data.name, slugify(data.name))) {
      throw new AppError(`"${data.name}" already exists.`, "CONFLICT");
    }
    const slug = await uniqueSlug(data.name, technologyRepository.slugExists);
    return technologyRepository.create({
      name: data.name,
      slug,
      icon: data.icon,
      color: data.color,
      order: (await technologyRepository.maxOrder()) + 1,
      ...(data.customIconId && { customIcon: { connect: { id: data.customIconId } } }),
    });
  },

  async update(id: string, input: TechnologyInput) {
    const data = technologySchema.parse(input);
    const existing = await technologyRepository.findById(id);
    if (!existing) throw new AppError("Technology not found.", "NOT_FOUND");
    if (await technologyRepository.nameOrSlugTaken(data.name, slugify(data.name), id)) {
      throw new AppError(`"${data.name}" already exists.`, "CONFLICT");
    }

    const updated = await technologyRepository.update(id, {
      name: data.name,
      icon: data.icon,
      color: data.color,
      customIcon: data.customIconId ? { connect: { id: data.customIconId } } : { disconnect: true },
    });
    if (existing.customIconId !== data.customIconId) {
      await mediaServices.releaseIfUnused(existing.customIconId);
    }
    return updated;
  },

  async delete(id: string) {
    const existing = await technologyRepository.findById(id);
    if (!existing) throw new AppError("Technology not found.", "NOT_FOUND");
    const usage = await technologyRepository.usageCount(id);
    if (usage > 0) {
      throw new AppError(
        `Used by ${usage} project/experience entr${usage === 1 ? "y" : "ies"}. Remove it there first.`,
        "CONFLICT",
      );
    }
    await technologyRepository.delete(id);
    await mediaServices.releaseIfUnused(existing.customIconId);
  },

  reorder: (ids: string[]) => technologyRepository.reorder(ids),
};
