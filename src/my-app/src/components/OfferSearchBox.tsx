import * as React from 'react';

interface OfferSearchBoxProps {
    placeholder?: string;
}

interface OfferSearchBoxState {
    isExpanded: boolean;
}
export default class OfferSearchBox extends React.Component<OfferSearchBoxProps, OfferSearchBoxState> {
    constructor(props: OfferSearchBoxProps) {
        super(props);
        this.state = {isExpanded: false};
    }
    public render() {
        if (this.state.isExpanded) {
            return this.renderExpanded();
        }
        else {
            return this.renderCollapsed();
        }
    }

    private renderCollapsed() {
        return this.renderInputBox();
    }

    private renderExpanded() {
        return <ul>
            this.renderInputBox(),
            <li>{'Test1'}</li>,
            <li>{'Test2'}</li>,
            <li>{'Test3'}</li>,
            <li>{'Test4'}</li>,
            </ul>;
    }

    private renderInputBox() {
        return <input  placeholder={'Programista C# Wrocław'} onClick={ this.handleInputOnClick } />;
    }

    private handleInputOnClick(event: React.SyntheticEvent<HTMLInputElement>) {
        this.setState({isExpanded: !this.state.isExpanded});
    }
}