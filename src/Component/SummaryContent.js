import React, { Component } from 'react';
class SummaryContent extends Component {
    render() {
        return (
            <div className='table'>
                <div id='subtotal' className='row block-display'>
                    <div className='cols inline-block left-align'>
                        {this.props.Heading} 
                    </div>
                    <div className={'cols inline-block right-align ' + (this.props.FontSize ? this.props.FontSize:"")}>
                        ${this.props.PriceData}
                    </div>
                </div>
            </div>
        );
    }
}
export default SummaryContent;