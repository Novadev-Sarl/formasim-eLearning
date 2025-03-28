/**
 * Format a duration in minutes to a string with hours and minutes
 * @param duration - The duration in minutes
 * @returns The formatted duration
 */
export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60)
  const minutes = Math.ceil(duration % 60)
    .toString()
    .padStart(2, '0')
  return `${hours}h${minutes}`
}
