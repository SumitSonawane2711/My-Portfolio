import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { db, log, PUBLIC_DIR, slugForMedia, type ImportContext } from "./shared";

// Moves media still served from /public ("local" MediaAssets created by the
// other importers) to Cloudinary, updating each row in place — every project,
// post, resume… keeps pointing at the same MediaAsset id. Safe to re-run.
//
//   npm run content:import -- --only=upload-local-media
export async function uploadLocalMedia(ctx: ImportContext) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    await cloudinary.api.ping();
  } catch (error) {
    const message = (error as { error?: { message?: string } })?.error?.message;
    log.error(
      "cloudinary",
      new Error(`${message ?? "unreachable"} — check the Cloudinary keys in .env`),
    );
    return;
  }

  const folderRoot = process.env.CLOUDINARY_FOLDER || "portfolio";
  const locals = await db.mediaAsset.findMany({ where: { resourceType: "local" } });
  if (locals.length === 0) log.info("no local media left to upload");

  for (const asset of locals) {
    const label = `media ${asset.publicId}`;
    try {
      const folder = `${folderRoot}/${asset.publicId.split("/")[1] ?? "site"}`;
      if (ctx.dryRun) {
        log.updated(`${label} → ${folder}/${slugForMedia(asset.publicId)} (dry run)`);
        continue;
      }
      const result = await cloudinary.uploader.upload(path.join(PUBLIC_DIR, asset.publicId), {
        folder,
        public_id: slugForMedia(asset.publicId),
        resource_type: "image", // PDFs too, so page thumbnails work
        overwrite: true,
      });
      await db.mediaAsset.update({
        where: { id: asset.id },
        data: {
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          width: result.width ?? null,
          height: result.height ?? null,
          bytes: result.bytes,
        },
      });
      log.updated(`${label} → ${result.public_id}`);
    } catch (error) {
      log.error(label, error);
    }
  }
}
