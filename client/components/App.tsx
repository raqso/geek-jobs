import React from "react";
import "./App.css";
import Fab from "@material-ui/core/Fab";
import Offer from "../components/Offer";
import SearchBox from "../components/SearchBox";
import OffersCounter from "../components/OffersCounter";
import Loading from "../components/Loading";
import config from "./config";

interface AppState {
  offers: any[];
  isLoading: Boolean;
}

class App extends React.Component<any, AppState> {
  private readonly offersApiAddress = `${config.api}/offers`;
  private offersList!: HTMLElement;
  private searchbox!: SearchBox;

  constructor(props: any) {
    super(props);
    this.state = {
      offers: [],
      isLoading: false,
    };
  }

  public render() {
    return (
      <div className='App'>
        {this.state.isLoading && <Loading />}
        <section id='top'>
          <div id='header' />
          <div id='container'>
            <SearchBox
              onClick={() => this.searchOffers()}
              positionPlaceholder='Stanowisko, np: Programista C#'
              locationPlaceholder='Lokalizacja, np: Wrocław'
              searchButtonText='Szukaj'
              ref={(el: SearchBox) => (this.searchbox = el)}
            />
          </div>
        </section>
        {this.renderOffersSection()}
        <section id='footer' />
      </div>
    );
  }

  private renderOffersSection() {
    if (this.state.offers.length) {
      return (
        <section id='offers-section' ref={(el: any) => (this.offersList = el)}>
          <OffersCounter offersLength={this.state.offers.length} />
          <ul id='offers'>{this.renderOffers()}</ul>
          <a href='#'>
            <Fab color='primary' aria-label='Do góry'>
              <i className='fas fa-chevron-up' />
            </Fab>
          </a>
        </section>
      );
    } else {
      return null;
    }
  }

  private renderOffers() {
    const offers: any[] = [];
    this.state.offers.forEach((offer) => {
      offers.push(
        <Offer
          position={offer.position}
          location={offer.location}
          technologies={offer.technologies}
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
    this.setState({ isLoading: true }, async () => {
      const address = `${
        this.offersApiAddress
      }?position=${this.searchbox.getPosition()}&location=${this.searchbox.getLocation()}`;

      await fetch(address)
        .then((response) => response.json())
        .then((offers) =>
          this.setState({ offers }, () => {
            if (this.offersList) {
              this.offersList.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          })
        );

      this.setState({ isLoading: false });
    });
  }
}

export default App;
