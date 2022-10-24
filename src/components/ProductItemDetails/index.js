import {Component} from 'react'

import Header from '../Header'
import './index.css'

const productDataAPIResponseStates = {
  initial: 'UNINITIATED',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class ProductItemDetails extends Component {
  state = {
    productQuantity: 1,
    productDataResponseStatus: productDataAPIResponseStates.initial,
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.push('./products')
  }

  renderProductNotFoundView = () => (
    <div className="product-not-found-container">
      <img
        className="product-not-found-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1 className="product-not-found-header">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderUIBasedOnProductAPIResponseStatus = productAPIResponseStatus => {
    let finalUI = null

    if (productAPIResponseStatus === productDataAPIResponseStates.failure) {
      finalUI = this.renderProductNotFoundView()
    }

    return finalUI
  }

  render() {
    const {productDataResponseStatus} = this.state

    return (
      <div className="product-item-details-bg-container">
        <Header />
        {this.renderUIBasedOnProductAPIResponseStatus(
          productDataResponseStatus,
        )}
      </div>
    )
  }
}
