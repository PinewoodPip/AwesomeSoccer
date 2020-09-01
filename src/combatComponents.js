import React, { useRef } from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header } from "./genericElements.js"
import * as data from "./generalData.js"
import 'tippy.js/dist/tippy.css';
import "animate.css"
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"

// render statuses tooltip
export function renderStatuses(entity) {
    let statuses = []
    for (let x in entity.statuses) {
        let status = entity.statuses[x];

        statuses.push(<p>{utils.format("{0} {1}({2} turns)", status.def.name, ((status.stacks > 1) ? "x" + status.stacks + " " : ""), status.duration)}</p>)
    }
    return statuses;
}

export class EnemyPanel extends React.Component {
    render() {
        var enemy = Game.combatManager.enemy;
        var hp = `${enemy.hp}/${enemy.maxHp} HP`;

        
        var statuses = renderStatuses(enemy)

        var header;
        var name = (enemy.statuses.length != 0) ? enemy.name + "*" : enemy.name;
        if (statuses.length == 0) {
            header = <p>{name}</p>
        }
        else {
            header = <Tooltip content={<div>{statuses}</div>}>
                <p>{name}</p>
            </Tooltip>
        }

        return (
            <div>
                <Header text="------------ENEMIES------------"></Header>
                {header}
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
        let turnText = (Game.combatManager.isPlayerTurn) ? <p className="your-turn animate__animated animate__bounce">{"Your turn!"}</p> : <p className="your-turn"></p>
        var player = Game.combatManager.player;

        let weapon = Game.travel.getCurrent("weapon")
        var weaponButton = (weapon != null) ? <Button text={weapon.name.toUpperCase()} func={() => player.useWeapon()}></Button> : <Button text="NO WEAPON EQUIPPED" disabled={true}></Button>

        // render statuses tooltip
        var statuses = renderStatuses(player)

        // player header
        var header;
        var name = (player.statuses.length != 0) ? "------------YOU*------------" : "------------YOU------------";
        if (statuses.length == 0) {
            header = <Header text={name}></Header>
        }
        else {
            header = <Tooltip content={<div>{statuses}</div>}>
                <Header text={name}/>
            </Tooltip>
        }

        // soccer move buttons
        let moveButtons = [];
        for (let x in Game.travel.state.loadout.moves) {
            let id = Game.travel.state.loadout.moves[x]
            if (id != null) {
                let move = Game.travel.getMove(id);
                let glowing = Game.combatManager.player.willpower >= Game.combatManager.skills[move.id].def.willpower.threshold
                moveButtons.push(
                    <Button text={move.name.toUpperCase()} func={() => Game.combatManager.player.useMove(x)} disabled={!Game.combatManager.isPlayerTurn} glowing={glowing} key={x}/>
                )
            }
            else {
                moveButtons.push(
                    <Button text={"NO MOVE EQUIPPED"} disabled key={x}/>
                )
            }
        }

        return (
            <div>
                {header}
                {turnText}
                <ProgressBar hasXpBar={false} percentage={Game.combatManager.player.getHpPercentage()} level={Game.levelling.state.level} text={`${Game.combatManager.player.hp}/${Game.combatManager.player.maxHp} HP`}></ProgressBar>
                <div>
                    {weaponButton}
                    {moveButtons}
                    <Button text={"temp"} func={() => this.props.app.openPanel("items", "right")}></Button>
                </div>
            </div>
        )
    }
}