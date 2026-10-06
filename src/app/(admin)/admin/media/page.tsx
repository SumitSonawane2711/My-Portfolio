import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { MediaLibrary } from "@/features/media/components/MediaLibrary";
import { mediaRepository } from "@/features/media/repositories/mediaRepository";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  await requireAdmin();
  const assets = await mediaRepository.listWithUsage();

  const items = assets.map(({ _count, ...asset }) => ({
    id: asset.id,
    publicId: asset.publicId,
    resourceType: asset.resourceType,
    format: asset.format,
    bytes: asset.bytes,
    width: asset.width,
    height: asset.height,
    alt: asset.alt,
    usedBy: Object.values(_count).reduce((sum, n) => sum + n, 0),
  }));

  return (
    <>
      <PageHeader title="Media" description="Every file uploaded to Cloudinary." />
      <MediaLibrary items={items} />
    </>
  );
}
