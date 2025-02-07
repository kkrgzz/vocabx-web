import { BulbOutlined, GiftOutlined } from "@ant-design/icons";

const icons = {
    aboutIcon: BulbOutlined,
    attributionsIcon: GiftOutlined
}

const others = {
    id: 'others',
    title: 'Others',
    type: 'group',
    url: '/others',
    children: [
        {
            id: 'about',
            title: 'About',
            type: 'item',
            url: '/about',
            icon: icons.aboutIcon
        },
        {
            id: 'attributions',
            title: 'Attributions',
            type: 'item',
            url: '/attributions',
            icon: icons.attributionsIcon
        }
    ]
}

export default others;