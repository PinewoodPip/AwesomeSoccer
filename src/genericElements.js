import React from 'react';
import ReactDOM from "react-dom";
import * as Game from "./BallGame.js"
import { Tooltip } from "./tooltip.js"
import _ from "lodash"

export class Button extends React.Component {
  render() {
    let hiddenText = (this.props.hidden != undefined) ? this.props.hidden : false;
    let text = (hiddenText && this.props.disabled) ? "???" : this.props.text
    return (
      <div>
        <button glowing={this.props.glowing} type="submit" onClick={() => {this.props.func()}} disabled={(this.props.disabled)}>{text}</button>
      </div>
    )
  }
}

export class FileButton extends React.Component {
  async getFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    return file.text()
  }
  render() {
    return(
      <div>
        <Button type="submit" func={() => {this.upload.click()}} disabled={(this.props.disabled)} text={this.props.text}></Button>
        <input id="myInput"
          type="file"
          ref={(ref) => this.upload = ref}
          style={{display: 'none'}}
          onChange={async (e) => {let file = await this.getFile.bind(this)(e); this.props.func(file)}}
        />
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
  let extraClass = (props.ticked) ? "checkbox-ticked" : ""
  return (
    <div className={"checkbox unselectable " + extraClass} onClick={() => {props.func(!props.ticked); Game.main.render()}}>
      <p>{text}</p>
    </div>
  )
}

export function NumericInput(props) {
  let step = (props.step != undefined) ? props.step : 1;
  return (
    <input className="num-input" type="number" value={props.value} min={props.min} max={props.max} step={step} onChange={(e) => {props.func(e.target.value); Game.main.render()}}></input>
  )
}

export class PopUp extends React.Component {
  render() {
    // buttons
    var buttons = [];
    for (var x in this.props.data.buttons) {
      let button = this.props.data.buttons[x]
      if (!React.isValidElement(button)) { // object
        let func = button.func;
        var element = <Button text={this.props.data.buttons[x].text} func={(() => {func(); Game.main.app.closePopup()})}></Button>
      }
      else { // element
        var element = button;
      }
      buttons.push(<div key={x}>{element}</div>);
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

export function GenericTooltip(props) {
  let tooltip = <div className="generic-tooltip">{props.content}</div>
  if (props.content == null)
    return <div>{props.children}</div>
  return (
    <Tooltip content={tooltip}>{props.children}</Tooltip>
  )
}

export function Icon(props) {
  let smooth = props.smooth;
  let locked = null;
  let img = (props.data != undefined) ? props.data.icon : props.img
  if (props.data != undefined)
    locked = (props.data.unlocked) ? "" : "locked"
  else if (props.locked != undefined)
    locked = (props.locked) ? "locked" : ""

  let style = (props.borderless) ? {border: "none"} : null;
  var inner = <div className={"icon"} style={style} smooth={smooth} onClick={props.func} onContextMenu={props.onContextMenu}>
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
  return ( // the div is causing a prob
    <div className="generic-tooltip">
      <p>{props.data.name}</p>
      <div>{props.data.description}</div>
    </div>
  )
}