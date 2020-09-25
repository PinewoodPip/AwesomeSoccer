import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import * as Game from "./BallGame.js"
import 'tippy.js/dist/tippy.css';
import { strings } from "./strings.js"
import * as data from "./generalData.js"
import { BallsPanel } from "./BallsPanel.js"
import { ProgressBar, XpBar } from "./progressBar.js"
import { Tooltip } from "./tooltip.js"
import { Color, BackgroundsPanel } from "./colors.js"
import { Button, Header, PopUp, Divisor, ArtifactTooltip, Icon, GenericTooltip } from "./genericElements.js"
import { PlayerPanel, EnemyPanel, CombatLog } from './combatComponents';
import { Wardrobe, WeaponIcon } from "./wardrobe.js"
import * as utils from "./utilities.js"
import { Stat, Stats, TravelPanel, HomeButtonPanel, Gym, Config, ConsumablesPanel, CombatStats, Equips, Forge, TutorialsMenu } from "./panels.js"
import { Beforeunload } from 'react-beforeunload';
import { isMobile } from "react-device-detect";

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./Assets/Balls', false, /\.(gif|jpe?g|svg|png)$/));

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

    //var ballImg = data.balls[this.props.app.state.ball].icon
    var ballImg = data.balls[Game.ballManager.state.equipped].icon

    // leg break img
    let legBreak = null;
    if (Game.ballGame.state.brokenLeg) {
      legBreak = <div className="leg-break absolute-centered">
        <img className="absolute-centered leg-break" src={data.images.ui["legbreakalert.png"]}/>
        <p className="unselectable absolute-centered">{Game.ballManager.getBall(Game.ballManager.state.equipped).legBreakMsg}</p>
      </div>
    }

    let wpTooltip = <div className="generic-tooltip">
    <p>Your Willpower is your inner desire to carry on, to endure even the harshest struggles, in search of enlightenment and self-realization.</p>
    <p>In combat, you can generate Willpower through soccer matches and other means. Willpower can be spent to empower Soccer Moves or interact with Artifacts, if you meet their thresholds.</p>
    <p>{"Willpower Generation: {0}%".format(Game.combatManager.player.willpowerMult * 100)}</p>
    <p>{"Willpower Allowance: {0}".format(utils.round(Game.combatManager.player.willpowerPerTurn * 100, 2))}</p></div>

    let sweatTooltip = <div className="generic-tooltip">
      <p>How sweaty you are on a percentage scale. Using Soccer Moves will build up sweat. If you're at 100% Sweat, you won't be able to use them anymore. Sweat decays slowly outside of combat, and can also be reduced through other means.</p>
    </div>

    let wpSweatIndicators = (Game.travel.canTravel) ? <div>
      <GenericTooltip content={wpTooltip}>
        <p>{utils.format("Willpower: {0}/{1}", utils.round(Game.combatManager.player.willpowerPercentage), Game.combatManager.player.maxWillpower * 100)}</p>
      </GenericTooltip>
      <GenericTooltip content={sweatTooltip}>
        <p>{utils.format("Sweat: {0}%", utils.round(Game.combatManager.player.sweatPercentage))}</p>
      </GenericTooltip>
    </div> : null;

    return (
      <div>
        <div className="result-display">
          <img src={require("./Assets/UI/blur-text.svg")} className="absolute-centered" style={{height: "60px", zIndex: "-1"}}></img>

          {/* trophy */}
          <img className={"absolute-centered " + trophyType} style={trophyStyle} src={data.images.icons[trophyImg]}></img>

          <p style={{zIndex: 100}} className={"big-text absolute-centered stroke " + className}><b>{resultText}</b></p>
        </div>
        <p style={{height: "18px", marginTop: "10px"}}>{Game.ballGame.getStreakText()}</p>
        <p className="red-text">{Game.ballGame.getLegendaryStreakText()}</p>

        <div className="ball-area" disabled={(!Game.combatManager.isPlayerTurn && Game.combatManager.inCombat) || Game.combatManager.player.isDead}>
          <div style={{height: "282px"}} onClick={() => Game.ballGame.roll()}>
            <img style={{height: "282px"}} src={ballImg} className="absolute-centered"></img>

            <p className="ball-text absolute-centered">{Game.ballGame.d20roll}</p>

            {legBreak}

            {/* TODO */}
            <img src="" id="ball_extra_img" className="absolute-center" style={{display: "none"}}></img>
          </div>
        </div>

        {/* WP/SWEAT INDICATORS */}
        {wpSweatIndicators}
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
      popupQueue: [],
      wardrobePanel: "moves",
      gymPanel: "moves",
      hasConsumablesMenuOpen: false,
      statsPanel: 0,
      largeInterface: null,
      showDebugButtons: false,
    }

    this.hitsplats = new HitsplatManager();
    Game.main.app = this;

    // enable dev features on production builds through url param
    let params = new window.URLSearchParams(document.location.search.substring(1))
    if (params.get("HTMLProgramming") == "engaged") {
      console.log("HTML PROGRAMMING ENGAGED!!!")
      data.global.production = false;
    }

    Game.config.scaleAmount = utils.limitRange(parseFloat(Game.config.scaleAmount), 0.6, 1.1)
    // url param to reset scale if you fuck shit up
    if (params.get("resetScale") == "true") {
      Game.config.scaleAmount = 1;
    }

    if (data.global.production && !Game.saveMetaData.hasSeenCookieWarning) {
      window.alert("We're a European site, so we must inform you that this site uses localstorage to save your game. By using pinewood.team you agree with our usage of cookies and other browser storage.")
      Game.saveMetaData.hasSeenCookieWarning = true;
    }
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

  toggleForge() {
    Game.travel.showTutorial("shoeforging")

    Game.shoes.forge.result = null;
    Game.shoes.forge.element1 = null;
    Game.shoes.forge.element2 = null;
    let currentInterface = this.state.largeInterface == null ? "forge" : null
    this.setState({largeInterface: currentInterface})
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
      stats: <div>
        <Stats app={this}></Stats>
        <Equips></Equips>
        <Divisor height={"17px"}/>
        <div style={{width: "100%"}}>
          <ProgressBar hasTooltip hasXpBar={true} percentage={Game.combatManager.player.getHpPercentage()} level={Game.levelling.state.level} text={`${Game.combatManager.player.hp}/${Game.combatManager.player.maxHp} HP`}></ProgressBar>
        </div>
        </div>,
      wardrobe: <Wardrobe app={this}/>,
      gym: <Gym app={this}></Gym>,
      config: <Config app={this}/>,
      consumables: <ConsumablesPanel app={this}/>,
      combatStats: <CombatStats app={this}/>,
      tutorials: <TutorialsMenu app={this}/>,
    }

    // render logo
    let logo = null;
    if (!Game.config.hideLogo) {
      logo = <div className="logo">
        <img src={require("./Assets/logo_path.svg")} style={{height: "100px"}}></img>
        <a className="centered" href="https://pinewood.team">by Team Pinewood</a>
      </div>
    }
    else {
      logo = <Divisor height={"40px"}/>
    }

    // large interfaces
    let largeInterfaces = {
      "forge": <Forge app={this}/>
    }

    let largeInterface = (this.state.largeInterface != null) ? largeInterfaces[this.state.largeInterface] : null;

    let debugButtons = (!data.global.production) ? <div>
      <Button text="Toggle Debug Buttons" func={function(){Game.main.app.setState({showDebugButtons: !Game.main.app.state.showDebugButtons})}}></Button>
      <DebugButtons app={this}/>
    </div> : null;

    // on mobile devices, scale the whole page down a bit
    let style = (Game.config.scaleAmount != "1") ? {transform: "scale({0})".format(parseFloat(Game.config.scaleAmount))} : null;

    return (
      <Beforeunload onBeforeunload={() => {Game.main.beforeUnload()}}>
        <div className="App" style={style}>
          {largeInterface}
          {popup}
          {logo}
    
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
          {debugButtons}

          <Divisor height={"20px"}/>
          <a href={"https://pinewood.team/patchnotes"} className="flexbox-horizontal">{data.global.version}</a>

        </div>
      </Beforeunload>
    );
  }
}

export function DebugButtons(props) {
  if (data.global.production)
    return null;
  if (!props.app.state.showDebugButtons)
    return null;
  return (
    <div className="flexbox-horizontal">
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
            <Button text="add sweat" func={function(){Game.combatManager.player.gainSweat(0.5)}}></Button>
            <Button text="kill" func={function(){Game.combatManager.player.cast("debug_kill"); Game.combatManager.playerUsedAction();}}></Button>
            <Button text="heal" func={function(){Game.combatManager.player.heal(999)}}></Button>
            <Button text="face boss" func={function(){
              for (let x in Game.travel.state.areaProgress) {
                Game.travel.state.areaProgress[x] += 100;
              }
            }}></Button>
            <Button text="give consumables" func={function(){
              for (let x in data.consumables) {
                Game.travel.unlock("consumable", x, 10)
              }
            }}></Button>
            <Button text="unlock areas" func={function(){
              for (let x in data.travelAreas) {
                Game.travel.unlock("area", x)
              }
            }}></Button>
            <Button text="give shoes" func={function(){
              for (let x in data.shoes) {
                Game.shoes.unlock(x);
              }
            }}></Button>
            <Button text="pass turn" func={function(){
              Game.combatManager.pass(Game.combatManager.player)
            }}></Button>
            <Button text="gain xp" func={function(){
              Game.levelling.gainXp(200)
            }}></Button>
          </div>
  )
}

class HitsplatManager {
  constructor() {
    setInterval(this.tickHitsplats.bind(this), 1000)
  }
  queued = []

  get enemySplats() {
    let splats = []
    for (let x in this.queued) {
      if (!this.queued[x].hit.target.isPlayer) {
        splats.push(this.queued[x].element)
      }
    }
    return splats;
  }

  get playerSplats() {
    let splats = []
    for (let x in this.queued) {
      if (this.queued[x].hit.target.isPlayer) {
        splats.push(this.queued[x].element)
      }
    }
    return splats;
  }

  clear() {this.queued = []}

  tickHitsplats() {
    let cleanup = []
    for (let x in this.queued) {
      this.queued[x].duration -= 1;
      if (this.queued[x].duration <= 0)
        cleanup.push(this.queued[x])
    }
    for (let x in cleanup) {
      this.queued.filter((z) => {return !cleanup.includes(z)})
    }
  }
}

export default App;
