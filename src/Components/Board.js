import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Board.css";
import menuIcon from "../assests/icons_FEtask/3_dot_menu.svg";
import display from "../assests/icons_FEtask/Display.svg";
import add from "../assests/icons_FEtask/add.svg";
import Dropdown from "./Dropdown";

// Import SVGs dynamically based on the title
const importLogo = (title) => {
  try {
    return require(`../assests/icons_FEtask/${title}.svg`);
  } catch (error) {
    console.error(`Logo for ${title} not found`);
    return null; // Return null if the image is not found
  }
};

function Board() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [groupBy, setGroupBy] = useState(
    () => localStorage.getItem("groupBy") || "status"
  );
  const [orderBy, setOrderBy] = useState(
    () => localStorage.getItem("orderBy") || "priority"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        setTickets(
          Array.isArray(response.data.tickets) ? response.data.tickets : []
        );
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTickets([]);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("orderBy", orderBy);
  }, [groupBy, orderBy]);

  const groupTickets = () => {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return [];
    }

    const priorityLabels = ["No priority", "Low", "Medium", "High", "Urgent"];

    const grouped = tickets.reduce((acc, ticket) => {
      let key;
      if (groupBy === "user") {
        const user = users.find((user) => user.id === ticket.userId);
        key = user ? user.name : "Unknown User";
      } else if (groupBy === "priority") {
        key = priorityLabels[ticket.priority] || "Unknown Priority";
      } else {
        key = ticket[groupBy] || "Unspecified";
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      title: key,
      tickets: grouped[key].sort((a, b) => {
        if (orderBy === "priority") {
          return b.priority - a.priority;
        } else if (orderBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      }),
    }));
  };

  const ticketGroups = groupTickets();

  return (
    <div className="kanban-container">
      <div
        className="controls"
        style={{ position: "relative" }}
      >
        <img onClick={() => setDisplayMenu((prev) => !prev)} src={display} alt="Display Icon" />
        <p>Display</p>
        {displayMenu && (
          <Dropdown
            groupBy={groupBy}
            orderBy={orderBy}
            setGroupBy={setGroupBy}
            setOrderBy={setOrderBy}
          />
        )}
      </div>
      <div className="kanban-board">
        {ticketGroups.length > 0 ? (
          ticketGroups.map((group, index) => {
            const logo = importLogo(group.title);
            console.log(logo);
            return (
              <div key={index} className="kanban-column">
                <div className="kanban-heading">
                <div className="title-container">
                  {logo && (
                    <img
                      src={logo}
                      alt={`${group.title} logo`}
                      className="title-logo"
                    />
                  )}
                  <h2>{group.title}</h2>
                </div>
                <div className="title-menu">
                <img src={menuIcon} />
                <img src={add} />
                </div>
                </div>
                {group.tickets.map((ticket) => {
                  const user = users.find((user) => user.id === ticket.userId);
                  return (
                    <div key={ticket.id} className="kanban-card">
                      <p>{ticket.id}</p>
                      <h3>{ticket.title}</h3>
                      <img src={menuIcon} alt="Menu Icon" />
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p>No tickets available</p>
        )}
      </div>
    </div>
  );
}

export default Board;
