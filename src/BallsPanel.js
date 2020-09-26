import React from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Icon } from "./genericElements.js"
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
      var element = <BallItem key={x} data={Game.ballManager.getBall(x)} locked={!Game.ballManager.state.unlocked.includes(x)}></BallItem>
      elements.push(element)
    }

    var lootboxTooltip = <div className="generic-tooltip">
      <p>Guaranteed to contain a ball reskin!</p>
      <p>WARNING: GAMBLING!</p>
      <p>Costs 2 LP.</p>
      <p></p>
      <p>{"Lootboxes Opened: " + Game.stats.state.lootboxesOpened}</p>
    </div>

    return (
      <div>
        <p className="big-text"><b>-----------BALLS-----------</b></p>
        <div className="balls-container">
          {elements}
        </div>
        <Divisor height={"40px"}/>
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
    let tooltip = (this.props.data.unlocked) ? <div className="generic-tooltip">
      <p>{this.props.data.name}</p>
      <p>{this.props.data.description}</p>
    </div> : <p>???</p>
    return (
      <Tooltip content={tooltip}>
        <Icon data={this.props.data} smooth="true" func={() => Game.ballManager.set(this.props.data.id)}/>
      </Tooltip>
    )
  }
}