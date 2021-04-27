import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
    width: '100vw',
    position: 'fixed' as 'fixed'
  },
};

const LinearIndeterminate = (props: {classes: Record<'root', string>}) => {
  return (
    <div className={props.classes.root}>
      <LinearProgress />
    </div>
  );
};

export default withStyles(styles)(LinearIndeterminate);