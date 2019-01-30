import  React from 'react';
import { Card, CardContent, CardActionArea, Chip  } from '@material-ui/core';
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
    flexGrow: 1,
  },
  companyLogoImg: {
    maxWidth: '150px',
    maxHeight: '75px'
  },
  offerContent: {
    flexGrow: 4
  },
  salary: {
    flexGrow: 1
  },
  portalLogo: {
    flexGrow: 1
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
              <p className={'position'}>{props.position}</p>
              <ul className='technologies'>
                {props.technologies
                  ? props.technologies.map(technology => {
                      return <Chip label={technology} key={technology.toString()} />;
                    })
                  : null}
              </ul>
              <span className='location'>{props.location}</span>{' '}
              {getNiceDate(props.addedDate)}
            </div>
            <div className={classes.salary}>
              {getNiceSalary(props.salary)}
            </div>
            <div className={classes.portalLogo}>
              <img src={props.portalImage} alt={'Job offers portal logo'} className={classes.portalLogoImg} />
            </div>
          </CardContent>
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
    return `${salary.from} - ${salary.to}${
      salary.currency ? salary.currency : ''
    }`;
  } else {
    return '';
  }
};

export default withStyles(styles)(Offer);