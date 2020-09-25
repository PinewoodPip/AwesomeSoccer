import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header, Checkbox, NumericInput, ArtifactTooltip, Icon, GenericTooltip } from "./genericElements.js"
import * as data from "./generalData.js"
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"
import { strings } from "./strings.js"
import { PlayerPanel, EnemyPanel, CombatLog } from './combatComponents';
import { ArtifactIcon, ShoeIcon, Wardrobe, WeaponIcon } from "./wardrobe.js"

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
      if (props.data.level < props.data.maxLevel)
        bottomText.push(<p key={0}>{"Upgrade cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
      else
        bottomText.push(<p key={2}>{"At maximum level.".format(props.data.nextLevelCost)}</p>)
    }
    else {
      bottomText.push(<p key={1}>{"You don't have this move (YET)!"}</p>)
      bottomText.push(<p key={2}>{"Unlock cost: {0} Gym Membership Giftcards".format(props.data.nextLevelCost)}</p>)
    }
  }

  let func; // different onClick based on where it's used (gym/wardrobe)
  if (props.forSale)
    func = () => {Game.travel.buyMove(props.data.id)}
  else if (Game.combatManager.inCombat) {
    func = () => {Game.combatManager.player.useMove(props.moveIndex)}
  }
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
    <div className="box-header">
      <p><span className="text-header text-color-black">{"--------------" + props.data.name + "--------------"}</span></p>
    </div>
    <div>{props.data.description}</div>
    <hr/>
    {scalingDescription}
    <hr/>
    {bottomText}
  </div>

  let button = <Button
    text={props.data.name.toUpperCase()}
    func={func}
    glowing={props.glowing}
    disabled={props.disabled}
  ></Button>

  return (
    <Tooltip content={tooltip} key={Math.random()}>
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
          <p>Invest into yourself and get professional soccer training. Moves unlocked here can be equipped from your wardrobe. Perks acquired here are passive and a lifetime pact.</p>
          <p>{utils.format("Gym Membership Giftcards: {0}", Game.travel.state.giftcards)}</p>

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
        <Button text="BALLS" func={() => this.props.app.openPanel("balls", "right")}hidden disabled={Game.stats.state.totalLegs == 0}></Button>
        <Button text="BACKGROUNDS" func={() => this.props.app.openPanel("backgrounds", "right")} hidden disabled={!Game.colorManager.hasAnyColorUnlocked}></Button>
        <Button text="TRAVEL" func={() => this.props.app.openPanel("travel", "right")} hidden disabled={!Game.travel.canTravel}></Button>
        <Button text="GYM" func={() => this.props.app.openPanel("gym", "right")} hidden disabled={!Game.travel.canUseGym}/>
        <Button text="WARDROBE" func={() => this.props.app.openPanel("wardrobe", "right")} hidden disabled={!Game.travel.hasAnyGearOrMoves}/>
        <Divisor height={"40px"}/>
        <GenericTooltip content={<p>The game also saves automatically when you leave the page.</p>}>
          <Button text="SAVE" func={() => {Game.main.save(); window.alert("Your feats have been recorded!")}}></Button>
        </GenericTooltip>
        <Button text="IMPORT/EXPORT" func={() => Game.main.openSaveMenu()}></Button>
        <Button text="CONFIG &amp; MORE" func={() => this.props.app.openPanel("config", "right")}></Button>
      </div>
    )
  }
}

export function ConfigOption(props) {
  return (
    <div className="config-option">
      <p>{props.text}</p>
      {props.inputElement}
    </div>
  )
}

export function Config(props) {
  let configWinrate = <NumericInput value={Game.config.winrateRounding} min={0} max={5} func={(e) => {Game.config.winrateRounding = e}}/>
  let configScale = <NumericInput step={0.1} value={Game.config.scaleAmount} min={0.6} max={1.1} func={(e) => {Game.config.scaleAmount = e}}/>
  let winrateText = (Game.config.preferLosses) ? "Lossrate rounding" : "Winrate rounding";
  return (
    <div className="flexbox-vertical">
      <p className="big-text"><b>----------CONFIG----------</b></p>
      <ConfigOption text={"Prefer losses"}  inputElement={<Checkbox ticked={Game.config.preferLosses} func={() => {Game.config.preferLosses = !Game.config.preferLosses}}/>}/>
      <ConfigOption text={winrateText} inputElement={configWinrate}/>
      <GenericTooltip content={<p>Adjusts the scale of the game interface. If you screw this up, you can reset it by loading the page with "?resetScale=true" appended to the end of the URL. Does not affect tooltips.</p>}>
        <ConfigOption text={"Interface Scale"} inputElement={configScale}/>
      </GenericTooltip>
      <ConfigOption text={"Hide logo"}  inputElement={<Checkbox ticked={Game.config.hideLogo} func={() => {Game.config.hideLogo = !Game.config.hideLogo}}/>}/>
      <Button text="TUTORIALS" func={() => props.app.openPanel("tutorials", "right")}></Button>

      <Divisor height={"40px"}/>

      <Button text="BACK" func={() => props.app.openPanel("home", "right")}></Button>
    </div>
  )
}

function getConsumableTooltip(item, usable=true) {
  let clickToUseText = (item.isUsable && usable) ? <p>{"Click to use!"}</p> : null;

  return <div className="generic-tooltip">
    <p>{item.name}</p>
    <p>{"{0}/{1} Stored".format(item.amount, item.maxStacks)}</p>
    <p></p>
    <div>{item.description}</div>
    {clickToUseText}
  </div>
}

export function getConsumableTiles(showLocked=false, showOnlyUsable=true) {
  let consumables = []
  for (let x in data.consumables) {
    let item = Game.travel.getConsumable(x)

    let tooltip = item.unlocked ? getConsumableTooltip(item) : <p>???</p>

    if (!item.isUsable && showOnlyUsable) {

    }
    else if (item.unlocked || showLocked) {
      let element = <Tooltip content={tooltip} key={x}>
        <Icon
          img={item.icon}
          func={() => {Game.travel.useConsumable(x); Game.main.app.setState({hasConsumablesMenuOpen: false})}}
          locked={item.amount <= 0}
          key={x}/>
      </Tooltip>

      consumables.push(element)
    }
  }
  return consumables;
}

export function getShoeTooltip(shoe) {
  return (
    <div className="generic-tooltip" key={Math.random()}>
      <p>{shoe.name}</p>
      {shoe.modifierText}
    </div>
  )
}

export function getShoeTiles(iconFunc=null) {
  let items = []
  for (let x in Game.shoes.state.owned) {
    let shoe = Game.shoes.getShoe(Game.shoes.state.owned[x])

    let tooltip = getShoeTooltip(shoe)
    let func = (iconFunc != null) ? iconFunc.bind(Game.shoes) : (z) => {Game.shoes.equip(z)}
    items.push(
      <ShoeIcon
        key={x}
        data={shoe}
        tooltip={tooltip}
        func={() => {func(x)}}
        onContextMenu={(e) => {e.preventDefault(); Game.shoes.discardShoe(Game.shoes.state.owned[x])}}
      />
      // <Tooltip content={tooltip} key={x}>
      //   <Icon
      //     img={shoe.icon}
      //     func={() => {func(x)}}
      //     onContextMenu={(e) => {e.preventDefault(); Game.shoes.discardShoe(Game.shoes.state.owned[x])}}
      //     key={x}
      //   />
      // </Tooltip>
    )
  }

  if (items.length == 0)
    return <p>(You have no shoes. Get some from fights.)</p>
  return items;
}

export function ConsumablesPanel(props) {
  let consumables = getConsumableTiles()
  
  return (
    <div>
      <Header text="------------ITEMS------------"/>
      <div className="wardrobe-items">
        {consumables}
      </div>
      <Button
        text={"BACK"}
        func={() => Game.main.app.setState({hasConsumablesMenuOpen: false})}>
      </Button>
      <Divisor height={"40px"}/>
    </div>
  )
}

export class Equips extends React.Component {
  render() {
    let weapon = Game.travel.getCurrent("weapon")
    let weaponIcon = (weapon != null) ? <WeaponIcon data={weapon} app={this.props.app} interactable={false} key={Math.random()}/> : null;

    let arts = []
    for (let x in Game.travel.state.loadout.artifacts) {
      let id = Game.travel.state.loadout.artifacts[x]

      if (id != null) {
        let art = Game.travel.getArtifact(id)
        arts.push(<Icon key={10+x} data={art} tooltip={<ArtifactTooltip data={art}/>}></Icon>)
      }
    }

    let shoes = [];
    for (let x in Game.shoes.state.equipped) {
      let shoeSave = Game.shoes.state.equipped[x]
      if (shoeSave != null) {
        let shoe = Game.shoes.getShoe(shoeSave)
        shoes.push(
          <Tooltip content={getShoeTooltip(shoe)} key={20+x}>
            <Icon
            img={shoe.icon}
            />
          </Tooltip>
        )
      }
    }
    
    // show foot if no shoes are equipped
    if (shoes.length == 0) {
      let tooltip = <div className="generic-tooltip">
        <p>No Shoes</p>
        <p>35 out of 100 soccer players break their leg every match from playing barefoot. The Supreme Soccer Court recommends protecting your feet when possible.</p>
        <p>You can equip shoes from the wardrobe if you have any. And if you want to, of course.</p>
      </div>
      shoes.push(
        <Tooltip content={tooltip} key={30}>
          <Icon img={data.images.shoes["feet.gif"]}/>
        </Tooltip>
      )
    }

    return (
      <div>
        <Header text="------------EQUIPS------------"></Header>
        <div className="icons-flexbox">
          {shoes}
          {weaponIcon}
          {arts}
        </div>
      </div>
    )
  }
}

export class TravelPanel extends React.Component {
  render() {
    var travelButtons = [];
    for (let x in data.travelAreas) {
      let area = data.travelAreas[x];
      let glowing = (Game.travel.state.areaProgress[x] >= Game.travel.bossRequirement)
      let text = (Game.travel.state.unlocks.areas.includes(x)) ? data.travelAreas[x].name.toUpperCase() : "???"
      let tooltip = (Game.travel.state.unlocks.areas.includes(x)) ? <p>{area.description}</p> : <p>You can't travel here (YET)!</p>
      var element = <GenericTooltip content={tooltip} key={x}>
        <Button
          text={text}
          func={() => Game.travel.travelTo(x)}
          disabled={!Game.travel.state.unlocks.areas.includes(x)}
          glowing={glowing.toString()}>
        </Button>
      </GenericTooltip>
      travelButtons.push(element);
    }
    return (
      <div>
       <Header text="------------TRAVEL------------"></Header>
       <p>Endure the challenges of the world for glory &amp; rewards.</p>
       <div className="flexbox-vertical-tight">
         {travelButtons}
       </div>
       <Divisor height={"40px"}/>
       <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}

export class Stat extends React.Component {
  render() { // interesting thing to note: tippy only works with 1 nested node. so use divs
    let parent = (this.props.tooltip != undefined) ?  <Tooltip content={this.props.tooltip}/> : <div></div>
    let inner = <div className="stat">
      <img className="stats-icon" src={this.props.img}></img>
      <p>{this.props.text}</p>
    </div>
    if (this.props.tooltip != undefined)
      return (
        <Tooltip content={this.props.tooltip}>
          {inner}
        </Tooltip>
      )
    else
      return (
        <div>
          {inner}
        </div>
      )
  }
}

export class Stats extends React.Component {
  render() {
    let panels = [
      <BallGameStats/>,
      <CombatStats/>,
      <CombatStats2/>,
    ]
    let headers = [
      "------------STATS------------",
      "--------FIGHT CLUB CARD--------",
      "-----FIGHT CLUB CARD (BACK)-----"
    ]
    let currentPage = this.props.app.state.statsPanel;
    let statsPanel = panels[currentPage]
    let nextPage = (currentPage == panels.length - 1) ? 0 : currentPage + 1;
    let previousPage = (currentPage == 0) ? panels.length - 1 : currentPage - 1;
    let header = headers[currentPage]

    let buttons = (Game.travel.hasStatCardUnlocked) ? <div className="wardrobe-category-selector">
        <img className="arrow-button" src={data.images.ui["arrow_button_left.svg"]} onClick={() => this.props.app.setState({statsPanel: previousPage})}></img>
        <Header text={header}></Header>
        <img className="arrow-button" src={data.images.ui["arrow_button_right.svg"]} onClick={() => this.props.app.setState({statsPanel: nextPage})}></img>
    </div> : <Header text={header}></Header>

    return (
      <div>
        {buttons}
        {statsPanel}
      </div>
    )
  }
}

export function BallGameStats() {
  return (
    <div>
      <Stat img={data.images.balls["ball_future_proof.svg"]} text={"Matches Played: " + Game.stats.state.matches} tooltip={Game.stats.getDailyMatchesTooltip()}></Stat>
      <Stat img={data.images.icons["trophy_win.svg"]} text={"Matches Won: " + Game.stats.state.wins}></Stat>
      <Stat img={data.images.icons["50chart.svg"]} text={Game.stats.getWinrate()}></Stat>
      <Stat img={data.images.icons["lp.svg"]} text={"Legendary Points: " + Game.stats.state.legs} tooltip={strings.stats.tooltips.legs}></Stat>
      <Stat img={data.images.icons["total_lp.svg"]} text={"Total LP: " + Game.stats.state.totalLegs} tooltip={strings.stats.tooltips.totalLegs}></Stat>
      <Stat img={data.images.icons["trophy_trail.svg"]} text={"Best Win Streak: " + Game.stats.state.bestStreaks.win} tooltip={Game.stats.getStreakOdds("win")}></Stat>
      <Stat img={data.images.icons["trophy_lose_trail.svg"]} text={"Best Lose Streak: " + Game.stats.state.bestStreaks.lose} tooltip={Game.stats.getStreakOdds("lose")}></Stat>
    </div>
  )
}

export function CombatStats(props) {
  let stats = Game.combatManager.player.getRealStats();
  let player = Game.combatManager.player;
  let icons = data.images.stats;

  let wpTooltip = <div className="generic-tooltip">
    <p>Your Willpower is your inner desire to carry on, to endure even the harshest struggles, in search of enlightenment and self-realization.</p>
    <p>In combat, you can generate Willpower through soccer matches and other means. Willpower can be spent to empower Soccer Moves or interact with Artifacts, if you meet their thresholds.</p>
    <p>{"Willpower Generation: {0}%".format(player.willpowerMult * 100)}</p>
    <p>{"Willpower Allowance: {0}".format(utils.round(player.willpowerPerTurn * 100, 2))}</p>
  </div>

  let manipTooltip = <div>
    <p>Manipulation determines how easy you are to manipulate through statuses.</p>
  </div>

  let critTooltip = <div>
    <p>Your chance to score an outstanding soccer play, fracturing the enemy's bones further than usual.</p>
    <p>{"Critical Multiplier: {0}%".format(stats.critMult * 100)}</p>
  </div>

  let dodgeTooltip = <div>
    <p>{"Block chance: {0}%".format(stats.baseBlock * 100)}</p>
  </div>

  return (
    <div>
        <Stat img={icons["sword.svg"]} text={"Damage: {0}".format(utils.round(stats.dmg))}></Stat>
        <Stat img={icons["shield.svg"]} text={"Defense: {0}%".format(stats.defense * 100)}></Stat>
        <GenericTooltip content={dodgeTooltip}>
          <Stat img={icons["feather.svg"]} text={"Dodge Chance: {0}%".format(utils.round(stats.dodge * 100))}></Stat>
        </GenericTooltip>
        <Stat img={icons["accuracy.svg"]} text={"Accuracy: {0}%".format(stats.acc * 100)}></Stat>
        <Tooltip content={wpTooltip}>
          <Stat img={icons["willpower.svg"]} text={"Max Willpower: {0}".format(player.maxWillpower * 100)}></Stat>
        </Tooltip>
        <GenericTooltip content={manipTooltip}>
          <Stat img={icons["willpower.svg"]} text={"Manipulation: {0}%".format(-(utils.round(player.manipulation*100 - 100)))}></Stat>
        </GenericTooltip>
        <GenericTooltip content={critTooltip}>
          <Stat img={icons["critical.svg"]} text={"Critical Chance: {0}%".format(stats.critChance * 100)}></Stat>
        </GenericTooltip>
      </div>
  )
}

export function CombatStats2(props) {
  let stats = Game.combatManager.player.getRealStats();
  let player = Game.combatManager.player;
  let icons = data.images.stats;

  let unlocks = {
    all: Game.travel.getUnlockablesCount("all"),
    weapons: Game.travel.getUnlockablesCount("weapon"),
    artifacts: Game.travel.getUnlockablesCount("artifact"),
    consumables: Game.travel.getUnlockablesCount("consumable"),
    balls: Game.travel.getUnlockablesCount("ball"),
    colors: Game.travel.getUnlockablesCount("color"),
  }

  let unlockablesTooltip = <div className="generic-tooltip">
    <p>{"Balls: {0}/{1}".format(unlocks.balls.count, unlocks.balls.total)}</p>
    <p>{"Background Colors: {0}/{1}".format(unlocks.colors.count, unlocks.colors.total)}</p>
    <p>{"Weapons: {0}/{1}".format(unlocks.weapons.count, unlocks.weapons.total)}</p>
    <p>{"Artifacts: {0}/{1}".format(unlocks.artifacts.count, unlocks.artifacts.total)}</p>
    <p>{"Consumables: {0}/{1}".format(unlocks.consumables.count, unlocks.consumables.total)}</p>
  </div>
  return (
    <div>
      <Stat img={icons["sword.svg"]} text={"Fights won: {0}".format(Game.travel.fightsWon)}></Stat>
      <Tooltip content={unlockablesTooltip}>
       <Stat img={icons["sword.svg"]} text={"Unlockables: {0}/{1}".format(unlocks.all.count, unlocks.all.total)}></Stat>
      </Tooltip>
    </div>
  )
}

export function Forge(props) {
  let shoes = getShoeTiles(Game.shoes.addShoeToForge);
  let tooltip = (Game.shoes.isForgeReady) ? <div className="generic-tooltip">
    <p>{"Cost: {0} LP".format(Game.shoes.getForgePrice())}</p>
  </div> : null
  let helpButton = <div className="shoeforge-help">
    <Icon img={data.images.ui["question_mark.svg"]} func={() => {Game.main.addPopup(Game.shoes.helpPopup)}}/>
  </div>
  return (
    <div className="popup-cover">
      <div className="large-interface">
        {helpButton}
        <div className="flexbox-vertical">
          <Header text="----------FORGE----------"/>
          <ForgeCraftingStation/>
          <Tooltip content={tooltip}>
            <Button text={"FORGE"} func={() => {Game.shoes.forgeShoes()}} disabled={!Game.shoes.isForgeReady}/>
          </Tooltip>
          <div className="flexbox-horizontal">
            {shoes}
          </div>
          <Button text={"BACK"} func={() => {props.app.toggleForge()}}/>
        </div>
      </div>
    </div>
  )
}

export function ForgeCraftingStation(props) {
  let element1 = <Icon/>
  if (Game.shoes.forge.element1 != null) {
    let shoe = Game.shoes.getShoe(Game.shoes.forge.element1)
    element1 = <Tooltip content={getShoeTooltip(shoe)}>
    <Icon
      img={shoe.icon}
      func={() => {Game.shoes.removeShoeFromForge(0)}}
    />
  </Tooltip>
  }
  let element2 = <Icon/>
  if (Game.shoes.forge.element2 != null) {
    let shoe = Game.shoes.getShoe(Game.shoes.forge.element2)
    element2 = <Tooltip content={getShoeTooltip(shoe)}>
    <Icon
      img={shoe.icon}
      func={() => {Game.shoes.removeShoeFromForge(1); Game.main.render()}}
    />
  </Tooltip>
  }

  let resultShoe = Game.shoes.getShoe(Game.shoes.forge.result);
  let result = (resultShoe != null) ? <Tooltip content={getShoeTooltip(resultShoe)}>
    <Icon
      img={resultShoe.icon}
      func={() => {Game.shoes.forge.result = null; Game.main.render()}}
    />
  </Tooltip> : <Icon img={data.images.ui["question_mark.svg"]}/>;
  return (
    <div className="flexbox-horizontal">
      {element1}
      <Icon img={data.images.ui["plus.svg"]} borderless/>
      {element2}
      <Icon img={data.images.ui["equals.svg"]} borderless/>
      {result}
    </div>
  )
}

export function LootScreen(props) {

  let items = []
  let text;

  for (let x in props.data.drops) {
    let drop = props.data.drops[x];
    switch (drop.type) {
      case "weapon": {
        items.push(<WeaponIcon interactable={false} key={x} data={Game.travel.getWeapon(drop.id)}/>)
        break;
      }
      case "artifact": {
        items.push(<ArtifactIcon func={()=>{}} key={x} data={Game.travel.getArtifact(drop.id)}/>)
        break;
      }
      case "consumable": {
        let item = Game.travel.getConsumable(drop.id)
        items.push(<Tooltip content={getConsumableTooltip(item, false)} key={x}>
          <Icon
            img={item.icon}
            func={() => {}}
            key={x}/>
        </Tooltip>)
      }
    }
  }

  for (let x in props.data.shoes) {
    let drop = props.data.shoes[x]
    items.push(<ShoeIcon key={-1-x} data={drop} func={()=>{}}/>)
  }

  return (
    <div>
      <p>{text}</p>
      <div className="flexbox-horizontal">
        {items}
      </div>
    </div>
  )
}

export function TutorialsMenu(props) {
  let tutorials = []
  for (let x in data.tutorials) {
    let tutorial = data.tutorials[x];
    let unlocked = Game.travel.state.tutorialsSeen.includes(x)
    let text = unlocked ? tutorial.short_title : "???"
    tutorials.push(<Button
      text={text}
      disabled={!unlocked}
      func={() => {Game.travel.showTutorial(x, true)}}
      key={x}
      />)
  }
  return (
    <div>
      <Header text="----------TUTORIALS----------"></Header>
      <div className="flexbox-vertical-tight">
        {tutorials}
      </div>

      <Divisor height={"40px"}/>

      <Button text="BACK" func={() => props.app.openPanel("home", "right")}></Button>
    </div>
  )
}