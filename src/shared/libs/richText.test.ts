import { describe, expect, it } from "vitest";
import { toParagraphs, toPlainText, toSegments } from "./richText";

describe("richText", () => {
  it("splits paragraphs on blank lines and joins wrapped lines", () => {
    expect(toParagraphs("First line\nstill first.\n\n  Second.  \n\n\n")).toEqual([
      "First line still first.",
      "Second.",
    ]);
  });

  it("marks **bold** phrases", () => {
    expect(toSegments("As your **full-stack developer**, I build.")).toEqual([
      { text: "As your ", bold: false },
      { text: "full-stack developer", bold: true },
      { text: ", I build.", bold: false },
    ]);
  });

  it("leaves stray or empty markers as text", () => {
    expect(toSegments("a ** b")).toEqual([{ text: "a ** b", bold: false }]);
    expect(toSegments("****")).toEqual([{ text: "****", bold: false }]);
  });

  it("gives plain text for metadata", () => {
    expect(toPlainText("**Fast** apps.\n\nNo **fuss**.")).toBe("Fast apps. No fuss.");
  });
});
