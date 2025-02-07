import { AlertOutlined, BulbOutlined, GiftOutlined } from "@ant-design/icons";

const icons = {
    informationIcon: AlertOutlined,
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
            id: 'information',
            title: 'Information',
            type: 'collapse',
            icon: icons.informationIcon,
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
        },

    ]
}

export default others;