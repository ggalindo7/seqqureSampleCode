import React, { Component } from "react";
import MilestoneForm from "./MilestoneForm";
import Ribbon from "../components/Ribbon";
import PageHeader from "../components/PageHeader";
import * as milestoneService from "../services/milestone.service";

class Milestones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };

    this.onAdd = this.onAdd.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    milestoneService
      .getAll()
      .then(data => {
        console.log(data);
        this.setState({
          items: data.items
        });
        console.log("Success", data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onSave(updatedFormData) {
    this.setState(prevState => {
      const existingItem = prevState.items.filter(item => {
        return item._id === updatedFormData._id;
      });
      let updatedItems = [];
      if (existingItem && existingItem.length > 0) {
        updatedItems = prevState.items.map(item => {
          return item._id === updatedFormData._id ? updatedFormData : item;
        });
      } else {
        updatedItems = prevState.items.concat(updatedFormData);
      }
      return {
        items: updatedItems,
        formData: null,
        errorMessage: null
      };
    });
  }

  onAdd() {
    this.setState({
      formData: {}
    });
  }

  onCancel() {
    this.setState({ formData: null });
  }

  onSelect(item, event) {
    event.preventDefault();
    this.setState({
      formData: item
    });
  }

  onDelete(formData) {
    this.setState(prevState => {
      const updatedItems = prevState.items.filter(item => {
        return item._id !== formData._id;
      });
      return { items: updatedItems, formData: null };
    });
  }

  render() {
    const tableData = this.state.items ? (
      this.state.items.map(item => {
        return (
          <React.Fragment key={item._id}>
            <tr style={{ cursor: "pointer" }}>
              <td onClick={e => this.onSelect(item, e)}>{item.name}</td>
            </tr>
          </React.Fragment>
        );
      })
    ) : (
      <div>Loading...</div>
    );

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Milestones", "View/Edit Milestones"]} />
        <PageHeader
          iconClasses="fa fa-lg fa-fw fa-road"
          title="Milestones"
          subtitle="View, Create and Edit"
        />
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <i className="fa fa-fw fa-road" /> Milestone Types
                  <button
                    type="button"
                    className="btn btn-warning btn-xs pull-right"
                    onClick={this.onAdd}
                  >
                    Add New
                  </button>
                </div>
                <div className="widget-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                      <tbody>{tableData}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {this.state.formData && (
              <div className="col col-sm-5">
                <MilestoneForm
                  formData={this.state.formData}
                  onSave={this.onSave}
                  onCancel={this.onCancel}
                  onDelete={this.onDelete}
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Milestones;
/////////////////////////////////////////////////////////////////////
// TO DO: Delete does not work right after a post, must refresh first.
// TO DO: Validation
// TO DO: Bootstrap so that on smaller screen, pushes form to top if open
// TO DO: Repopulate multi-select box on edit
