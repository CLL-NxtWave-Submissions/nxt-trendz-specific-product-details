import {Component} from 'react'
import Cookie from 'js-cookie'

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
}
