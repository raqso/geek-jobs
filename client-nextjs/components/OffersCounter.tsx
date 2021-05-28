import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const OffersCounter = (props: {
  offersLength: number;
}) => {
  if (props.offersLength > 0) {
    return (<Paper>
      <Typography variant='h6' align={'center'} gutterBottom>
        Znaleziono {props.offersLength} oferty
        </Typography>
    </Paper>);
  }
  else {
    return null;
  }
};

export default OffersCounter;