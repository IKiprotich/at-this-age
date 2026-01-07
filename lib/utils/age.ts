export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const now = new Date()
  
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()
  let days = now.getDate() - birthDate.getDate()
  
  if (days < 0) {
    months--
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += lastMonth.getDate()
  }
  
  if (months < 0) {
    years--
    months += 12
  }
  
  const ageInYears = years + months / 12 + days / 365.25
  
  return Math.round(ageInYears * 100) / 100
}
