import React from 'react';
import ReactDOM from "react-dom";
import * as Game from "./BallGame.js"
import { Tooltip } from "./tooltip.js"

export class Button extends React.Component {
  render() {
    return (
      <div>
        <button type="submit" onClick={() => {this.props.func()}} disabled={(this.props.disabled)}>{this.props.text}</button>
      </div>
    )
  }
}

export class Header extends React.Component {
  render() {
    return (
      <p className="big-text"><b>{this.props.text}</b></p>
    )
  }
}

export function Checkbox(props) {
  let text = (props.ticked) ? "✓" : "✕"
  return (
    <div className="checkbox" onClick={() => props.func(!props.ticked)}>
      <p>{text}</p>
    </div>
  )
}

export class PopUp extends React.Component {
  render() {
    var buttons = [];
    for (var x in this.props.data.buttons) {
      let func = this.props.data.buttons[x].func;
      var element = <Button text={this.props.data.buttons[x].text} func={(() => {func(); Game.main.app.closePopup()})} key={x}></Button>
      buttons.push(element);
    }

    var description;
    if (typeof this.props.data.description == "string") {
      description = <p className="pop-up-desc">{this.props.data.description}</p>
    }
    else {
      description = this.props.data.description;
    }

    return (
      <div className="popup-cover">
        <div className="pop-up-parent popup-box">
          <div className="pop-up-content">
            <p className="pop-up-title">{this.props.data.title}</p>
            {description}
          </div>
          <div className="pop-up-buttons">
            {buttons}
          </div>
        </div>
      </div>
    )
  }
}

export function Divisor(props) {
  return <div style={{height: props.height}}></div>
}

export function Icon(props) {
  let locked = null;
  let img = (props.data != undefined) ? props.data.icon : props.img
  if (props.data != undefined)
    locked = (props.data.unlocked) ? "" : "locked"
  var inner = <div className={"icon"} onClick={props.onClick}>
    <img className={locked} src={img}></img>
  </div>
  
  if (props.tooltip != undefined)
    return (
      <Tooltip content={props.tooltip}>
        {inner}
      </Tooltip>
    )
  else {
    return inner;
  }
}

export function ArtifactTooltip(props) {
  if (!props.data.unlocked) {
    return (
      <div className="generic-tooltip">
        <p>???</p>
      </div>
    )
  }
  return (
    <div className="generic-tooltip">
      <p>{props.data.name}</p>
      <p></p>
      <p>{props.data.description}</p>
    </div>
  )
}