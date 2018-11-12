import * as React from 'react';

interface AutoCompleteProps {
  placeholder: string;
  maxSuggestions: number;
  suggestionsEndpoint: string,
  onChange(value: any): void;
}

interface AutoCompletePropsState {
  value: string;
  isFocus: boolean;
  suggestions: string[];
}

export default class AutoComplete extends React.Component<
  AutoCompleteProps,
  AutoCompletePropsState
> {

  constructor(props: AutoCompleteProps) {
    super(props);
    this.state = {
      isFocus: false,
      suggestions: [],
      value: ''
    };
  }

  public onChange(value: any) {
    return value;
  }

  public render() {
    return (
      <div className="input-field first-wrap" onFocus={() => this.setState({ isFocus: true })} onBlur={() => {
        this.setState({ isFocus: false });
        console.log('div out!');
    }}>
        <input
          id="position"
          type="text"
          placeholder={this.props.placeholder}
          onChange={event => this.handleChange(event)}
          
          value={this.state.value}
          
        />
        {this.renderSuggestions()}
      </div>
    );
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value });
    this.getSuggestions();
    this.props.onChange(event.target.value);
  }

  private async getSuggestions() {
    await fetch(this.props.suggestionsEndpoint + this.state.value)
      .then(response => response.json())
      .then(suggestions =>
        this.setState({
          suggestions: suggestions.slice(0, this.props.maxSuggestions)
        })
      );
  }

  private renderSuggestions() {
      return (
        <ul hidden={!this.state.isFocus}>
          {this.state.suggestions.map(suggestion => (
            <li key={suggestion} value={suggestion} onClick={() => this.setState({value: suggestion})} >
              {suggestion}
            </li>
          ))}
        </ul>
      );
  }
}
