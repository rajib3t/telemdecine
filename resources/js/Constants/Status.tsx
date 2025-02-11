import { Status } from "@/types/status";

export const STATUS_CLASS : Record<Status, string > = {
    COMPLETED: 'bg-green-500',
    CANCELLED:'bg-red-500',
    CLOSED: 'bg-blue-500',
    OPEN:'bg-yellow-500',
}
