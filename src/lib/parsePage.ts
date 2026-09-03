export function parsePageParam(page?: string): number {
  const parsed = parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
