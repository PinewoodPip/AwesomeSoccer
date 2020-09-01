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

export function PerkTooltip(props) {
  var bottomText = []
  let perk = props.data;
  if (props.data.level <= 0) {
    bottomText.push(<p key={1}>You don't have this perk (YET)!</p>)
    if (perk.level < perk.maxLevel)
      bottomText.push(<p key={2}>{"Unlock cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
    else
      bottomText.push(<p key={2}>{"At maximum level. Cannot upgrade further."}</p>)
    bottomText.push(<p key={3}>{"Upgrade level: {0}/{1}".format(perk.level, perk.maxLevel)}</p>)
  }
  else {
    bottomText.push(<p key={1}>{"Upgrade cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
    bottomText.push(<p key={2}>{"Upgrade level: {0}/{1}".format(perk.level, perk.maxLevel)}</p>)
  }
  return (
    <div className="generic-tooltip">
      <p>{perk.name}</p>
      <p>{perk.description}</p>
      <p></p>
      {bottomText}
    </div>
  )
}

export function SoccerMoveButton(props) {

  let scalingDescription = [];
  for (let x in props.data.scalingDescription) {
    scalingDescription.push(<p key={x}>{props.data.scalingDescription[x]}</p>)
  }

  let bottomText = [];
  if (props.forSale) {
    if (props.data.level > 0) {
      bottomText.push(<p key={0}>{"Upgrade cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
    }
    else {
      bottomText.push(<p key={1}>{"You don't have this move (YET)!"}</p>)
      bottomText.push(<p key={2}>{"Unlock cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
    }
  }

  let func; // different onClick based on where it's used (gym/wardrobe)
  if (props.forSale)
    func = () => {Game.travel.buyMove(props.data.id)}
  else
    func = () => {
      Game.main.addPopup({
        title: props.data.name,
        description: "Equip {0}?".format(props.data.name),
        buttons: [
          {text: "EQUIP IN SLOT 1", func: (() => {Game.travel.equip("move", props.data.id, 0)}).bind(this)},
          {text: "EQUIP IN SLOT 2", func: (() => {Game.travel.equip("move", props.data.id, 1)}).bind(this)},
          data.popupButtons.cancel,
        ]
      })
    }
  
  bottomText.push(<p key={3}>{"Upgrade level: {0}/{1}".format(props.data.level, props.data.maxLevel)}</p>)

  let tooltip = <div className="generic-tooltip">
    <p>{props.data.name}</p>
    <p>{props.data.description}</p>
    <p></p>
    {scalingDescription}
    <p></p>
    {bottomText}
  </div>

  let button = <Button
    text={props.data.name.toUpperCase()}
    func={func}
  ></Button>

  return (
    <Tooltip content={tooltip}>
      {button}
    </Tooltip>
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
        let save = Game.travel.getPerk(x)
        let element = <Tooltip content={<PerkTooltip data={save}/>} key={x}>
          <Button
            text={perk.name.toUpperCase()}
            func={() => {Game.travel.buyPerk(x)}}
          />
        </Tooltip>
        items.push(element);
      }
    }
    else if (panel == "moves") {
      for (let x in data.moves) {
        let move = Game.travel.getMove(x);
        let element = <SoccerMoveButton data={move} key={x} forSale={true}/>
        items.push(element)
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