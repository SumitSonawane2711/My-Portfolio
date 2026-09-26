import { describe, expect, it } from "vitest";
import { explainCloudinaryError } from "./cloudinaryErrors";

describe("explainCloudinaryError", () => {
  it("explains a key/secret mismatch", () => {
    const message = explainCloudinaryError(
      "Invalid Signature d80f69da. String to sign - 'allowed_formats=pdf&folder=portfolio/resumes&timestamp=1'.",
    );
    expect(message).toContain("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET");
  });

  it("explains a wrong cloud name", () => {
    expect(explainCloudinaryError("Invalid cloud_name Portfolio")).toContain(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    );
  });

  it("falls back to the original message or a generic one", () => {
    expect(explainCloudinaryError("File size too large")).toBe("File size too large");
    expect(explainCloudinaryError(undefined)).toBe("Upload failed.");
  });
});
