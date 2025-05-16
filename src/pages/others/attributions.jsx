import { Chip, Divider, Stack, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react'

function Attributions() {
    return (
        <MainCard title="Attributions">
            <Typography variant="body1" textAlign='center'>
                I would like to acknowledge and thank all the creators and contributors whose work has supported the development of this website.
            </Typography>
            <Typography variant="body1" textAlign='center'>
                This includes open-source libraries, tools, images, icons, and other resources that have helped us build and enhance our platform.
            </Typography>
            <Typography variant="body1" textAlign='center'>
                For detailed credits, please refer to the specific mentions below.
            </Typography>
            <Typography variant="body1" textAlign='center'>
                Your support and contributions are greatly appreciated!
            </Typography>

            {/* Template */}
            <Divider sx={{ mt: 4 }}>
                <Chip label="Template" color='warning' />
            </Divider>
            <Stack direction='column'>
                <a href="https://mui.com/store/items/mantis-react-admin-dashboard-template/" title="Mantis - React Material UI Dashboard Template">Mantis - React Material UI Dashboard Template |Thanks for your excellent template.</a>
            </Stack>

            {/* Illustrations */}
            <Divider sx={{ mt: 4 }}>
                <Chip label="Illustrations" color='warning' />
            </Divider>
            <Stack direction='column'>
                <a href="https://undraw.co/illustrations" title="unDraw">unDraw - Thanks for your excellent illustrations.</a>
            </Stack>

            {/* Icons */}
            <Divider sx={{ mt: 4 }}>
                <Chip label="Icons" color='warning' />
            </Divider>
            <Stack direction='column'>
                <a href="https://www.flaticon.com/free-icons/happy-face" title="happy face icons">Happy face icons created by NajmunNahar - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/smile" title="smile icons">Smile icons created by Vectors Market - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/emoji" title="emoji icons">Emoji icons created by Vectors Market - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/sad" title="sad icons">Sad icons created by Vectors Market - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/cry" title="cry icons">Cry icons created by Vectors Market - Flaticon</a>
            </Stack>


        </MainCard>
    )
}

export default Attributions