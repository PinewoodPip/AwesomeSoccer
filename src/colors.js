import React from 'react';
import * as Game from "./BallGame.js"
import { Tooltip } from "./tooltip.js"
import * as data from "./generalData.js"
import { Button } from "./genericElements.js"

export class Color extends React.Component {
  render() {
    var tooltip = <div>
      <p>{this.props.name}</p>
      <p>{this.props.colorCode}</p>
    </div>

    return (
      <Tooltip content={tooltip}>
        <div className="color" style={{backgroundColor: this.props.colorCode}} onClick={() => {Game.colorManager.set(this.props.colorId)}}>
          <p className="color-lock">{(Game.colorManager.state.unlocked.includes(this.props.colorId)) ? "" : "X"}</p>
        </div>
      </Tooltip>
    )
  }
}

export class BackgroundsPanel extends React.Component {
  render() {
    var elements = []

    for (var x in data.colors) {
    var element = <Color name={data.colors[x].name} colorCode={data.colors[x].color} colorId={x} key={x}></Color>

    elements.push(element);
    }

    return (
    <div>
        <p className="big-text"><b>----BACKGROUNDS----</b></p>
        <p>Unlock new background colors by leveling up!</p>
        <div className="backgrounds-elements">
        {elements}
        </div>
        <Button text="BACK" func={() => this.props.app.openPanel("home", "right")}></Button>
    </div>
    )
  }
}