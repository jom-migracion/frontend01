export default function countTextLines(text: string, containerWidth: number, font: string): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 1;
  context.font = font;

  const words = text.split(" ");
  let line = "";
  let lines = 1;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const { width } = context.measureText(testLine);
    if (width > containerWidth && i > 0) {
      line = words[i] + " ";
      lines++;
    } else {
      line = testLine;
    }
  }
  return lines;
}
