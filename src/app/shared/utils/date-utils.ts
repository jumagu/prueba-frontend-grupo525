export function calculateYearsInRange(start: Date, end: Date): number {
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('One or both dates are invalid.');
  }

  let years = end.getFullYear() - start.getFullYear();

  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  return years;
}
