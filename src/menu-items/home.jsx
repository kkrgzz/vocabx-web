import { HomeTwoTone } from "@ant-design/icons";

const icons = {
    homeIcon: HomeTwoTone
}

const home = {
    id: 'home',
    title: 'Home 🏠',
    type: 'group',
    url: '/home',
    children: [
        {
            id: 'home',
            title: 'Home',
            type: 'item',
            url: '/home',
            icon: icons.homeIcon
        }
    ]
}

export default home;