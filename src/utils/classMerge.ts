import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function classMerge(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}
