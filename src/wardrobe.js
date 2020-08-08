import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header } from "./genericElements.js"
import * as data from "./generalData.js"
import 'tippy.js/dist/tippy.css';
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"

const icons = utils.importAll(require.context('./Assets/UI', false, /\.(gif|jpe?g|svg|png)$/))
const artifacts = utils.importAll(require.context('./Assets/Icons/Artifacts', false, /\.(gif|jpe?g|svg|png)$/))
const weapons = utils.importAll(require.context('./Assets/Icons/Weapons', false, /\.(gif|jpe?g|svg|png)$/))

export class Wardrobe extends React.Component {
  pages = [
    "moves",
    "weapons",
    "artifacts",
    "items",
  ]
  headers = [
    "-------SOCCER MOVES-------",
    "-----------WEAPONS-----------",
    "-----------ARTIFACTS-----------",
    "------------ITEMS------------",
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

    }
    else if (panel == "weapons") {
      for (let x in data.weapons) {
        var element = <div className="wardrobe-item" key={x} onClick={() => {this.props.app.addPopup({
          title: "EQUIP WEAPON",
          description: utils.format("Equip {0}?", data.weapons[x].name),
          buttons: [
            {text: "Sure", func: function(){Game.travel.equip("weapon", x, 0)}}
          ]
        })}}>
          <img src={data.weapons[x].icon}/>
        </div>
  
        items.push(element)
      }
    }
    else if (panel == "artifacts") {
      for (let x in data.artifacts) {
        var element = <div className="wardrobe-item" key={x} onClick={() => {this.props.app.addPopup({
          title: "EQUIP ARTIFACT",
          description: utils.format("Equip {0}?", data.artifacts[x].name),
          buttons: [
            {text: "Sure", func: function(){Game.travel.equip("artifact", x, 0)}}
          ]
        })}}>
          <img src={artifacts[data.artifacts[x].icon]}/>
        </div>

        items.push(element)
      }
    }

    return (
      <div>
        <Header text="-----------WARDROBE-----------"></Header>
        <p>Equip your cool stuff here! The average person can carry 1 weapon, 2 soccer moves and 2 artifacts at a time.</p>
        <div className="wardrobe-category-selector">
            <img className="arrow-button" src={icons["arrow_button_left.svg"]} onClick={() => this.switchPage(-1)}></img>
            <Header text={this.headers[panelIndex]}></Header>
            <img className="arrow-button" src={icons["arrow_button_right.svg"]} onClick={() => this.switchPage(1)}></img>
        </div>
        <div className="wardrobe-items">
          {items}
        </div>
        <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}