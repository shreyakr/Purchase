import React, { Component } from 'react';
import '../../css/App.css';
import Summary from '../summary/Summary';

class App extends Component {
  render() {
    return (
      <div id='PurchaseSummaryApp' className="purchaseSummary raisedbox">
        <Summary />
      </div>
    );
  }
}

export default App;
