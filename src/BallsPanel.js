import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor } from "./genericElements.js"
import * as data from "./generalData.js"
import { Tooltip } from "./tooltip.js"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

// const images = importAll(require.context('./Assets/Balls', false, /\.(gif|jpe?g|svg|png)$/));

export class BallsPanel extends React.Component {
  render() {
    var elements = [];

    for (var x in data.balls) {
      var ball = data.balls[x];
      var element = <BallItem data={ball} key={x}></BallItem>
      elements.push(element)
    }

    var lootboxTooltip = <div className="generic-tooltip">
      <p>Guaranteed to contain a ball reskin!</p>
      <p>WARNING: GAMBLING!</p>
      <p>Costs 3 LP.</p>
      <p></p>
      <p>{"Lootboxes Opened: " + Game.stats.state.lootboxesOpened}</p>
    </div>

    return (
      <div>
        <p className="big-text"><b>-----------BALLS-----------</b></p>
        <div className="balls-container">
          {elements}
        </div>
        <Divisor></Divisor>
        <Tooltip content={lootboxTooltip}>
          <Button text="LOOTBOX" func={() => Game.ballManager.rollLootbox()}></Button>
        </Tooltip>
        <Button text="BACK" func={() => Game.main.app.openPanel("home", "right")}></Button>
      </div>
    )
  }
}

export class BallItem extends React.Component {
  render() {
    return (
      <div className="ball-icon" onClick={() => Game.ballManager.set(this.props.data.id)}>
        <img src={this.props.data.img}></img>
      </div>
    )
  }
}