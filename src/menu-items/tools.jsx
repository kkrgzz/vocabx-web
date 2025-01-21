import { CheckSquareOutlined, ClockCircleOutlined, CoffeeOutlined, HourglassOutlined } from "@ant-design/icons";

const icons = {
    noteIcon: CoffeeOutlined,
    todoIcon: CheckSquareOutlined,
    pomodoroIcon: HourglassOutlined,
    timerIcon: ClockCircleOutlined,
}

const tools = {
    id: 'tools',
    title: 'Tools 🛰️',
    type: 'group',
    url: '/tools',
    children: [
        {
            id: 'notes',
            title: 'Notes',
            type: 'item',
            url: '/notes',
            icon: icons.noteIcon
        },
        {
            id: 'todo',
            title: 'To-Do',
            type: 'item',
            url: '/todo',
            icon: icons.todoIcon
        },
        {
            id: 'pomodoro',
            title: 'Pomodoro',
            type: 'item',
            url: '/pomodoro',
            icon: icons.pomodoroIcon
        },
        {
            id: 'timer',
            title: 'Timer',
            type: 'item',
            url: '/timer',
            icon: icons.timerIcon
        }
    ]
}

export default tools;