import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header } from "./genericElements.js"
import * as data from "./generalData.js"
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"
import { strings } from "./strings.js"

export class Stat extends React.Component {
  render() { // interesting thing to note: tippy only works with 1 nested node. so use divs
    return (
      <Tooltip content={this.props.tooltip}>
        <div className="stat">
          <img className="stats-icon" src={this.props.img}></img>
          <p>{this.props.text}</p>
        </div>
      </Tooltip>
    )
  }
}

function GymButton(props) {
  return (
    <Button text={props.text} func={props.func}/>
  )
}

export class Gym extends React.Component {
  pages = [
    "moves",
    "perks",
  ]
  headers = [
    "---------SOCCER MOVES---------", // inconsistency with wardrobe
    "------------PERKS------------",
  ]

  switchPage(indexChange) {
    var current = this.pages.indexOf(this.props.app.state.gymPanel)
    current += indexChange
    if (current > this.pages.length - 1)
      current = 0;
    else if (current < 0)
      current = this.pages.length - 1;

    this.props.app.setState({gymPanel: this.pages[current]})
  }

  render() {
    var panel = this.props.app.state.gymPanel;
    var panelIndex = this.pages.indexOf(panel)

    var items = [];
    if (panel == "perks") {
      for (let x in data.perks) {
        let perk = data.perks[x]
        let element = <Button
          text={perk.name}
          func={() => {Game.travel.buyPerk(x)}}
          key={x}
        />
        items.push(element);
      }
    }
    else {

    }

    return (
      <div>
          <Header text="------------GYM------------"/>
          <p>Invest into yourself and get professional soccer training. Moves unlocked here can be equipped from your wardrobe.</p>
          <p>{utils.format("Gym membership giftcards: {0}", Game.travel.state.giftcards)}</p>

          <div className="wardrobe-category-selector">
            <img className="arrow-button" src={data.images.ui["arrow_button_left.svg"]} onClick={() => this.switchPage(-1)}></img>
            <Header text={this.headers[panelIndex]}></Header>
            <img className="arrow-button" src={data.images.ui["arrow_button_right.svg"]} onClick={() => this.switchPage(1)}></img>
          </div>
          <div className="gym-items">
            {items}
          </div>

          <Divisor height={40}></Divisor>
          <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}

export class HomeButtonPanel extends React.Component {
  render() {
    return (
      <div>
        <p className="big-text"><b>------------SHOP------------</b></p>
        <Button text="BALLS" func={() => this.props.app.openPanel("balls", "right")}></Button>
        <Button text="BACKGROUNDS" func={() => this.props.app.openPanel("backgrounds", "right")}></Button>
        <Button text="TRAVEL" func={() => this.props.app.openPanel("travel", "right")}></Button>
        <Button text="GYM" func={() => this.props.app.openPanel("gym", "right")}></Button>
        <Button text="WARDROBE" func={() => this.props.app.openPanel("wardrobe", "right")}></Button>
      </div>
    )
  }
}

export class TravelPanel extends React.Component {
  render() {
    var travelButtons = [];
    for (var x in data.travelAreas) {
      var element = <div key={x}>
        <Button
          text={data.travelAreas[x].name.toUpperCase()}
          func={() => Game.travel.travelTo(data.travelAreas[x])}
          disabled={!Game.travel.state.unlocks.areas.includes(x)}>
        </Button>
        <Divisor height={"40px"}></Divisor>
      </div>
      travelButtons.push(element);
    }
    return (
      <div>
       <Header text="------------TRAVEL------------"></Header>
       <div>
         {travelButtons}
       </div>
       <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}

export class Stats extends React.Component {
  render() {
    return (
      <div>
        <Header text="------------STATS------------"></Header>
        <Stat img={require("./Assets/Balls/ball.gif")} text={"Matches Played: " + Game.stats.state.matches}></Stat>
        <Stat img={require("./Assets/Icons/trophy_win.svg")} text={"Matches Won: " + Game.stats.state.wins}></Stat>
        <Stat img={require("./Assets/Icons/50chart.svg")} text={"Winrate: " + Game.stats.getWinrate()}></Stat>
        <Stat img={require("./Assets/Icons/lp.svg")} text={"Legendary Points: " + Game.stats.state.legs} tooltip={strings.stats.tooltips.legs}></Stat>
        <Stat img={require("./Assets/Icons/total_lp.svg")} text={"Total LP: " + Game.stats.state.totalLegs} tooltip={strings.stats.tooltips.totalLegs}></Stat>
        <Stat img={require("./Assets/Icons/trophy_trail.svg")} text={"Best Win Streak: " + Game.stats.state.bestStreaks.win} tooltip={Game.stats.getStreakOdds("win")}></Stat>
        <Stat img={require("./Assets/Icons/trophy_lose_trail.svg")} text={"Best Lose Streak: " + Game.stats.state.bestStreaks.lose} tooltip={Game.stats.getStreakOdds("lose")}></Stat>
      </div>
    )
  }
}