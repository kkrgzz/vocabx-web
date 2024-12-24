import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, Grid, Paper, ListItemIcon } from '@mui/material';
import { RightSquareOutlined } from '@ant-design/icons';

function WordDetailsCard({ selectedWord }) {
  if (!selectedWord) {
    return <Typography variant="h6">No word selected</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          {selectedWord.word}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Language: {selectedWord.language.name}
        </Typography>


        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Translations
        </Typography>
        <Grid container spacing={2}>
          {selectedWord.translations.map((translation) => (
            <Grid item key={translation.id}>
              <Paper elevation={2} sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant='body1'>{translation.translation}</Typography>
                <Typography variant='subtitle2'>{translation.language_code}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Sentences
        </Typography>
        {selectedWord.sentences.length > 0 ? (
          <List>
            {selectedWord.sentences.map((sentence, index) => (
              <ListItem key={index} disableGutters disablePadding>
                <ListItemIcon>
                  <RightSquareOutlined />
                </ListItemIcon>
                <ListItemText primary={sentence.sentence} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No sentences available
          </Typography>
        )}


        <Typography variant="body2" color="text.secondary" gutterBottom>
          Created At: {new Date(selectedWord.created_at).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Updated At: {new Date(selectedWord.updated_at).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WordDetailsCard;