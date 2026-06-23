export const ROLE_OPTIONS: Record<string, string> = {
    member: 'member',
    trainer: 'trainer'
} as const

export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
] as const;

export const DATE_FORMAT = 'YYYY-MM-DD';