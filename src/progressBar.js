import React from 'react';
import * as Game from "./BallGame.js"
import { Button } from "./App.js"
import * as data from "./generalData.js"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { renderStatuses } from './combatComponents.js';
import { Tooltip } from "./tooltip.js"
import * as utils from "./utilities.js"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const loadingBars = importAll(require.context('./Assets/UI/ProgressBar', false, /\.(gif|jpe?g|svg|png)$/));

export class ProgressBar extends React.Component {
  render() {
      var xpBar = (this.props.hasXpBar) ? <XpBar percentage={Game.levelling.getProgress()}></XpBar> : null; // clean this up

      var progressBar = <div style={{width: "100%", transform: "translate(-15px)"}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <div className="progress-bar-parent">
            <div style={{width: "30px"}}></div>
            <div className="progress-bar" >
              <div className="filler" style={{ width: `${this.props.percentage}%` }}></div>
            </div>
            <div className="progress-bar-badge-holder">
                <img className="progress-bar-badge" src={Game.levelling.getBadgeForLevel(this.props.level)}></img>
                <p className="progress-bar-level">{this.props.level}</p>
            </div>
          </div>
        </div>
        <p className="progress-bar-text">{this.props.text}</p>
        {xpBar}
      </div>

      if (this.props.hasTooltip) {
        let statuses = renderStatuses(Game.combatManager.player)
        var tooltip = <div className="generic-tooltip">
          <p>{"Level " + Game.levelling.state.level}</p>
          <p></p>
          <p>{utils.round(Game.levelling.state.xp) + "/" + Game.levelling.goal + " XP"}</p>
          {statuses}
        </div>

        return (
          <Tooltip content={tooltip}>
            {progressBar}
          </Tooltip>
        )
      }
      else {
        return progressBar;
      }

      return ( // https://codepen.io/DZuz14/pen/oqeMpY?editors=0010
          // <div className="progress-bar-parent">
          //   <div style={{height: "40px"}}>
          //     <div style={{height: "40px"}}>
          //       <img className="progress-bar-bg" src={loadingBars["progress_bar_bg.png"]}></img>
          //       <p className="progress-bar-text absolute-centered">Level</p>
          //     </div>
          //     <div style={{overflow: "hidden"}}>
          //       <img className="progress-bar-overlay" src={loadingBars["progress_bar_filled.png"]}></img>
          //     </div>
          //   </div>
          // </div>

          <Tooltip content={tooltip}>
            
          </Tooltip>
      )
  }
}

export class XpBar extends React.Component {
  render() {
    return (
      // <Tippy content={tooltip} placement="bottom" duration="0">
      <div style={{transform: "translate(15px, -37px)"}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <div className="progress-bar-parent">
            <div className="xp-bar" >
              <div className="filler xp-bar-fill" style={{ width: `${this.props.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      //</Tippy>
    )
  }
}