import * as React from "react";
import * as functions from "../functions/functions";
import axios from "axios";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.functions = functions;
    this.state = {
      title: "",
      description: "",
      label: [],
      dueDate: "",
      pos: "",
      allMembers: [],
      selectedMembers: [],
      searchMembers: [],
    };
    this.haveLabel = false;
    this.haveDueDate = false;
    this.allMembers = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.createCard = this.createCard.bind(this);
    this.search = this.search.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.reset = this.reset.bind(this);
    this.removeCurrent = this.removeCurrent.bind(this);
  }

  componentDidMount() {
    axios
      .get(
        `https://api.trello.com/1/boards/${process.env.REACT_APP_BOARD_ID}/members?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
      )
      .then((response) => {
        this.setState({ allMembers: response.data });
      });
  }

  search(param) {
    var loparam = param.toLowerCase();
    var arr = [...this.state.allMembers];

    var data = arr.filter(function (item) {
      return item.fullName.toLowerCase().includes(loparam);
    });

    this.setState({ searchMembers: data });
  }

  reset() {
    this.setState({ searchMembers: [] });
  }

  handleSearchChange(event) {
    if (event.target.value.length > 0) {
      this.search(event.target.value);
    }
    if (event.target.value.length === 0) {
      this.setState({ searchMembers: [] });
    }
  }

  handleChange(event) {
    // setting the state from user input
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val });
  }

  // todo make sure calling api works and the else statement also works for deleting

  handleRadioChange(event) {
    console.log("clicked");
    event.preventDefault();
    var memberId = event.target.value;
    var name = event.target.name;
    var arr = [...this.state.selectedMembers];
    console.log(name, memberId);
    if (arr.length === 0) {
      arr.push({ fullName: name, id: memberId });
    }
    if (arr.length > 0) {
      for (let i of arr) {
        console.log(i);
        if (i.id.includes(memberId) === false) {
          console.log("added");
          arr.push({ fullName: name, id: memberId });
        } else {
        }
      }
    }
    this.setState({ selectedMembers: arr });
    console.log(this.state.selectedMembers, "selected members state");
  }

  removeCurrent(event) {
    var memberId = event.target.value;
    var arr = [...this.state.selectedMembers];
    for (let i of arr) {
      if (i.id.includes(memberId)) {
        var index = arr.indexOf(i);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({ selectedMembers: arr });
      }
    }
    console.log(this.state.selectedMembers);
  }

  handleSubmit(event) {
    event.preventDefault();
    // conditions to set the required business logic
    if (this.state.title.includes("DEV")) {
      this.haveLabel = true;
      this.state.label.push("DEV");
    }
    if (this.state.title.includes("QA")) {
      this.haveDueDate = true;
    }
    if (!this.state.title.includes("DEV") && !this.state.title.includes("QA")) {
      this.haveLabel = true;
      this.state.label.push("general");
    }

    console.log("have due date?", this.haveDueDate);
    console.log("have label?", this.haveLabel);

    this.createCard();
  }

  // calling different create cards route depending on business logic
  createCard() {
    var title = this.state.title;
    var description = this.state.description;
    var label = this.state.label;
    var pos = this.state.pos;
    var membersArr = [...this.state.selectedMembers];
    var members = [];
    console.log(members);
    console.log(label);

    for (let i of membersArr) {
      members.push(i.id);
    }
    // we will use the below route if there are no due date
    if (this.haveLabel === true && this.haveDueDate === false) {
      this.functions.createCardsWithOnlyLabel(
        title,
        description,
        label,
        pos,
        members
      );
    }
    // we will use the below route if there are both due dates and labels
    if (this.haveLabel === true && this.haveDueDate === true) {
      // Create new Date instance
      var date = new Date();
      // Add a day
      date.setDate(date.getDate() + 1).toString();
      this.functions.createCardsWithAll(
        title,
        description,
        date,
        label,
        pos,
        members
      );
    }
    // we will use the below route if there are no labels
    if (this.haveLabel === false && this.haveDueDate === true) {
      // Create new Date instance
      var date = new Date();
      // Add a day
      date.setDate(date.getDate() + 1).toString();
      this.functions.createCardsWithOnlyDueDate(
        title,
        description,
        date,
        pos,
        members
      );
    }
  }

  render() {
    this.functions.getCards();
    // the submit button is enabled if title and description are not empty
    const isEnabled =
      this.state.title.length > 0 && this.state.description.length > 0;
    return (
      <>
        <div>
          <form onSubmit={this.handleSubmit} id="form-body">
            <label className="form-labels">
              <h5>Title:</h5>
              <p>(max. 50 characters)</p>
              <div className="input-body">
                <input
                  className="input-textfield"
                  type="text"
                  name="title"
                  maxlength="50"
                  onChange={this.handleChange}
                />
                <p className="remaining-characters-tag">
                  (remaining: {50 - this.state.title.length} characters)
                </p>
              </div>
            </label>
            <label className="form-labels">
              <h5>Description:</h5>
              <p>(max. 200 characters)</p>
              <div className="input-body">
                <textarea
                  type="text"
                  name="description"
                  maxlength="200"
                  rows="5"
                  onChange={this.handleChange}
                />
                <p className="remaining-characters-tag">
                  (remaining: {200 - this.state.description.length} characters)
                </p>
              </div>
            </label>
            <label className="form-labels">
              <h5>Priority:</h5>
              <p>(How urgent is this task?)</p>
              <select type="text" name="pos" onChange={this.handleChange}>
                <option value="0">(select)</option>
                <option value="top">High</option>
                <option value="5">Medium</option>
                <option value="bottom">Low</option>
              </select>
            </label>
            <label className="form-labels">
              <h5>Add members:</h5>
              <p>(Who should be on this team?)</p>
              <div className="input-body-search">
                <input
                  className="input-textfield"
                  id="search-bar"
                  type="text"
                  name="title"
                  maxlength="50"
                  onChange={this.handleSearchChange}
                />
                {this.state.searchMembers.map((item, index) => {
                  return (
                    <>
                      <button
                        className="button-options"
                        type="button"
                        value={item.id}
                        name={item.fullName}
                        onClick={this.handleRadioChange}
                      >
                        {item.fullName}
                      </button>
                    </>
                  );
                })}
                <h5>Current Members:</h5>
                {this.state.selectedMembers.map((item, index) => {
                  console.log(item, "these are the members");
                  return (
                    <>
                      <div className="current-members-flex">
                        <p className="radio-text">{item.fullName}</p>
                        <button
                          type="button"
                          className="current-members-button"
                          value={item.id}
                          name={item.fullName}
                          onClick={this.removeCurrent}
                        >
                          remove
                        </button>
                      </div>
                    </>
                  );
                })}
              </div>
            </label>
            <input
              id={
                !isEnabled ? "submit-button-disabled" : "submit-button-enabled"
              }
              type="submit"
              value="Submit"
              disabled={!isEnabled}
            />
          </form>
        </div>
      </>
    );
  }
}

export default Form;
