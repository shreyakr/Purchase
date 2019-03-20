import React, { Component } from 'react';
import '../../css/Summary.css';
import '../../css/Accordion.css';
import testData from '../../Json/test-data.json';
import SummaryContent from '../../Component/SummaryContent'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import  * as commonAction from './commonAction'
import Flyout from './Flyout';

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isPromoCodeVisible: false,
            isProductVisible: false,
            promoSection: 'Apply promo code',
            productSection: 'See item details',
            total: testData.summary.grandTotal,
            promoMessage: '',
            isPromoMessageUpdated: false,
            promotionDiscount: 0,
            promocode:""
        };
        this.handleFlyout = this.handleFlyout.bind(this);
        this.handlePromoSection = this.handlePromoSection.bind(this);
        this.handleProductSection = this.handleProductSection.bind(this);
    };

    returnQtyTotal() {
        let qtyTotal = testData.summary.quantityTotal;
        if (qtyTotal > 1) {
            return '(' + qtyTotal.toString() + ' items)';
        } else {
            return '(' + qtyTotal.toString() + ' item)';
        }
    };

    reCalculateTotal() {
        let promoCode = document.getElementById('promoCode');
        let newTotal = 0;
        if (promoCode.value.toLowerCase() === 'discount') {
            let pickupDiscount = testData.summary.pickupDiscount.toFixed(2);
            let subTotal = testData.summary.subTotal.toFixed(2);
            let merchandisingFees = testData.summary.merchandisingFeesTotal.toFixed(2);
            let tax = testData.summary.taxTotal.toFixed(2);
            let promoDiscount = (subTotal * 10) / 100;
            let totalDiscount = parseFloat(pickupDiscount) + parseFloat(promoDiscount);
            newTotal = (parseFloat(subTotal) + parseFloat(merchandisingFees) + parseFloat(tax)) - totalDiscount;
            if (newTotal === this.state.total) {
                console.log('Promo already applied');
                this.setState({
                    promoMessage: 'Promotion code already applied!',
                    isPromoMessageUpdated: true,
                    promotionDiscount: promoDiscount
                });
            } else {
                this.setState({
                    total: newTotal,
                    promoMessage: 'Promotion code applied successfully',
                    isPromoMessageUpdated: true,
                    promotionDiscount: promoDiscount
                });
            }
        } else {
            this.setState({
                promoMessage: 'Invalid Promo Code',
                isPromoMessageUpdated: true
            });
        }
    };

    toggleFlyout() {
        this.setState({
            visible: !this.state.visible
        });
    };

    togglePromoCode() {
        this.setState({
            isPromoCodeVisible: !this.state.isPromoCodeVisible
        });
    };

    toggleProductSection() {
        this.setState({
            isProductVisible: !this.state.isProductVisible
        });
    };

    handlePromoSection(e) {
        e.stopPropagation();
        this.togglePromoCode();
        if (!this.state.isPromoCodeVisible) {
            this.setState({
                promoSection: 'Hide promo code'
            });
        } else {
            this.setState({
                promoSection: 'Apply promo code'
            });
        }
        console.log('Promo section clicked' + this.state.isPromoCodeVisible);
    };

    handleProductSection(e) {
        this.toggleProductSection();
        if (!this.state.isProductVisible) {
            this.setState({
                productSection: 'Hide item details'
            });
        } else {
            this.setState({
                productSection: 'See item details'
            });
        }
        console.log('Product accordion clicked' + this.state.isProductVisible);
        e.stopPropagation();
    };

    handleFlyout(e) {
        this.toggleFlyout();
        console.log('Pickup Savings flyout clicked' + this.state.visible);
        e.stopPropagation();
    };

    handleApplyPromotion =()=> {
       // e.stopPropagation();
        this.props.GetPromocode(this.state.promocode);
    };
    promoChange=(e)=>{
        this.setState({ promocode: e.target.value }, () => {
            this.props.GetPromocode(this.state.promocode);
        });
    }
    render() {
        let isVisible = 'hide';
        if (this.state.visible) {
            isVisible = 'show';
        }
        return (
            <div className='table'>
                <div id='subtotal' className='row block-display'>
                    <div className='cols inline-block left-align'>
                        SubTotal {this.returnQtyTotal()}
                    </div>
                    <div className='cols inline-block right-align'>
                        ${testData.summary.subTotal.toFixed(2)}
                    </div>
                </div>
                <div className='row block-display'>
                    <div className='cols inline-block left-align'>
                        <span  id='flyout' className={isVisible} onMouseDown={this.handleFlyout}>
                            Pickup savings
                        </span>
                        <Flyout handleMouseDown={this.handleFlyout} visibility={this.state.visible} />
                    </div>
                    <div className='cols inline-block right-align discount font-weight-bold'>
                        - ${testData.summary.pickupDiscount.toFixed(2)}
                    </div>
                </div>
                <SummaryContent Heading="Merchandising fee" PriceData={testData.summary.merchandisingFeesTotal.toFixed(2)}/>
                <SummaryContent Heading="Est. taxes & fees" PriceData={testData.summary.taxTotal.toFixed(2)}/>
                <div className={'row block-display discount ' + (this.state.isPromoMessageUpdated ? 'showPromotionMessage' : 'hidePromotionMessage')}>
                    <div className='cols left-align promoMessage'>Promotion Discount</div>
                    <div className='cols inline-block right-align font-weight-bold'>
                        - ${this.state.promotionDiscount}
                    </div>
                </div>
                <div className="divider" />
                <SummaryContent Heading="Est. Total" PriceData={this.state.total.toFixed(2)} FontSize="font-weight-bold"/>
                <div className="divider" />
                <div className='row block-display'>
                    <div className='cols left-align'>
                        <button className={'collapsible ' + (this.state.isProductVisible ? 'active' : '')} onMouseDown={this.handleProductSection}>{this.state.productSection}</button>
                    </div>
                    <div className={'content ' + (this.state.isProductVisible ? 'show' : '')}>
                        <form className='productDetailsForm'>
                            <div className='row'>
                                <img className='left-align' alt="product thumbanil" src={testData.items[0].thumbnailUrl} />
                                <div className='cols right-align' id='itemDesc'><span>{testData.items[0].productName}</span><br /><br />
                                    <span className='cols left-align discountedPrice'>{testData.items[0].discount.discountPrice}</span>
                                    <span className='cols right-align'>Qty: {testData.summary.quantityTotal}</span>
                                    <span className='cols left-align actualPrice'>{testData.items[0].price}</span>
                                    <span className='cols left-align actualPrice productColorDesc'>Actual Color: {testData.items[0].color}</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="divider" />
                <div className='row block-display'>
                    <div className='cols left-align'>
                        <button className={'collapsible ' + (this.state.isPromoCodeVisible ? 'active' : '')} onMouseDown={this.handlePromoSection}>{this.state.promoSection}</button>
                    </div>
                    <div className={'content ' + (this.state.isPromoCodeVisible ? 'show' : '')}>
                        <form className='promoCodeForm'>
                        <div className="collapsible">{this.props.getpromocode}</div>
                            <input type='text' placeholder='Enter Promo code' id='promoCode' onChange={this.promoChange} value={this.state.promocode}/>
                            <button id="applyButton" onClick={this.handleApplyPromotion}>Apply</button>
                        </form>
                        
                    </div>
                </div>
                <div className={'row ' + ((this.state.isPromoCodeVisible && this.state.isPromoMessageUpdated) ? 'showPromotionMessage' : 'hidePromotionMessage')}>
                    <div className='cols left-align promoMessage '>{this.state.promoMessage}</div>
                </div>
            </div >
        );
    }
}


const mapStateToProps = state => {
    return {
       getpromocode:state ? state.promoCode:""
    };
};
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, commonAction), dispatch);
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Summary);