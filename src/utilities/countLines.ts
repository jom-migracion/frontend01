export default function countLines(text: string | undefined): number {
  if (!text) return 0;
  return text.split('\n').length;
}