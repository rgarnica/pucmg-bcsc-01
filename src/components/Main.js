import React, { Component, useState } from 'react';
// import NewModal from './Modal';

// const [state, setstate] = useState(false);
class Main extends Component {
  render() {
    return (
      <div id="content">
        <h1>Adicionar Produto</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Nome do produto"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Preço do produto (em Ether)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Adicionar produto</button>
        </form>
        <p>&nbsp;</p>
        <h2>Comprar produto</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Preço</th>
              <th scope="col">Proprietário</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), "ether")} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    {!product.purchased
                      ? <button
                        name={product.id}
                        value={product.price}
                        disabled={!product.isForSelling}
                        onClick={(event) => {
                          this.props.purchaseProduct(event.target.name, event.target.value)
                        }}
                        >
                          Comprar
                        </button>
                      : null
                    }
                  </td>
                  <td>
                    {product.purchased
                      ? <button
                        name={product.id}
                        value={product.price}
                        disabled={product.owner != this.props.account}
                        onClick={(event) => {
                          // this.props.changeProductPrice(event.target.name, event.target.value)
                          setstate(true)
                        }}
                        >
                          Modificar Preço
                        </button>
                      : null
                    }
                  </td>
                  <td>
                    {product.purchased
                      ? <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          console.log(product)
                          console.log(this.props)
                        }}
                        >
                          Inativar
                        </button>
                      : null
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* <NewModal 
        show={state}
        /> */}
        <p><a href="https://ropsten.etherscan.io/address/0x781c71bfe45d1c5d81fca75d17bb589cc72d63fc" target="_blank">Informação do contrato</a></p>
      </div>
    );
  }
}

export default Main;
