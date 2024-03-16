import React, { FC } from 'react';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';

export const CommentsBlock: FC<any> = ({ items, children, isLoading = true }) => {
  return (
    <SideBlock title="Останні коментарі:">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj: any, index: number) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText primary={obj.user.fullName} secondary={obj.text} />
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
