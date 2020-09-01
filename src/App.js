import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import * as Game from "./BallGame.js"
import * as Utils from "./Utils.js"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { strings } from "./strings.js"
import tests from "./Assets/Balls/ball.gif"
import * as data from "./generalData.js"
import { BallsPanel } from "./BallsPanel.js"
import { ProgressBar, XpBar } from "./progressBar.js"
import { Tooltip } from "./tooltip.js"
import { Color, BackgroundsPanel } from "./colors.js"
import { Button, Header, PopUp, Divisor, ArtifactTooltip, Icon } from "./genericElements.js"
import { PlayerPanel, EnemyPanel, CombatLog } from './combatComponents';
import { Wardrobe, WeaponIcon } from "./wardrobe.js"
import * as utils from "./utilities.js"
import { Stat, Stats, TravelPanel, HomeButtonPanel, Gym } from "./panels.js"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./Assets/Balls', false, /\.(gif|jpe?g|svg|png)$/));

class Equips extends React.Component {
  render() {
    let weapon = Game.travel.getCurrent("weapon")
    let weaponIcon = (weapon != null) ? <WeaponIcon data={weapon} app={this.props.app} interactable={false}/> : null;

    let arts = []
    for (let x in Game.travel.state.loadout.artifacts) {
      let id = Game.travel.state.loadout.artifacts[x]

      if (id != null) {
        let art = Game.travel.getArtifact(id)
        arts.push(<Icon key={x} data={art} tooltip={<ArtifactTooltip data={art}/>}></Icon>)
      }
    }

    return (
      <div>
        <Header text="------------EQUIPS------------"></Header>
        <div className="icons-flexbox">
          <Icon src=""></Icon>
          {weaponIcon}
          {arts}
        </div>
        <div style={{width: "100%"}}>
          <ProgressBar hasTooltip hasXpBar={true} percentage={Game.combatManager.player.getHpPercentage()} level={Game.levelling.state.level} text={`${Game.combatManager.player.hp}/${Game.combatManager.player.maxHp} HP`}></ProgressBar>
        </div>
      </div>
    )
  }
}

class Result extends React.Component{
  render() {
    var resultText = Game.ballGame.getResultText();
    var className = "";
    var size = (Game.ballGame.state.streak * 10) + 64
    var offset = (Game.ballGame.state.streak - 1) * 5
    var trophyType = "";
    let trophyImg;
    var trophyStyle = {
      width: size,
      height: size,
      transform: "translate(-50%, " + -offset + "px",
      display: "inline",
    }

    if (Game.ballGame.state.streakType == "win") {
      className = "win-color"
      trophyType = "trophy-win"
      trophyImg = "trophy_win.svg"
    }
    else if (Game.ballGame.state.streakType == "lose") {
      className = "lose-color"
      trophyType = "trophy-lose"
      trophyImg = "trophy_lose.svg"
    }
    else {
      trophyStyle.display = "none"
    }

    // var ballImg = data.images.balls[data.balls[Game.main.app.state.ball]].img
    var ballImg = data.balls[this.props.app.state.ball].img

    return (
      <div>
        <div className="result-display">
          <img src={require("./Assets/UI/blur-text.svg")} className="absolute-centered" style={{height: "60px", zIndex: "-1"}}></img>

          {/* trophy */}
          <img className={"absolute-centered " + trophyType} style={trophyStyle} src={data.images.icons[trophyImg]}></img>

          <p style={{zIndex: 100}} className={"big-text absolute-centered stroke " + className}><b>{resultText}</b></p>
        </div>
        <p>{Game.ballGame.getStreakText()}</p>
        <p className="red-text">{Game.ballGame.getLegendaryStreakText()}</p>

        <div className="ball-area" disabled={!Game.combatManager.isPlayerTurn && Game.combatManager.inCombat}>
          <div style={{height: "282px"}} onClick={() => Game.ballGame.roll()}>
            <img style={{height: "282px"}} src={ballImg} className="absolute-centered"></img>

            <p className="ball-text absolute-centered"></p>

            <div className="leg-break-img absolute-centered">
              <p className="unselectable absolute-centered">leg broke</p>
            </div>

            {/* TODO */}
            <img src="" id="ball_extra_img" className="absolute-center" style={{display: "none"}}></img>
          </div>
        </div>
        <p>{utils.format("Willpower: {0}%", Game.combatManager.player.willpowerPercentage)}</p>
        <p>{utils.format("Sweat: {0}%", Game.combatManager.player.sweatPercentage)}</p>
      </div>
    )
  }
}

class App extends React.Component{
  constructor() {
    super()

    this.state = {
      ballGame: Game.ballGame,
      panels: {
        left: "stats",
        middle: "ballGame",
        right: "home",
      },
      bgColor: "#add8e6",
      ball: "classic",
      popupQueue: [],
      wardrobePanel: "moves",
      gymPanel: "moves",
    }

    Game.main.app = this;
  }

  addPopup(popup) {
    Game.main.addPopup(popup);
  }

  closePopup() {
    Game.main.closePopup(); // wtf
  }
  
  openPanel(type, location) {
    var panels = {
      left: this.state.panels.left,
      middle: this.state.panels.middle,
      right: this.state.panels.right,    
    }

    panels[location] = type;

    this.setState({
      panels: panels,
    })
  }

  async startCombat() {
    await this.openPanel("enemy", "left");
    await this.openPanel("combat_player", "right");
  }

  async exitCombat() {
    await this.openPanel("stats", "left");
    await this.openPanel("home", "right");
  }

  render() {
    document.getElementsByTagName("BODY")[0].style.backgroundColor = this.state.bgColor;

    var popup = null;
    if (this.state.popupQueue.length != 0) {
      popup = <PopUp data={this.state.popupQueue[0]}></PopUp>
    }

    var panels = {
      home: (<HomeButtonPanel app={this}/>),
      backgrounds: <BackgroundsPanel app={this}></BackgroundsPanel>,
      balls: <BallsPanel app={this}></BallsPanel>,
      travel: <TravelPanel app={this}></TravelPanel>,
      ballGame: <Result app={this}></Result>,
      enemy: <EnemyPanel app={this}/>,
      combat_player: <PlayerPanel app={this}/>,
      stats: <div><Stats></Stats><Equips></Equips></div>,
      wardrobe: <Wardrobe app={this}/>,
      gym: <Gym app={this}></Gym>,
    }

    return (
      <div className="App">
        {popup}
        <div className="logo">
            <img src={require("./Assets/logo_path.svg")} style={{height: "100px"}}></img>
            <a className="centered" href="https://pinewood.team">by Team Pinewood</a>
        </div>
  
        {/* main container */}
        <div className="game-container-holder">
          <div className="game-tab">
            {panels[this.state.panels.left]}
          </div>
  
          {/* middle panel */}
          <div className="game-tab">
            {panels[this.state.panels.middle]}
          </div>
  
          <div className="game-tab">
            {panels[this.state.panels.right]}
          </div>
        </div>

        {/* DEBUG BUTTONS */}
        <div>
          <Button text="add lp" func={function(){Game.stats.state.legs += 99;}}></Button>
          <Button text="add giftcards" func={function(){Game.travel.state.giftcards += 10;}}></Button>
          <Button text="unlock arts/weps" func={function(){
            for (let x in data.weapons) {
              Game.travel.unlock("weapon", x)
            }
            for (let x in data.artifacts) {
              Game.travel.unlock("artifact", x)
            }
          }}></Button>
          <Button text="add wp" func={function(){Game.combatManager.player.willpower += 0.5}}></Button>
        </div>
      </div>
    );
  }
}

export default App;
