import React from "react";
import FormPanel from "../components/FormPanel";
import Select from "react-select";
import "react-select/dist/react-select.css";

import * as milestoneService from "../services/milestone.service";
import * as securityRoleService from "../services/security.service";
import * as documentTypeService from "../services/documentType.service";

class MilestoneForm extends React.Component {
  constructor(props) {
    super(props);

    const formData = this.propsToFormData(props);

    this.state = {
      formData: formData,
      securityRoles: [],
      documentTypes: []
    };

    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    let securityRoles = [];
    let documentTypes = [];
    const that = this;
    securityRoleService
      .readAll()
      .then(response => {
        securityRoles = response.items;
        return documentTypeService.getAll();
      })
      .then(response => {
        documentTypes = response.items;
        if (that.state.formData._id) {
          return milestoneService.getById(that.state.formData._id);
        } else {
          return Promise.resolve(null);
        }
      })
      .then(response => {
        that.setState(prevState => {
          const formData = response
            ? that.propsToFormData({ formData: response.item })
            : prevState.formData;
          return { securityRoles, documentTypes, formData };
        });
      });
  }

  propsToFormData(nextProps) {
    const milestone =
      nextProps.formData && nextProps.formData._id ? nextProps.formData : {};

    const item = {
      _id: milestone._id,
      code: milestone.code || "",
      name: milestone.name || "",
      displayOrder: milestone.displayOrder || "",
      description: milestone.description || "",
      isObsolete: !!milestone.isObsolete,
      documentTypeId: milestone.documentTypeId || "",
      responsibleSecurityRoleIds: milestone.responsibleSecurityRoleIds
        ? milestone.responsibleSecurityRoleIds.join(",")
        : "",
      viewSecurityRoleIds: milestone.viewSecurityRoleIds
        ? milestone.viewSecurityRoleIds.join(",")
        : ""
    };
    return item;
  }

  componentWillReceiveProps(nextProps) {
    const formData = this.propsToFormData(nextProps);
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

  handleResponsibleChange = responsibleSecurityRoleIds => {
    this.setState(prevState => {
      const newFormData = prevState.formData;
      newFormData.responsibleSecurityRoleIds = responsibleSecurityRoleIds;
      return { formData: newFormData };
    });
  };

  handleViewChange = viewSecurityRoleIds => {
    this.setState(prevState => {
      const newFormData = prevState.formData;
      newFormData.viewSecurityRoleIds = viewSecurityRoleIds;
      return { formData: newFormData };
    });
  };

  onSave(event) {
    const that = this;

    const milestone = {
      _id: this.state.formData._id,
      code: this.state.formData.code,
      name: this.state.formData.name,
      displayOrder: this.state.formData.displayOrder,
      description: this.state.formData.description,
      isObsolete: this.state.formData.isObsolete,
      documentTypeId: this.state.formData.documentTypeId,
      responsibleSecurityRoleIds: this.state.formData.responsibleSecurityRoleIds
        ? this.state.formData.responsibleSecurityRoleIds.split(",")
        : [],
      viewSecurityRoleIds: this.state.formData.viewSecurityRoleIds
        ? this.state.formData.viewSecurityRoleIds.split(",")
        : []
    };

    if (this.state.formData._id) {
      milestoneService
        .update(milestone)
        .then(data => {
          console.log(data);
          that.props.onSave(milestone);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      milestoneService
        .create(milestone)
        .then(data => {
          console.log(data);
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

  render() {
    const title = (
      <span>
        <i className="fa fa-fw fa-road" /> Create / Edit Milestone
      </span>
    );
    const securityRoleOptions = this.state.securityRoles.map(opt => {
      return { value: opt._id, label: opt.name };
    });

    const documentTypeOptions = this.state.documentTypes.map(dt => {
      return (
        <option key={dt._id} value={dt._id}>
          {dt.docuName}
        </option>
      );
    });

    return (
      <React.Fragment>
        <FormPanel title={title}>
          <form className="smart-form">
            <fieldset>
              <section>
                <label className="label">Code:</label>
                <label className="input">
                  {" "}
                  <i className="icon-append fa fa-rebel" />
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={this.state.formData.code}
                    onChange={this.onChange}
                  />
                </label>
              </section>

              <section>
                <label className="label">Name:</label>
                <label className="input">
                  {" "}
                  <i className="icon-append fa fa-user" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={this.state.formData.name}
                    onChange={this.onChange}
                  />
                </label>
              </section>

              <section>
                <label className="label">Description:</label>
                <label className="input">
                  {" "}
                  <i className="icon-append fa fa-file-text-o" />
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={this.state.formData.description}
                    onChange={this.onChange}
                  />
                </label>
              </section>

              <section>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isObsolete"
                    id="isObsolete"
                    value={true}
                    checked={this.state.formData.isObsolete}
                    onChange={this.onChange}
                  />
                  <i />Obsolete
                </label>
              </section>

              <section>
                <label className="label">Display Order:</label>
                <label className="input">
                  {" "}
                  <i className="icon-append fa fa-reorder" />
                  <input
                    type="number"
                    name="displayOrder"
                    id="displayOrder"
                    value={this.state.formData.displayOrder}
                    onChange={this.onChange}
                  />
                </label>
              </section>
              <section>
                <label className="label">Document Type:</label>
                <select
                  placeholder=""
                  name="documentTypeId"
                  value={this.state.formData.documentTypeId}
                  onChange={this.onChange}
                >
                  {documentTypeOptions}
                </select>
              </section>
              <section>
                <label className="label">Responsible:</label>
                <Select
                  // joinValues={true}
                  placeholder=""
                  multi={true}
                  simpleValue={true}
                  name="responsibleSecurityRoleIds"
                  id="responsibleSecurityRoleIds"
                  value={this.state.formData.responsibleSecurityRoleIds}
                  onChange={this.handleResponsibleChange}
                  options={securityRoleOptions}
                />
              </section>
              <section>
                <label className="label">View:</label>
                <Select
                  // joinValues={true}
                  placeholder=""
                  multi={true}
                  simpleValue={true}
                  name="viewSecurityRoleIds"
                  id="viewSecurityRoleIds"
                  value={this.state.formData.viewSecurityRoleIds}
                  onChange={this.handleViewChange}
                  options={securityRoleOptions}
                />
              </section>
            </fieldset>
            <div className="btn-group pull-right" role="group">
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
                className="btn btn-warning btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormPanel>
      </React.Fragment>
    );
  }
}

export default MilestoneForm;
