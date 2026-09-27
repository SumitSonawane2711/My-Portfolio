// Cloudinary's errors are about server configuration more often than the file;
// say what to fix instead of showing the raw message.
export function explainCloudinaryError(message: string | undefined) {
  if (!message) return "Upload failed.";
  if (/invalid signature/i.test(message)) {
    return "Cloudinary rejected the upload signature: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET don't belong together in this environment. Fix them in the hosting settings and redeploy.";
  }
  if (/invalid cloud_name|cloud_name mismatch/i.test(message)) {
    return "Cloudinary doesn't recognise NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in this environment.";
  }
  if (/invalid api_key|unknown api key/i.test(message)) {
    return "Cloudinary doesn't recognise CLOUDINARY_API_KEY in this environment.";
  }
  if (/stale request/i.test(message)) {
    return "The upload signature expired — check the server clock, then try again.";
  }
  if (/format|not allowed/i.test(message)) return `Unsupported file: ${message}`;
  return message;
}
