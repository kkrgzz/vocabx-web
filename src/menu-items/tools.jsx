import { CheckCircleTwoTone, ClockCircleTwoTone,  GoldTwoTone,  HeartTwoTone, HourglassTwoTone, NumberOutlined, ProjectTwoTone, ReconciliationOutlined, ReconciliationTwoTone } from "@ant-design/icons";

const icons = {
    noteIcon: ProjectTwoTone,
    todoIcon: CheckCircleTwoTone,
    moodTrackerIcon: HeartTwoTone,
    pomodoroIcon: HourglassTwoTone,
    timerIcon: ClockCircleTwoTone,
    todoCategoriesIcon: NumberOutlined,
    todoDashboardIcon: ReconciliationOutlined,
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
            type: 'collapse',
            url: '/todo',
            icon: icons.todoIcon,
            children: [
                {
                    id: 'todo-dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/todo/dashboard',
                    icon: icons.todoDashboardIcon,
                },
                {
                    id: 'todo-categories',
                    title: 'Categories',
                    type: 'item',
                    url: '/todo/categories',
                    icon: icons.todoCategoriesIcon,
                }
            ]
        },
        {
            id: 'mood-tracker',
            title: 'Mood Tracker',
            type: 'item',
            url: '/mood-tracker',
            icon: icons.moodTrackerIcon
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
            type: 'collapse',
            url: '/timer',
            icon: icons.timerIcon,
            children: [
                {
                    id: 'count-down-timer',
                    title: 'Count Down Timer',
                    type: 'item',
                    url: '/timer/count-down-timer',
                    icon: icons.timerIcon,
                }
            ]
        }
    ]
}

export default tools;