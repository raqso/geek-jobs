import  React from 'react';
import { Card, CardContent, CardActionArea, Chip, Typography  } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/styles';

interface OfferProps {
  link: string;
  position: string;
  location?: string;
  company?: string;
  companyLogo?: string;
  addedDate?: Date;
  portalImage?: string;
  salary: {
    from: number;
    to: number;
    currency: string;
  };
  technologies?: string[];
  classes?: any;
}

const styles = createStyles({
  card: {
    width: '75%',
    transition: 'all .3s',
    margin: '10px',
    padding: '5px'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  companyLogo: {
    width: '185px'
  },
  companyLogoImg: {
    maxWidth: '150px',
    maxHeight: '75px'
  },
  offerContent: {
    flexGrow: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  technologies: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  technology: {
    height: '20px'
  },
  locationAndDate: {
    display: 'flex',
    flexDirection: 'row'
  },
  location: {
    margin: '0 10px 0 0px'
  },
  date: {
    margin: '0 10px 0 0px'
  },
  salary: {
    flexGrow: 1
  },
  portalLogo: {
    //
  },
  portalLogoImg: {
    maxWidth: '80px',
    maxHeight: '75px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
});

const Offer = (props: OfferProps) => {
  const { classes } = props;
  const defaultCompanyLogo =
    'https://www.gsr-technology.co.uk/wp-content/uploads/2015/10/partner-logo-placeholder-300x150.jpg';

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <a href={props.link} >
          <CardContent className={classes.cardContent}>
          <div className={classes.companyLogo}>
              <img
                src={
                  props.companyLogo
                    ? props.companyLogo
                    : defaultCompanyLogo
                }
                alt={'Company logo'}
                className={classes.companyLogoImg}
              />
            </div>
            <div className={classes.offerContent}>
            <Typography component='h5' variant='h5' className={'position'}>
              {props.position}
            </Typography>
              <div className={classes.technologies}>
                {props.technologies
                  ? props.technologies.map(technology => {
                      return <Chip className={classes.technology} label={technology} key={technology.toString()} />;
                    })
                  : null}
              </div>
              <div className={classes.locationAndDate}>
                <Typography variant='subtitle1' color='textSecondary' className={classes.location}><i className='fas fa-map-marker'></i> {props.location}</Typography>{' '}
                <Typography variant='subtitle1' color='textSecondary' className={classes.date}><i className='far fa-calendar'></i> {getNiceDate(props.addedDate)}</Typography>
              </div>
            </div>
            <Typography className={classes.salary} color='textSecondary'>
              {getNiceSalary(props.salary)}
            </Typography>
            <div className={classes.portalLogo}>
              <img src={props.portalImage} alt={'Job offers portal logo'} className={classes.portalLogoImg} />
            </div>
          </CardContent>
          </a>
        </CardActionArea>
      </Card>
    );
};

const getNiceDate = (dateObj?: Date) => {
  if (dateObj) {
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}.${month}.${year}`;
  } else {
    return '';
  }
};

const getNiceSalary = (salary: {
  from: number;
  to: number;
  currency: string;
}) => {
  if (salary && salary.from && salary.to) {
    return `${salary.from} - ${salary.to} ${
      salary.currency ? salary.currency : ''
    }`;
  } else {
    return '';
  }
};

export default withStyles(styles)(Offer);