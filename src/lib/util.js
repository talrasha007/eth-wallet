export function fromNow(ts) {
  const diff = Math.round((Date.now() - ts) / 1000);
  if (diff < 60) {
    return diff + 's';
  } else if (diff < 3600) {
    return Math.round(diff / 60) + 'min';
  } else if (diff < 3600 * 72) {
    return Math.round(diff / 3600) + 'hour';
  } else {
    return '';
  }
}
