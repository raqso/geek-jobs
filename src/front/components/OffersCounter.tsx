import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const OffersCounter = (props: {
  offersLength: number;
}) => {
  if (props.offersLength) {
    return (<Paper>
      <Typography variant='caption' align={'center'} gutterBottom>
        Znaleziono {props.offersLength} oferty
        </Typography>
    </Paper>);
  }
  else {
    return null;
  }
};

export default OffersCounter;