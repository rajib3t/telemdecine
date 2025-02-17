import {VisitStatus } from '@/types/status';

export const VISIT_CLASS : Record<VisitStatus, string > = {
    PENDING: 'bg-yellow-500',
    CONFIRM: 'bg-green-100',
    CANCEL: 'bg-red-100',
    ATTENDED: 'bg-blue-100'
}
