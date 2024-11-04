import React from "react";
import "./Dropdown.css";

function Dropdown({ groupBy, orderBy, setGroupBy, setOrderBy }) {
  return (
    <div className="dropdown-card">
      <label>
        Group By:
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>
      </label>
      <label>
        Order By:
        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </label>
    </div>
  );
}

export default Dropdown;
