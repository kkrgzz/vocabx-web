import React, { useState } from 'react';
import { Collapse, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import NavItem from './NavItem';

import { handlerActiveItem, useGetMenuMaster } from 'api/menu';

export default function NavCollapse({ menu, level = 1 }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <ListItemButton 
      onClick={handleToggle} 
      sx={{
        pl: drawerOpen ? `${level * 28}px` : 1.5,
      }}
      >
        {menu.icon && <menu.icon style={{ marginRight: 8 }} />}
        <ListItemText primary={<Typography variant="body1">{menu.title}</Typography>} />
        {open ? <UpOutlined /> : <DownOutlined />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menu.children?.map((child) =>
            child.type === 'item' ? (
              <NavItem key={child.id} item={child} level={level + 1} />
            ) : null
          )}
        </List>
      </Collapse>
    </>
  );
}