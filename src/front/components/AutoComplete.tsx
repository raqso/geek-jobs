import * as React from 'react';

interface AutoCompleteProps {
  placeholder: string;
  maxSuggestions: number;
  suggestionsEndpoint: string;
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
      <div
        className='input-field first-wrap searchbox'
        onFocus={() => this.setState({ isFocus: true })}
        onBlur={event => this.handleBlur(event)}
      >
        <input
          id='position'
          type='text'
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

  private handleBlur(event: React.FocusEvent) {
    const currentTarget = event.currentTarget;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ isFocus: false });
      }
    }, 150);
  }

  private async getSuggestions() {
    await fetch(this.props.suggestionsEndpoint + this.state.value)
      .then(response => response.json())
      .then((suggestions: string[]) => {
        if (suggestions && Array.isArray(suggestions)) {
          this.setState({
            suggestions: suggestions.slice(0, this.props.maxSuggestions)
          });
        }
      });
  }

  private renderSuggestions() {
    return (
      <ul hidden={!this.state.isFocus}>
        {this.state.suggestions.map((suggestion: string) => (
          <li
            key={suggestion}
            value={suggestion}
            onClick={() => {
              this.setState({ value: suggestion });
            }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    );
  }
}
