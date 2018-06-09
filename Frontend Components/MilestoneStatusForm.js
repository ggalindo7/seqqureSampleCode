import React from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";

import * as milestoneService from "../services/milestone.service";

class MilestoneStatusForm extends React.Component {
  constructor(props) {
    super(props);

    const formData = this.propsToformData(props);

    this.state = {
      formData: formData,
      selectedOption: ""
    };

    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  propsToformData(nextProps) {
    const milestone =
      nextProps.formData && nextProps.formData._id ? nextProps.formData : {};

    const item = {
      _id: milestone._id,
      escrowId: milestone.escrowId || "",
      name: milestone.name || "",
      relativeDays: milestone.relativeDays || "",
      tiedTo: milestone.tiedTo || "",
      milestoneStatus: milestone.milestoneStatus || "",
      responsible: milestone.responsible || "",
      expectedDate: milestone.expectedDate || "",
      completedDate: milestone.completedDate || ""
    };
    return item;
  }

  componentWillReceiveProps(nextProps) {
    const formData = this.propsToformData(nextProps);
    this.setState(prevState => {
      return {
        formData: formData
      };
    });
  }

  onChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState(prevState => {
      const formData = { ...prevState.formData, [name]: value };

      return { formData: formData };
    });
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Selected Object: ${selectedOption}`);
  };

  onSave(event) {
    const that = this;

    const milestone = {
      _id: this.state.formData._id,
      escrowId: this.props.escrowId,
      name: this.state.formData.name,
      relativeDays: this.state.formData.relativeDays,
      tiedTo: this.state.formData.tiedTo,
      milestoneStatus: this.state.formData.milestoneStatus,
      responsible: this.state.selectedOption,
      expectedDate: this.state.formData.expectedDate,
      completedDate: this.state.formData.completedDate
    };

    if (this.state.formData._id) {
      milestoneService
        .updateMilestoneStatus(milestone)
        .then(data => {
          console.log(data);
          that.props.onSave(milestone);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      milestoneService
        .createMilestoneStatus(milestone)
        .then(data => {
          console.log(data);
          // Modify state to reflect assigned id value
          this.setState(prevState => {
            const formData = { ...prevState.formData, _id: data };
            return { ...prevState, formData: formData };
          });

          that.props.onSave({ ...milestone, _id: data });
        })
        .catch(error => console.log(error));
    }
  }

  onCancel(event) {
    this.props.onCancel();
  }

  onDelete(formData, event) {
    milestoneService
      .delMilestoneStatus(formData._id)
      .then(() => {
        console.log("Deleted");
        this.props.onDelete(this.state.formData);
      })
      .catch(() => console.log("Did not delete"));
  }

  render() {
    const { selectedOption } = this.state;
    // const value = selectedOption && selectedOption.value;

    return (
      <React.Fragment>
        <form id="review-form" className="smart-form">
          <header>Create / Edit Milestone</header>

          <fieldset>
            <section>
              <label className="label">Responsible:</label>
              <Select
                // joinValues={true}
                placeholder=""
                multi={true}
                simpleValue={true}
                name="responsible"
                id="responsible"
                value={selectedOption}
                onChange={this.handleChange}
                options={[
                  { value: "Escrow", label: "Escrow" },
                  { value: "Buyer", label: "Buyer" },
                  { value: "Seller", label: "Seller" },
                  { value: "Listing Agent", label: "Listing Agent" },
                  { value: "Selling Agent", label: "Selling Agent" },
                  { value: "Title  Company", label: "Title Company" },
                  { value: "Lender", label: "Lender" },
                  { value: "Other", label: "Other" }
                ]}
              />
            </section>

            <section>
              <label className="label">Milestone Status:</label>
              <label className="input">
                {" "}
                <select
                  name="milestoneStatus"
                  id="milestoneStatus"
                  value={this.state.value}
                  onChange={this.onChange}
                  // defaultValue="New"
                >
                  <option value="">Please Select Status</option>
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Completed">Completed</option>
                  <option value="N/A">N/A</option>
                </select>
              </label>
            </section>

            {/* <section>
              <label className="label">Milestone Name:</label>
              <label className="input">
                {" "}
                <i className="icon-append fa fa-file-text-o" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.formData.name}
                  onChange={this.onChange}
                />
              </label>
            </section> */}

            {/* <section>
              <label className="label">Relative Days:</label>
              <label className="input">
                {" "}
                <i className="icon-append fa fa-reorder" />
                <input
                  type="text"
                  name="relativeDays"
                  id="relativeDays"
                  value={this.state.formData.relativeDays}
                  onChange={this.onChange}
                />
              </label>
            </section> */}
          </fieldset>
          <footer>
            <button
              type="button"
              onClick={this.onSave}
              className="btn btn-primary btn-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={this.onCancel}
              className="btn btn-default btn-sm float-right"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => this.onDelete(this.state.formData)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </footer>
        </form>
      </React.Fragment>
    );
  }
}

export default MilestoneStatusForm;

// {
//   /* <section>
//               <label className="label">Tied To:</label>
//               <label className="input">
//                 {" "}
//                 <i className="icon-append fa fa-reorder" />
//                 <input
//                   type="text"
//                   name="tiedTo"
//                   id="tiedTo"
//                   value={this.state.formData.tiedTo}
//                   onChange={this.onChange}
//                 />
//               </label>
//             </section> */
// }

// {
//   /* <section>
//               <label className="label">Completed Date:</label>
//               <label className="input">
//                 {" "}
//                 <i className="icon-append fa fa-reorder" />
//                 <input
//                   type="text"
//                   name="completedDate"
//                   id="completedDate"
//                   value={this.state.formData.completedDate}
//                   onChange={this.onChange}
//                 />
//               </label>
//             </section> */
// }

// {
//   /* <section>
//               <label className="label">Expected Date:</label>
//               <label className="input">
//                 {" "}
//                 <i className="icon-append fa fa-reorder" />
//                 <input
//                   type="text"
//                   name="expectedDate"
//                   id="expectedDate"
//                   value={this.state.formData.expectedDate}
//                   onChange={this.onChange}
//                 />
//               </label>
//             </section> */
// }

// {
//   /* <section>
//               <label className="label">Milestone Status:</label>
//               <Select
//                 placeholder=""
//                 simpleValue={true}
//                 name="milestoneStatus"
//                 id="milestoneStatus"
//                 value={value}
//                 onChange={this.handleChange}
//                 options={[
//                   { value: "New", label: "New" },
//                   { value: "Pending", label: "Pending" },
//                   { value: "Waiting", label: "Waiting" },
//                   { value: "Completed", label: "Completed" },
//                   { value: "N/A", label: "N/A" }
//                 ]}
//               />
//             </section> */
// }

// {
//   /* <section>
//               <label className="label">Responsible For Milestone:</label>
//               <label className="input">
//                 {" "}
//                 <i className="icon-append fa fa-institution" />
//                 <input
//                   type="text"
//                   name="responsible"
//                   id="responsible"
//                   value={this.state.formData.responsible}
//                   onChange={this.onChange}
//                 />
//               </label>
//             </section> */
// }
