import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import { DownOutlined } from '@ant-design/icons'


function TodoListAccordionView({ expanded, handleAccordionChange, renderTodos }) {
    return (
        <Accordion expanded={expanded} onChange={(event, isExpanded) => handleAccordionChange(isExpanded)}>
            <AccordionSummary
                expandIcon={<DownOutlined />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Todos
                </Typography>
            </AccordionSummary>
            <AccordionDetails>

                {renderTodos()}
            </AccordionDetails>
        </Accordion>
    )
}

export default TodoListAccordionView