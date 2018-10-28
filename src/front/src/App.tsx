import * as React from 'react';
import './App.css';
import {Offer} from './components/Offer'
import OfferSearchBox from './components/OfferSearchBox';

interface AppState {
  offers: any[];
}

class App extends React.Component<any, AppState> {
  private readonly offersApiAddress = 'http://localhost:3000/test';

  constructor(props: any) {
    super(props);
    this.state = {
      offers: []
    };
  }

  public componentWillMount() {
    fetch(this.offersApiAddress)
      .then(response => response.json())
      .then(offers => this.setState({ offers }));
  }

  public render() {
    return (
      <div className="App">
        <h2>IT Search</h2>
        <OfferSearchBox />
        <ul id='offers'>
          {this.renderOffers()}
        </ul>
      </div>
    );
  }

  private renderOffers() {
    const offers: any[] = [];
    this.state.offers.forEach( (offer) => {
      offers.push(
        <Offer position={offer.position} location={offer.location} company={offer.company} companyLogo={offer.companyLogo} portalImage={offer.portalLogo} link={offer.link} addedDate={new Date(offer.addedDate)} salary={offer.salary} />
      );
    });
    return offers;
  }
} 

export default App;
