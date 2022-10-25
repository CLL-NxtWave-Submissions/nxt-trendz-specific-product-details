import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'

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
    productAPIResponseData: {},
  }

  componentDidMount() {
    this.getRequestedProductDetails()
  }

  convertSnakeCasedProductResponseDataToCamelCasedJSON = snakeCasedData => ({
    id: snakeCasedData.id,
    imageUrl: snakeCasedData.image_url,
    title: snakeCasedData.title,
    brand: snakeCasedData.brand,
    totalReviews: snakeCasedData.total_reviews,
    rating: snakeCasedData.rating,
    availability: snakeCasedData.availability,
    similarProducts: snakeCasedData.similar_products.map(
      similarProductListItem => ({
        id: similarProductListItem.id,
        imageUrl: similarProductListItem.image_url,
        title: similarProductListItem.title,
        style: similarProductListItem.style,
        price: similarProductListItem.price,
        description: similarProductListItem.description,
        brand: similarProductListItem.brand,
        totalReviews: similarProductListItem.total_reviews,
        rating: similarProductListItem.rating,
        availability: similarProductListItem.availability,
      }),
    ),
  })

  getRequestedProductDetails = async () => {
    this.setState({
      productDataResponseStatus: productDataAPIResponseStates.loading,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookie.get('jwt_token')

    const productDataRequestUrl = `https://apis.ccbp.in/products/${id}`
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const productDataAPIResponse = await fetch(
      productDataRequestUrl,
      requestOptions,
    )
    const responseJSONData = await productDataAPIResponse.json()

    let currentProductDataAPIResponseState = null
    let formattedProductSpecificData = {}
    if (productDataAPIResponse.ok) {
      currentProductDataAPIResponseState = productDataAPIResponseStates.success
      formattedProductSpecificData = this.convertSnakeCasedProductResponseDataToCamelCasedJSON(
        responseJSONData,
      )
    } else {
      currentProductDataAPIResponseState = productDataAPIResponseStates.failure
      formattedProductSpecificData = {
        statusCode: responseJSONData.status_code,
        errorMsg: responseJSONData.error_msg,
      }
    }

    this.setState({
      productDataResponseStatus: currentProductDataAPIResponseState,
      productAPIResponseData: formattedProductSpecificData,
    })
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.push('./products')
  }

  renderProductNotFoundView = () => {
    const {productAPIResponseData} = this.state
    const {errorMsg} = productAPIResponseData

    return (
      <div className="product-not-found-container">
        <img
          className="product-not-found-img"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
        />
        <h1 className="product-not-found-header">{errorMsg}</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderThreeDotsLoader = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderUIBasedOnProductAPIResponseStatus = productAPIResponseStatus => {
    let finalUI = null

    if (
      productAPIResponseStatus === productDataAPIResponseStates.loading ||
      productAPIResponseStatus === productDataAPIResponseStates.initial
    ) {
      finalUI = this.renderThreeDotsLoader()
    } else if (
      productAPIResponseStatus === productDataAPIResponseStates.failure
    ) {
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
