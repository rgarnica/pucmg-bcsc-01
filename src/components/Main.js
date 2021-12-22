import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

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
              if (key === 0) return null;
              return (
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), "ether")} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    <button
                      name={product.id}
                      value={product.price}
                      disabled={!product.isForSelling || product.owner === this.props.account}
                      onClick={(event) => {
                        this.props.purchaseProduct(event.target.name, event.target.value)
                      }}
                    >
                        Comprar
                      </button>
                  </td>
                  <td>
                    {product.owner === this.props.account
                      ? <button
                        name={product.id}
                        value={product.price}
                        disabled={product.owner != this.props.account}
                        onClick={(event) => {
                          this.props.changeModal(true, product);
                        }}
                        >
                          Modificar Preço
                        </button>
                      : null
                    }
                  </td>
                  <td>
                    {product.isForSelling && product.owner === this.props.account
                      ? <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          this.props.changeProductStatusForSelling(event.target.name, false)
                        }}
                        >
                          Inativar
                        </button>
                      : null
                    }
                  </td>
                  <td>
                    {!product.isForSelling && product.owner === this.props.account
                      ? <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          this.props.changeProductStatusForSelling(event.target.name, true)
                        }}
                        >
                          Ativar
                        </button>
                      : null
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

          <Modal show={this.props.showModal} onHide={(event) => {
              this.props.changeModal(false, undefined);
          }}>
              <Modal.Header closeButton>
                  <Modal.Title>Alterar Produto</Modal.Title>
              </Modal.Header>
              <form  onSubmit={(event) => {
                  event.preventDefault()
                  const id = this.id.value
                  const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                  this.props.changeProductPrice(id, price)
                  this.props.changeModal(false, undefined);
              }}>
              <Modal.Body>
                  <div className="form-group mr-sm-2">
                      <input
                          value={this.props.productEdit !== undefined ? this.props.productEdit.id : undefined }
                          id="id"
                          type="text"
                          ref={(input) => { this.id = input }}
                          className="form-control"
                          placeholder="ID do produto"
                          readOnly/>
                  </div>
                      <div className="form-group mr-sm-2">
                          <input
                              value={this.props.productEdit !== undefined ? this.props.productEdit.name : undefined }
                              id="name"
                              type="text"
                              ref={(input) => { this.productName = input }}
                              className="form-control"
                              placeholder="Nome do produto"
                              readOnly/>
                      </div>
                      <div className="form-group mr-sm-2">
                          <input
                              defaultValue={this.props.productEdit !== undefined ? window.web3.utils.fromWei(this.props.productEdit.price.toString(), "ether")  : undefined }
                              id="price"
                              type="text"
                              ref={(input) => { this.productPrice = input }}
                              className="form-control"
                              placeholder="Preço do produto (em Ether)"
                              required />
                      </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button type="button" variant="secondary" onClick={(event) => {
                      this.props.changeModal(false, undefined);
                  }}>
                      Cancelar
                  </Button>
                  <Button type="submit" variant="primary" >
                      Salvar
                  </Button>
              </Modal.Footer>
              </form>
          </Modal>

        <p><a href="https://rinkeby.etherscan.io/address/0xF08e4acdDF14a0af4e17F2bc68E3A1b9659115b5" target="_blank">Informação do contrato</a></p>
      </div>
    );
  }
}

export default Main;
