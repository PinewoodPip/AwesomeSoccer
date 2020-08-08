import React from 'react';
import * as Game from "./BallGame.js"

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

export class PopUp extends React.Component {
  render() {
    var buttons = [];
    for (var x in this.props.data.buttons) {
      var element = <Button text={this.props.data.buttons[x].text} func={() => {this.props.data.buttons[x].func(); Game.main.app.closePopup()}} key={x}></Button>
      buttons.push(element);
    }
    return (
      <div className="popup-cover">
        <div className="pop-up-parent popup-box">
          <div className="pop-up-content">
            <p className="pop-up-title">{this.props.data.title}</p>
            <p className="pop-up-desc">{this.props.data.description}</p>
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