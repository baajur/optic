import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TypeModal from '../../shared/JsonTextarea';
import Typography from '@material-ui/core/Typography';
import {Card, TextField} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 10,
    paddingBottom: 5
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  disabled: {
    pointerEvents: 'none',
    opacity: .4
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));


export const CommitCard = ({acceptedSuggestions, ignoredDiffs, reset, apply}) => {
  const classes = useStyles();
  const [commitMessage, setCommitMessage] = useState('')
  const pluralIf = (collection) => collection.length !== 1 ? 's' : ''

  return (
    <Card className={classNames(classes.root, {[classes.disabled]: acceptedSuggestions.length === 0})}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Commit Changes
        </Typography>
        <Typography variant="h5" component="h2" color="primary">
          You have accepted {acceptedSuggestions.length} suggestion{pluralIf(acceptedSuggestions)}, and ignored {ignoredDiffs.length} diff{pluralIf(ignoredDiffs)}
        </Typography>

        <TextField multiline
                   style={{marginTop: 15}}
                   value={commitMessage}
                   fullWidth
                   placeholder="Describe the changes you made to the API Contract"
                   onChange={(e) => setCommitMessage(e.target.value)} />

      </CardContent>
      <CardActions>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={() => apply(commitMessage)} color="secondary">Commit Changes</Button>
      </CardActions>
    </Card>
  );
};