import axios from "axios";

const devId = "5eb79eef7669b225494bc374";
const genId = "5eb79eef7669b225494bc378";

export function getBoard() {
  return axios
    .get(
      `https://api.trello.com/1/members/me/boards?fields=name,url&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      console.log("board", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getList() {
  return axios
    .get(
      `https://api.trello.com/1/boards/${process.env.REACT_APP_BOARD_ID}/lists?&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      console.log("lists", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getCards() {
  return axios
    .get(
      `https://api.trello.com/1/lists/${process.env.REACT_APP_TODO_ID}/cards?&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      // console.log(response.data);
      // for (let i of response.data) {
      //   console.log(i.id);
      //   deleteCard(i.id);
      // }
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getLabels() {
  return axios
    .get(
      `https://api.trello.com/1/boards/${process.env.REACT_APP_BOARD_ID}/labels?&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      //   console.log("labels", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function deleteCard(cardId) {
  //   console.log("ran");
  return axios
    .delete(
      `https://api.trello.com/1/cards/${cardId}?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getMembers(cardId) {
  return axios
    .get(
      `https://api.trello.com/1/cards/${cardId}/members?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      console.log("members", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getMembersOfBoard() {
  return axios
    .get(
      `https://api.trello.com/1/boards/${process.env.REACT_APP_BOARD_ID}/members?key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`
    )
    .then(function (response) {
      console.log("members of board -->", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function createCardsWithOnlyDueDate(
  title,
  description,
  dueDate,
  pos,
  members
) {
  return axios
    .post(
      `https://api.trello.com/1/cards?idList=${process.env.REACT_APP_TODO_ID}&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`,
      {
        name: title,
        desc: description,
        due: dueDate,
        pos: pos,
        idMembers: members,
      }
    )
    .then(function (response) {
      console.log(response);
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function createCardsWithOnlyLabel(
  title,
  description,
  label,
  pos,
  members
) {
  let labelIDs = label.map((item) => {
    if (item === "DEV") {
      return devId;
    }
    if (item === "general") {
      return genId;
    }
  });
  return axios
    .post(
      `https://api.trello.com/1/cards?idList=${process.env.REACT_APP_TODO_ID}&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`,
      {
        name: title,
        desc: description,
        idLabels: labelIDs,
        pos: pos,
        idMembers: members,
      }
    )
    .then(function (response) {
      console.log(response);
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function createCardsWithAll(
  title,
  description,
  dueDate,
  label,
  pos,
  members
) {
  let labelIDs = label.map((item) => {
    if (item === "DEV") {
      return devId;
    }
    if (item === "general") {
      return genId;
    }
  });
  return axios
    .post(
      `https://api.trello.com/1/cards?idList=${process.env.REACT_APP_TODO_ID}&key=${process.env.REACT_APP_API_KEY}&token=${process.env.REACT_APP_API_TOKEN}`,
      {
        name: title,
        desc: description,
        due: dueDate,
        idLabels: labelIDs,
        pos: pos,
        idMembers: members,
      }
    )
    .then(function (response) {
      console.log(response);
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
