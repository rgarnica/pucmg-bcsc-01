import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      // console.log(productCount.toString())
      this.setState({ productCount })
      this.setState({products: []});
      //Load products
      for (let i = 0; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
      console.log(this.state.products)
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      productEdit: undefined,
      showModal: false,
      loading: true
    }

    // this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    // this.purchaseProduct = this.changeProductPrice.bind(this)
    // this.purchaseProduct = this.changeProductStatusForSelling.bind(this)
  }

  createProduct = (name, price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
      .once('confirmation', (receipt) => {
        this.loadBlockchainData()
      })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price, gas: "220000" })
      .once('confirmation', (receipt) => {
        this.loadBlockchainData()
      })
  }

  changeProductPrice = (id, price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.changeProductPrice(id, price).send({ from: this.state.account })
      .once('confirmation', (receipt) => {
        this.loadBlockchainData()
      })
  }

  changeProductStatusForSelling = (id, status) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.changeProductStatusForSelling(id, status).send({ from: this.state.account })
      .once('confirmation', (receipt) => {
        this.loadBlockchainData()
      })
  }

  changeModal = (status, product) => {
    this.setState({ showModal: status })
    if (product !== undefined) {
      console.log(product);
      this.setState({productEdit: product})
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  products = {this.state.products}
                  account = {this.state.account}
                  createProduct = {this.createProduct}
                  purchaseProduct = {this.purchaseProduct}
                  changeProductPrice = {this.changeProductPrice}
                  showModal = {this.state.showModal}
                  productEdit = {this.state.productEdit}
                  changeProductStatusForSelling = {this.changeProductStatusForSelling}
                  changeModal = {this.changeModal}
                  />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
