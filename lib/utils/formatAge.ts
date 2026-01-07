export function formatAge(age: number): string {
  return age.toFixed(age % 1 === 0 ? 0 : age % 0.1 === 0 ? 1 : 2)
}
