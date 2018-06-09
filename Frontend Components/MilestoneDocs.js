import React from "react";
import DocumentForm from "../components/documents.form";
import { Modal } from "react-bootstrap";

import * as ajax from "../services/documents.service";

class MilestoneDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showForm: false,
      showDocs: false
    };

    this.closeDocs = this.closeDocs.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.showForm = this.showForm.bind(this);
  }

  componentDidMount() {
    ajax
      .getByMilestoneId(this.props.milestoneId)
      .then(data => {
        this.setState({
          items: data.item
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  closeDocs() {
    this.props.close();
  }

  closeForm() {
    this.setState({ showForm: false });
  }

  showForm() {
    this.setState({
      showForm: true
    });
    // this.props.close();
  }

  render() {
    const docs = this.state.items.map(doc => {
      return (
        <React.Fragment key={doc._id}>
          <hr />
          <h4>Name: {doc.docName}</h4>
          <h4>Type: {doc.docType}</h4>
          <h4>Description: {doc.description}</h4>
          <hr />
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        <h2>Submitted Documents For {this.props.name}</h2>
        <div>{docs}</div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.showForm}
        >
          Add Doc
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={this.closeDocs}
        >
          Close
        </button>
        <Modal show={this.state.showForm}>
          <div className="modal-body">
            <div>
              <DocumentForm
                escrowId={this.props.escrowId}
                reset={this.closeForm}
                milestoneId={this.props.milestoneId}
              />
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default MilestoneDocs;
