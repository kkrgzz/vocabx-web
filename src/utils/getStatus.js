import { Circle, Warning, CheckCircle, XCircle } from "@phosphor-icons/react";

export const TODO_STATUSES = {
    TODO: {
        id: 1,
        label: "To Do",
        icon: Circle,
        color: "#A1E3F9"
    },
    IN_PROGRESS: {
        id: 2,
        label: "In Progress",
        icon: Warning,
        color: "#FFB433"
    },
    COMPLETED: {
        id: 3,
        label: "Completed",
        icon: CheckCircle,
        color: "#3D8D7A"
    },
    CANCELLED: {
        id: 4,
        label: "Cancelled",
        icon: XCircle,
        color: "#D84040"
    }
};
