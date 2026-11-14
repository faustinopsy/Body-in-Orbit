const REFERENCE_AGE = 40;
const HEALTHY_BMI = { min: 18.5, max: 25 };

export const bodyMassIndex = ({ weightKg, heightCm }) => weightKg / (heightCm / 100) ** 2;

export function ageFactor(age) {
  return Math.min(Math.max(1 + (age - REFERENCE_AGE) * 0.01, 0.85), 1.25);
}

export function bmiFactor(member) {
  const bmi = bodyMassIndex(member);
  const distance = Math.max(HEALTHY_BMI.min - bmi, bmi - HEALTHY_BMI.max, 0);
  return Math.min(1 + distance * 0.01, 1.15);
}

export function personalFactor(member, layerId) {
  if (layerId !== 'cardiovascular') return 1;
  return ageFactor(member.age) * bmiFactor(member);
}