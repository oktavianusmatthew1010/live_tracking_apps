import { TrackerLocation } from '../shared/types';

export function formatLocation(location: TrackerLocation): string {
  return `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
}