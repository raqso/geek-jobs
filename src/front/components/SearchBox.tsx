import * as React from 'react';
import AutoComplete from './AutoComplete';
import './SearchBox.css';

interface SearchBoxProps {
  positionPlaceholder: string;
  locationPlaceholder: string;
  searchButtonText: string;
  onClick: () => void;
}

interface SearchBoxState {
  positionValue: string;
  locationValue: string;
}
export default class SearchBox extends React.Component<
  SearchBoxProps,
  SearchBoxState
> {
  constructor(props: SearchBoxProps) {
    super(props);
    this.state = { locationValue: '', positionValue: '' };
  }

  public render() {
    return (
      <div className='s01'>
        <form>
          <fieldset>
            <legend>Znajdź pracę w IT</legend>
          </fieldset>
          <div className='inner-form'>
            <AutoComplete placeholder={this.props.positionPlaceholder} maxSuggestions={10} onChange={(value) => {this.setState({positionValue: value}); }} suggestionsEndpoint={'api/suggest?position='} />
            <AutoComplete placeholder={this.props.locationPlaceholder} maxSuggestions={5} onChange={(value) => {this.setState({locationValue: value}); }} suggestionsEndpoint={'api/suggest?location='} />
            <div className='input-field third-wrap'>
              <button
                className='btn-search'
                type='button'
                onClick={this.props.onClick}
              >
                {this.props.searchButtonText}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  public getPosition() {
    return this.state.positionValue;
  }

  public getLocation() {
    return this.state.locationValue;
  }
}