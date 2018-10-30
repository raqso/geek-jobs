import * as React from 'react';
import './App.css';
import { Offer } from './components/Offer';
import SearchBox from './components/SearchBox';

interface AppState {
  offers: any[];
}

class App extends React.Component<any, AppState> {
  private readonly offersApiAddress = 'http://localhost:3000/test';
  private offersList: HTMLElement;

  constructor(props: any) {
    super(props);
    this.state = {
      offers: []
    };
  }

  public componentWillMount() {
    /* fetch(this.offersApiAddress)
      .then(response => response.json())
      .then(offers => this.setState({ offers })); */
  }

  public render() {
    return (
      <div className="App">
        <section id="top">
          <SearchBox
            onClick={ () => this.searchOffers()}
            positionPlaceholder="Stanowisko, np: Programista C#"
            locationPlaceholder="Lokalizacja, np: Wrocław"
            searchButtonText="Szukaj"
          />
        </section>
        <section id="offers-section" ref={(el: any) => (this.offersList = el)}>
          <ul id="offers">{this.renderOffers()}</ul>
        </section>
        <section id="footer" />
      </div>
    );
  }

  private renderOffers() {
    const offers: any[] = [];
    this.state.offers.forEach(offer => {
      offers.push(
        <Offer
          position={offer.position}
          location={offer.location}
          company={offer.company}
          companyLogo={offer.companyLogo}
          portalImage={offer.portalLogo}
          link={offer.link}
          addedDate={new Date(offer.addedDate)}
          salary={offer.salary}
          key={offer._id}
        />
      );
    });
    return offers;
  }

  private async searchOffers() {
    await fetch(this.offersApiAddress)
      .then(response => response.json())
      .then(offers => this.setState({ offers }));
    
    if (this.offersList) {
      this.offersList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

export default App;
