import React from "react";
import moment from "moment";
import * as escrowMilestoneService from "../services/escrowMilestone.service";
import * as milestoneService from "../services/milestone.service";
import * as escrowTemplateService from "../services/escrowTemplate.service";
import {
  Modal,
  DropdownButton,
  MenuItem,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import MilestoneDocs from "./MilestoneDocs";

class EscrowMilestones extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      escrowMilestones: [],
      templates: [],
      milestones: [],
      isCompleted: false,
      showDocs: false,
      showMilestones: false,
      escrowId: this.props.escrowNum,
      milestone: [],
      milestoneId: "",
      name: "",
      milestoneStatus: "",
      template: "",
      status: "",
      days: "",
      relativeTo: ""
    };

    this.onChange = this.onChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.onApplyTemplate = this.onApplyTemplate.bind(this);
    this.statusChange = this.statusChange.bind(this);
    this.openDocs = this.openDocs.bind(this);
    this.closeDocs = this.closeDocs.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAddSelectedMilestone = this.onAddSelectedMilestone.bind(this);
  }

  componentDidMount() {
    let templates = [];
    let milestones = [];
    let escrowMilestones = [];

    escrowTemplateService
      .getAll()
      .then(resp => {
        templates = resp.item;
        return milestoneService.getAll();
      })
      .then(resp => {
        milestones = resp.items;
        return escrowMilestoneService.getByEscrowId(this.state.escrowId);
      })
      .then(resp => {
        escrowMilestones = resp.items.sort((a, b) => {
          return a.displayOrder - b.displayOrder;
        });
        this.setState({
          escrowMilestones: escrowMilestones,
          templates: templates,
          milestones: milestones
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  closeDocs() {
    this.setState({ showDocs: false });
  }

  openDocs(item) {
    this.setState({
      showDocs: true,
      milestoneId: item._id,
      name: item.milestoneName
    });
  }

  statusChange(escrowMilestone, value) {
    let date = "--";
    if (value === "Completed") {
      date = moment().format("ll");
    }

    escrowMilestone = {
      _id: escrowMilestone._id,
      status: value,
      completedDate: date
    };

    escrowMilestoneService
      .updateMilestoneStatus(escrowMilestone)
      .then(
        this.setState(prevState => {
          let oldEscrowMilestones = prevState.escrowMilestones.concat(); //create a copy of items
          const newEscrowMilestones = oldEscrowMilestones.map(item => {
            if (item._id === escrowMilestone._id) {
              item.status = escrowMilestone.status;
              item.actualDate = escrowMilestone.completedDate;
            }
            return item;
          });
          return {
            escrowMilestones: newEscrowMilestones
          };
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  onChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleToggle() {
    this.setState(prevState => ({
      isCompleted: !this.state.isCompleted
    }));
  }

  addMilestone() {
    this.setState({
      showMilestones: true
    });
  }

  onAddSelectedMilestone() {
    this.setState({
      showMilestones: false
    });

    const data = this.state.milestones.filter(item => {
      if (item._id === this.state.milestone) {
        item.openDate = this.props.escrowInfo.openDate;
        item.expectedCloseDate = this.props.escrowInfo.expectedCloseDate;
        item.days = this.state.days;
        item.relativeTo = this.state.relativeTo;
        item.escrowId = this.props.escrowNum;
        return true;
      }
      return false;
    });
    escrowMilestoneService
      .createMilestoneStatus(...data)
      .then(data => {
        console.log("Data Posted: ", data);
        this.setState(prevState => {
          let newEscrowMilestones = prevState.escrowMilestones.concat(
            data.item
          );
          return {
            escrowMilestones: newEscrowMilestones
          };
        });
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  onCancel() {
    this.setState({
      showMilestones: false
    });
  }

  onApplyTemplate(event) {
    const info = {
      templateId: this.state.template,
      escrowId: this.props.escrowNum
    };

    escrowTemplateService
      .getEscrowMilestonesFromTemplate(info)
      .then(data => {
        console.log("Get Template by Id: ", data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const templates = this.state.templates ? (
      this.state.templates.map(template => {
        return (
          <option key={template._id} value={template._id}>
            {template.name}
          </option>
        );
      })
    ) : (
      <div>Loading...</div>
    );

    const milestones = this.state.milestones ? (
      this.state.milestones.map(item => {
        return (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        );
      })
    ) : (
      <div>No Milestone</div>
    );

    const escrowMilestones = this.state.escrowMilestones ? (
      this.state.escrowMilestones.map(item => {
        if (this.state.isCompleted && item.status === "Completed") {
          return <React.Fragment key={item._id} />;
        } else if (!this.state.isCompleted && item.status === "Completed") {
          return (
            <React.Fragment key={item._id}>
              <tr className="success">
                <td>{item.milestoneName}</td>
                <td className="hidden-xs">
                  {item.expectedDate
                    ? moment(item.expectedDate).format("ll")
                    : "--"}
                </td>
                <td className="hidden-xs">
                  {/* {item.actualDate
                    ? moment(item.actualDate).format("ll")
                    : "--"} */}
                  {item.actualDate}
                </td>
                <td className="text-center">
                  <div className="btn-group">
                    <DropdownButton
                      bsStyle={"success"}
                      title={item.status}
                      id={item._id}
                    >
                      <MenuItem
                        eventKey="Pending"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Pending
                      </MenuItem>
                      <MenuItem
                        eventKey="Waiting"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Waiting
                      </MenuItem>
                      <MenuItem
                        eventKey="Completed"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Completed
                      </MenuItem>
                      <MenuItem
                        eventKey="N/A"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        N/A
                      </MenuItem>
                    </DropdownButton>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={e => this.openDocs(item, e)}
                  >
                    <i className="fa fa-fw fa-file-pdf-o" />
                  </button>
                </td>
                {/* <td className="hidden-md hidden-sm hidden-xs">
                  {item.milestones.responsibleRoles}
                </td> */}
              </tr>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={item._id}>
              <tr>
                <td>{item.milestoneName}</td>
                <td className="hidden-xs">
                  {item.expectedDate
                    ? moment(item.expectedDate).format("ll")
                    : "--"}
                </td>
                <td className="hidden-xs">
                  {/* {item.actualDate
                    ? moment(item.actualDate).format("ll")
                    : "--"} */}
                  {/* {item.actualDate} */}
                  {"--"}
                </td>
                <td className="text-center">
                  <div className="btn-group">
                    <DropdownButton
                      bsStyle={"default"}
                      title={item.status}
                      id={item._id}
                    >
                      <MenuItem
                        eventKey="Pending"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Pending
                      </MenuItem>
                      <MenuItem
                        eventKey="Waiting"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Waiting
                      </MenuItem>
                      <MenuItem
                        eventKey="Completed"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        Completed
                      </MenuItem>
                      <MenuItem
                        eventKey="N/A"
                        onSelect={this.statusChange.bind(this, item)}
                      >
                        N/A
                      </MenuItem>
                    </DropdownButton>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={e => this.openDocs(item, e)}
                  >
                    <i className="fa fa-fw fa-file-pdf-o" />
                  </button>
                </td>
                {/* <td className="hidden-md hidden-sm hidden-xs">
                  {item.milestones.responsibleRoles}
                </td> */}
              </tr>
            </React.Fragment>
          );
        }
      })
    ) : (
      <div>No Milestones</div>
    );

    return (
      <React.Fragment>
        <div className="container-fluid">
          <button
            onClick={this.addMilestone}
            className="btn btn-primary pull-right mb-2"
          >
            <i className="fa fa-road" /> {" Add new milestone"}
          </button>
          <form className="text-center" onSubmit={this.onApplyTemplate}>
            <label>
              <select
                name="template"
                id="template"
                value={this.state.value}
                onChange={this.onChange}
              >
                <option>Select Template</option>
                {templates}
              </select>
            </label>
            <input type="submit" value="Submit" />
          </form>
          <form className="smart-form">
            <div className="col-2">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="isCompleted"
                  id="isCompleted"
                  value={true}
                  checked={this.state.isCompleted}
                  onChange={this.onChange}
                  onClick={this.handleToggle}
                />
                <i />
                Hide Completed
              </label>
            </div>
          </form>
          <div className="row flexBox">
            <table
              id="dt_basic"
              className="table table-bordered table-hover"
              width="100%"
            >
              <thead>
                <tr>
                  <th>
                    <i className="fa fa-fw fa-road text-muted" /> Name
                  </th>
                  <th className="hidden-sm hidden-xs">
                    <i className="fa fa-fw fa-clock-o text-muted" /> Expected
                    Date
                  </th>
                  <th className="hidden-xs">
                    <i className="fa fa-fw fa-calendar text-muted" /> Completed
                    Date
                  </th>
                  <th className="text-center">
                    <i className="fa fa-fw fa-envelope text-muted" /> Status
                  </th>
                  <th className="text-center">
                    <i className="fa fa-fw fa-file-o text-muted" /> Docs
                  </th>
                  {/* <th className="hidden-md hidden-sm hidden-xs">
                    <i className="fa fa-fw fa-group text-muted" /> Responsible
                  </th> */}
                </tr>
              </thead>
              {this.state.escrowMilestones && <tbody>{escrowMilestones}</tbody>}
            </table>
          </div>
        </div>
        <Modal show={this.state.showDocs}>
          <div className="modal-body">
            <MilestoneDocs
              close={this.closeDocs}
              escrowId={this.props.escrowNum}
              milestoneId={this.state.milestoneId}
              name={this.state.name}
            />
          </div>
        </Modal>

        <Modal show={this.state.showMilestones} onCancel={this.onCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Add A Milestone</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Milestones</ControlLabel>
              <FormControl
                name="milestone"
                componentClass="select"
                placeholder="select"
                onChange={this.onChange}
              >
                <option>Select Milestone</option>
                {milestones}
              </FormControl>
              <FormControl
                name="days"
                type="text"
                onChange={this.onChange}
                placeholder="Number of Days"
              />
              <FormControl
                name="relativeTo"
                componentClass="select"
                placeholder="select"
                onChange={this.onChange}
              >
                <option>Relative To</option>
                <option>Open</option>
                <option>Close</option>
              </FormControl>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.onAddSelectedMilestone}>
              Add
            </Button>
            <Button bsStyle="warning" onClick={this.onCancel}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EscrowMilestones;
