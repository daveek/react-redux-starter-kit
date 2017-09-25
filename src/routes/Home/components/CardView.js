import React from "react";
import "./HomeView.scss";

var axios = require("axios");

export const Card = props => {
  return (
    <div style={{ margin: "1em" }}>
      <img width="75" src={props.avatar_url} />
      <div style={{ display: "inline-block", marginLeft: 10 }}>
        <div style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          {props.name}
        </div>
        <div> {props.company} </div>
      </div>
    </div>
  );
};

export const Cardlist = props => {
  return <div>{props.cards.map(card => <Card key={card.id} {...card} />)}</div>;
};

export class Form extends React.Component {
  state = { userName: "" };
  handleSubmit = event => {
    event.preventDefault();
    //console.log('Something submitted ', this.state.userName);
    //Ajax call for fetch usuers in github
    axios
      .get(`https://api.github.com/users/${this.state.userName}`)
      .then(resp => {
        //console.log(resp);
        this.props.onSubmit(resp.data);
        this.setState({ userName: "" });
      });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.userName}
          onChange={event => this.setState({ userName: event.target.value })}
          placeholder="Git Name"
          required
        />
        <button type="submit">Add Card</button>
      </form>
    );
  }
}

export class CardView extends React.Component {
  state = {
    cards: []
  };

  addNewCard = cardInfo => {
    //console.log(cardInfo);
    this.setState(prevState => ({
      cards: prevState.cards.concat(cardInfo)
    }));
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.addNewCard} />
        <Cardlist cards={this.state.cards} />
      </div>
    );
  }
}

export default CardView;
//ReactDOM.render(<App />, mountNode);
