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
    };
    this.haveLabel = false;
    this.haveDueDate = false;
    this.allMembers = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.createCard = this.createCard.bind(this);
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

  handleChange(event) {
    // setting the state from user input
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val });
  }

  handleRadioChange(event) {
    var memberId = event.target.value;
    console.log(memberId);
    console.log(event.target.checked);
    if (!this.state.selectedMembers.includes(memberId)) {
      this.state.selectedMembers.push(memberId);
    } else {
      var arr = [...this.state.selectedMembers];
      var index = arr.indexOf(memberId);
      if (index > -1) {
        arr.splice(index, 1);
      }
      this.setState({ selectedMembers: arr });
    }
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
    var members = this.state.selectedMembers;
    console.log(members);
    console.log(label);

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
              <p>(Who should be on this task?)</p>
              {this.state.allMembers.map((item, index) => {
                return (
                  <div className="radio">
                    <label>
                      <input
                        className="radio-options"
                        type="radio"
                        value={item.id}
                        name={"radio" + index}
                        onChange={this.handleRadioChange}
                      />
                      <h4 className="radio-text">{item.fullName}</h4>
                    </label>
                  </div>
                );
              })}
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
