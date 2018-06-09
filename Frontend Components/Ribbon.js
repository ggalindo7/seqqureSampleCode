import React from "react";
import { NavLink } from "react-router-dom";

const Ribbon = props => {
  const paths = props.breadcrumbArray.map(item => {
    return <li key={item}>{item}</li>;
  });

  return (
    <div id="ribbon" className="container-fluid">
      <ol className="breadcrumb">
        <li style={this.menuItemStyle}>
          <NavLink
            to="/"
            style={this.navLinkStyle}
            activeStyle={this.activeNavLinkStyle}
          >
            Home
          </NavLink>
        </li>
        {paths}
      </ol>
    </div>
  );
};

export default Ribbon;
