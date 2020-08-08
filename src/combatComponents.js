import React, { useRef } from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header } from "./genericElements.js"
import * as data from "./generalData.js"
import 'tippy.js/dist/tippy.css';
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"

export class EnemyPanel extends React.Component {
    render() {
        var enemy = Game.combatManager.enemy;
        var hp = `${enemy.hp}/${enemy.maxHp} HP`;

        var statuses = [];
        for (let x in enemy.statuses) {
            let status = enemy.statuses[x];

            statuses.push(<p>{utils.format("{0} {1}({2} turns)", status.def.name, ((status.stacks > 1) ? "x" + status.stacks + " " : ""), status.duration)}</p>)
        }
        var tooltip = <div>{statuses}</div>

        var name = (enemy.statuses.length != 0) ? enemy.name + "*" : enemy.name;

        return (
            <div>
                <Header text="------------ENEMIES------------"></Header>
                <Tooltip content={tooltip}>
                    <p>{name}</p>
                </Tooltip>
                <ProgressBar percentage={enemy.getHpPercentage()} text={hp} level={enemy.level}></ProgressBar>
                <CombatLog></CombatLog>
            </div>
        )
    }
}

export class CombatLog extends React.Component {
    constructor(props) {
        super(props)
        this.reference = React.createRef();
    }

    render() {
        Game.combatManager.log.componentRef = this.reference;
        var msgs = [];
        for (var x in Game.combatManager.log.msgs) {
            var element = <div key={x}>
                <p>{Game.combatManager.log.msgs[x]}</p>
                <hr></hr>
            </div>
            msgs.push(element);
        }
        // this.scroll();
        return (
            <div className="combat-log">
                {msgs}
                <div ref={this.reference} style={{height: "10px"}}></div>
            </div>
        )
    }
}

export class PlayerPanel extends React.Component {
    render() {
        var turnText = (Game.combatManager.isPlayerTurn) ? "Your turn!" : ""
        var player = Game.combatManager.player;

        let weapon = Game.travel.getCurrent("weapon")
        var weaponButton = (weapon != null) ? <Button text={weapon.name} func={() => player.useWeapon()}></Button> : <Button text="NO WEAPON EQUIPPED" disabled={true}></Button>

        var statuses = [];
        for (let x in player.statuses) {
            let status = player.statuses[x];

            statuses.push(<p>{utils.format("{0} ({1} turns)", status.def.name, status.duration)}</p>)
        }
        var tooltip = <div>{statuses}</div>

        var header = (player.statuses.length != 0) ? "------------YOU*------------" : "------------YOU------------";

        return (
            <div>
                <Tooltip content={tooltip}>
                    <Header text={header}></Header>
                </Tooltip>
                <p className="your-turn">{turnText}</p>
                <ProgressBar hasXpBar={false} percentage={Game.combatManager.player.getHpPercentage()} level={Game.levelling.state.level} text={`${Game.combatManager.player.hp}/${Game.combatManager.player.maxHp} HP`}></ProgressBar>
                <div>
                    {weaponButton}
                    <Button text={"temp"} func={() => Game.combatManager.player.useMove(0)}></Button>
                    <Button text={"temp"} func={() => Game.combatManager.player.useMove(1)}></Button>
                    <Button text={"temp"} func={() => this.props.app.openPanel("items", "right")}></Button>
                </div>
            </div>
        )
    }
}