export function transformUnixTimestampToReadableDate(
  timestamp: string
): string {
  const date = new Date(Number(timestamp));
  if (!isNaN(date.getTime())) {
    return date.toLocaleString();
  }
  return timestamp;
}
