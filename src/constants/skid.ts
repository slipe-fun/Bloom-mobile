import type { SKID } from '@lib/skid-v3/interface'

let skidInstance: SKID | null = null

// biome-ignore lint/suspicious/noAssignInExpressions: <explanaton>
export default async (): Promise<SKID> => (skidInstance ||= (await import('@lib/skid-v3')).default())
