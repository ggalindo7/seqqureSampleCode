import React, { Component } from "react";
import MilestoneStatusForm from "./MilestoneStatusForm";
import Ribbon from "../components/Ribbon";
import * as escrowMilestoneService from "../services/escrowMilestone.service";

class MilestoneStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  componentDidMount() {
    escrowMilestoneService
      .getMilestoneStatus()
      .then(data => {
        console.log(data);
        this.setState({
          items: data.items.sort((a, b) => {
            return a.milestoneId - b.milestoneId;
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onSave(updatedformData) {
    this.setState(prevState => {
      const existingItem = prevState.items.filter(item => {
        return item._id === updatedformData._id;
      });
      let updatedItems = [];
      if (existingItem && existingItem.length > 0) {
        updatedItems = prevState.items.map(item => {
          return item._id === updatedformData._id ? updatedformData : item;
        });
      } else {
        updatedItems = prevState.items.concat(updatedformData);
      }
      return {
        items: updatedItems,
        formData: null,
        errorMessage: null
      };
    });
  }

  onCancel() {
    this.setState({ formData: null });
  }

  onAdd() {
    this.setState({
      formData: {}
    });
  }

  onSelect(item, event) {
    event.preventDefault();
    this.setState({
      formData: item
    });
  }

  render() {
    const milestoneData = this.state.items ? (
      this.state.items.map(item => {
        return (
          <div key={item._id}>
            <div>Tenant Id: {item.tenantId}</div>
            <div>Escrow Id: {item.escrowId}</div>
            <div>Milestone Id: {item.milestoneId}</div>
            <div>Created By Id: {item.createdById}</div>
            <div>Relative Days: {item.relativeDays}</div>
            <div>Tied To: {item.tiedTo}</div>
            <div>Milestone Status: {item.milestoneStatus}</div>
            <div>Status History: {item.statusHistory}</div>
            <div>Expected Date: {item.expectedDate}</div>
            <div>Completed Date: {item.completedDate}</div>
            <button
              type="button"
              className="btn btn-primary btn-xs"
              onClick={this.onSelect.bind(this, item)}
            >
              <i className="fa fa-pencil" />
            </button>
          </div>
        );
      })
    ) : (
      <div>Loading...</div>
    );

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Milestones", "Milestone Status"]} />

        <div className="row">
          <div className="col col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                Milestones
                <button
                  type="button"
                  className="btn btn-primary btn-xs pull-right "
                  onClick={this.onAdd}
                >
                  Add New Milestone
                </button>
              </div>
              <div className="panel-body">
                {this.state.items && milestoneData}
              </div>
            </div>
          </div>
          {this.state.formData && (
            <div className="col col-sm-6">
              <div className="panel panel-default">
                <div className="panel-heading">Create / Edit Milestone</div>
                <div className="panel-body">
                  <MilestoneStatusForm
                    formData={this.state.formData}
                    onDelete={this.onDelete}
                    onCancel={this.onCancel}
                    onSave={this.onSave}
                    notify={this.props.notify}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default MilestoneStatus;
