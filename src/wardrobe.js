import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header, Icon, ArtifactTooltip, GenericTooltip } from "./genericElements.js"
import * as data from "./generalData.js"
import 'tippy.js/dist/tippy.css';
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"
import { SoccerMoveButton, getConsumableTiles, getShoeTiles, getShoeTooltip } from './panels.js';

export function WeaponIcon(props) {
  let tooltip = (props.data.unlocked) ? <div className="generic-tooltip">
    <p>{props.data.name}</p>
    <div>{props.data.description}</div>
  </div> : <p>???</p>;

  return <Tooltip content={tooltip}>
    <Icon data={props.data} locked={!props.data.unlocked} func={() => {
        if (props.interactable != false && props.data.unlocked)
        props.app.addPopup({
          title: "EQUIP WEAPON",
          description: utils.format("Equip {0}?", props.data.name),
          buttons: [
            {text: "Sure", func: function(){Game.travel.equip("weapon", props.data.id, 0)}},
            data.popupButtons.cancel,
          ]
    })}}/>
  </Tooltip>
}

export function ShoeIcon(props) {
  return (
    <GenericTooltip content={getShoeTooltip(props.data)}>
        <Icon
          img={props.data.icon}
          func={() => {props.func()}}
          onContextMenu={(e) => {props.onContextMenu(e)}}
        />
    </GenericTooltip>
  )
}

export function ArtifactIcon(props) {
  return (
    <Icon
      data={props.data}
      tooltip={<ArtifactTooltip data={props.data}/>}
      func={() => {props.func()}}/>
  )
}

export class Wardrobe extends React.Component {
  pages = [
    "moves",
    "weapons",
    "artifacts",
    "consumables",
    "shoes",
  ]
  headers = [
    "-------SOCCER MOVES-------",
    "-----------WEAPONS-----------",
    "-----------ARTIFACTS-----------",
    "------------ITEMS------------",
    "------------SHOES------------",
  ]
  descs = [
    "Abilities that can be empowered with Willpower for a greater effect. Unlock & upgrade them in the Gym.",
    "Weapons give you a secondary attack in battle. Steal them from defeated foes.",
    "Artifacts provide various powers that interact with the rest of your arsenal.",
    "Consumables that can be used in case of emergencies.",
    "Shoes provide you with passive boosts. Forge shoes together to improve them. Pro tip: You can throw away shoes to charity by right-clicking them.",
  ]
  switchPage(indexChange) { // todo make it loop
    var current = this.pages.indexOf(this.props.app.state.wardrobePanel)
    current += indexChange
    if (current > this.pages.length - 1)
      current = 0;
    else if (current < 0)
      current = this.pages.length - 1;
    // current = Math.max(Math.min(current, this.pages.length-1), 0)

    this.props.app.setState({wardrobePanel: this.pages[current]})
  }

  render() {
    var items = [];
    var panel = this.props.app.state.wardrobePanel
    var panelIndex = this.pages.indexOf(panel)
    if (panel == "moves") {
      for (let x in data.moves) {
        let move = Game.travel.getMove(x);
        if (move.level > 0) {
          items.push(
            <SoccerMoveButton data={move} forSale={false} key={Math.random()}/>
          )
        }
        else {
          items.push(
            <Button text={"???"} disabled={true} key={Math.random()}/>
          )
        }
      }
    }
    else if (panel == "weapons") {
      for (let x in data.weapons) {
        var element = <WeaponIcon key={x} app={this.props.app} data={Game.travel.getWeapon(x)}/>
  
        items.push(element)
      }
    }
    else if (panel == "artifacts") {
      for (let x in data.artifacts) {
        let art = Game.travel.getArtifact(x)

        var element = <ArtifactIcon
          data={art}
          key={x}
          func={() => {
            if (art.unlocked)
              this.props.app.addPopup({
                title: "EQUIP ARTIFACT",
                description: utils.format("Equip {0}?", data.artifacts[x].name),
                buttons: [
                  {text: "EQUIP IN SLOT 1", func: (() => {Game.travel.equip("artifact", art.id, 0)}).bind(this)},
                  {text: "EQUIP IN SLOT 2", func: (() => {Game.travel.equip("artifact", art.id, 1)}).bind(this)},
                  data.popupButtons.cancel,
                ]
              }
            )
        }}/>

        items.push(element)
      }
    }
    else if (panel == "consumables") {
      items = getConsumableTiles(true, false)
    }
    else if (panel == "shoes") {
      items = getShoeTiles();
    }
    
    let forgeButton = (panel == "shoes") ? <Button text={"FORGE"} func={() => {this.props.app.toggleForge()}}/> : null;

    return (
      <div>
        <Header text="-----------WARDROBE-----------"></Header>
        <p>Equip &amp; view your cool stuff here! The average person can carry 1 weapon, 2 Soccer Moves and 2 Artifacts at a time.</p>
        <div className="wardrobe-category-selector">
            <img className="arrow-button" src={data.images.ui["arrow_button_left.svg"]} onClick={() => this.switchPage(-1)}></img>
            <Header text={this.headers[panelIndex]}></Header>
            <img className="arrow-button" src={data.images.ui["arrow_button_right.svg"]} onClick={() => this.switchPage(1)}></img>
        </div>
        {this.descs[panelIndex]}
        <div className={"wardrobe-items" + (" wardrobe-" + panel)}>
          {items}
        </div>
        <Divisor height={"40px"}/>
        {forgeButton}
        <Button text={"UNEQUIP"} func={() => {Game.travel.unequip(panel)}}/>
        <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}