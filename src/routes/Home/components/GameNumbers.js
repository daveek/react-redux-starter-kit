import React from "react";
import _ from 'lodash';
import "./HomeView.scss";


export const Stars = (props) => {
  return (
  	<div className="col-5">
  	  {_.range(props.numOfStars).map(i =>
      	<i key={i} className="fa fa-star"></i>
      )}
  	</div>
  );
};

export const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
  	case true:
    	button = 
      	<button className="btn btn-success" onClick={props.acceptAnswer} >
      		<i className="fa fa-check"></i>
      	</button>
      break;
    case false:
    	button = 
      	<button className="btn btn-danger">
      		<i className="fa fa-times"></i>
      	</button>
      break;
    default:
    	button =
				<button className="btn" 
        				onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0}>
      	  =
      	</button>
      break;
  }
	return (
  	<div className="col-2">
  	  {button}
  	</div>
  );
}

export const Answer = (props) => {
	return (
  	<div className="col-5">
    	{props.selectedNumbers.map((number, i) => 
        <span key={i} onClick={() => props.unselectNumber(number)}>
        	{number}
        </span>
      )}
  	</div>
  );
}

export const Numbers = (props) => {
	//const arrayOfNumber = _.range(1, 10);
	const numberClassName = (number) => {
  	if (props.selectedNumbers.indexOf(number) >= 0){
    	return 'selected';
    }
  }
	return (
  	<div className="card text-center">
  	  <div>
      	{Numbers.list.map((number, i) =>
        	<span key={i} className={numberClassName(number)} 
                 onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
        )}
  	  </div>
  	</div>
  );
};

Numbers .list = _.range(1, 10);

export class Game extends React.Component{
	state = {
  	selectedNumbers : [],
		randomNumberOfStars: 1+ Math.floor(Math.random()*9),
		usedNumbers: [],
    answeerIsCorrect: null,
  };
  selectNumber = (clickedNumber) => {
   if(this.state.selectedNumbers.indexOf(clickedNumber) >=0){return;}
  	this.setState(prevState => ({
			answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  unselectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
			answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }));
	};
	checkAnswer = () => {
		this.setState(prevState =>({
		 answerIsCorrect: prevState.randomNumberOfStars ===
			 prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
	 }));
 };
 acceptAnswer = () => {
	 this.setState(prevState => ({
		 usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
		 selectedNumbers: [],
		 answerIsCorrect: null,
		 randomNumberOfStars: 1+ Math.floor(Math.random()*9),
	 }));
 };
	render(){
		const {selectedNumbers, randomNumberOfStars, answerIsCorrect, usedNumbers } = this.state;
		return(
    	<div className="container">
    	  <h3>Game 9 Pin Number</h3>
    		<hr/>	
        <div className="row">
				<Stars numOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}
          				checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  answerIsCorrect={answerIsCorrect} />
          <Answer selectedNumbers={selectedNumbers}
          				unselectNumber={this.unselectNumber} />  
        </div>
        <br/>
        <Numbers selectedNumbers={selectedNumbers}
        				 selectNumber={this.selectNumber}
                 usedNumbers={usedNumbers} />
    	</div>
    );
  }
}


export class GameNumbers extends React.Component {
 	render() {
  	return (
    	<div>
    	  <Game />
    	</div>
  	);
  }
}

export default GameNumbers;
//ReactDOM.render(<App />, mountNode);