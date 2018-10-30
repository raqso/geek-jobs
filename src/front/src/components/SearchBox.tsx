import * as React from 'react';
import './SearchBox.css'; 

interface SearchBoxProps {
    positionPlaceholder: string; 
    locationPlaceholder: string;
    searchButtonText: string;
    onClick: ()=>void;
}

interface SearchBoxState {
    isExpanded: boolean;
}
export default class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
    constructor(props: SearchBoxProps) {
        super(props);
        this.state = {isExpanded: false};
    }

    public render() {
        return <div className="s01">
        <form>
          <fieldset>
            <legend>Znajdź pracę w IT</legend>
          </fieldset>
          <div className="inner-form">
            <div className="input-field first-wrap">
              <input id="search" type="text" placeholder={this.props.positionPlaceholder} />
            </div>
            <div className="input-field second-wrap">
              <input id="location" type="text" placeholder={this.props.positionPlaceholder} />
            </div>
            <div className="input-field third-wrap">
              <button className="btn-search" type="button" onClick={this.props.onClick}>{this.props.searchButtonText}</button>
            </div>
          </div>
        </form>
      </div>
    }
}