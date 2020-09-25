import React, { useRef } from 'react';
import * as Game from "./BallGame.js"
import { Button, Divisor, Header } from "./genericElements.js"
import * as data from "./generalData.js"
import 'tippy.js/dist/tippy.css';
import "animate.css"
import { Tooltip } from "./tooltip.js"
import { ProgressBar } from './progressBar.js';
import * as utils from "./utilities.js"
import { ConsumablesPanel, Equips, SoccerMoveButton } from './panels.js';

// render statuses tooltip
export function renderStatuses(entity) {
    let statuses = []
    for (let x in entity.statuses) {
        let status = entity.statuses[x];
        let durationText = (status.infinite) ? "(∞)" : ((status.duration > 1) ? "({0} turns)" : "({0} turn)").format(status.duration)

        statuses.push(<p>{utils.format("{0} {1} {2}", status.def.name, ((status.stacks > 1) ? "x" + status.stacks + " " : ""), durationText)}</p>)
    }
    return statuses;
}

export class EnemyPanel extends React.Component {
    render() {
        var enemy = Game.combatManager.enemy;
        var hp = `${enemy.hp}/${enemy.maxHp} HP`;

        
        var statuses = renderStatuses(enemy)

        var header;
        let bossTitle = (enemy.def.boss) ? "[BOSS] " : ""
        var name = (enemy.statuses.length != 0) ? enemy.name + "*" : enemy.name;
        if (statuses.length == 0) {
            header = <p>{bossTitle + name}</p>
        }
        else {
            header = <Tooltip content={<div>{statuses}</div>}>
                <p>{bossTitle + name}</p>
            </Tooltip>
        }

        return (
            <div>
                {/* <div style={{position: "absolute"}}> */}
                    <div className="hitsplat-wrapper">
                        {this.props.app.hitsplats.enemySplats}
                    </div>
                {/* </div> */}
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
        super(props);
        this.reference = React.createRef();
    }

    render() {
        Game.combatManager.log.componentRef = this.reference;
        var msgs = [];
        let previousMsgWasSpecial = false;
        for (var x in Game.combatManager.log.msgs) {
            if (Game.combatManager.log.msgs[x] == "[NEW-ROUND]") {
                var element = <div key={x}><hr className="round-change-hr"></hr></div>
                previousMsgWasSpecial = true;
            }
            else {
                var element = <div key={x}>
                    <p>{Game.combatManager.log.msgs[x]}</p>
                </div>
                previousMsgWasSpecial = false
            }

            // if (previousMsgWasSpecial) {
            //     msgs.push(<hr key={Math.random()}></hr>)
            // }
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

export function Hitsplat(props) {
    let types = {
        "healing": "text-healing",
        "default": "text-default",
        "religious": "text-religious",
        "dot": "text-dot",
    }
    return (
        <div className={"hitsplat animate__animated animate__fadeOutUp "}>
            <p className={types[props.type]}>{props.value}</p>
        </div>
    )
}

export class PlayerPanel extends React.Component {
    render() {
        let turnText = (Game.combatManager.isPlayerTurn) ? <p className="your-turn animate__animated animate__bounce">{"Your turn!"}</p> : <p className="your-turn"></p>
        var player = Game.combatManager.player;

        let weapon = Game.travel.getCurrent("weapon")
        var weaponButton = (weapon != null) ? <Button text={weapon.name.toUpperCase()} disabled={Game.combatManager.player.hasFlag("disarmed")} func={() => player.useWeapon()}></Button> : <Button text="NO WEAPON EQUIPPED" disabled={true}></Button>

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
            let disabled = (!Game.combatManager.isPlayerTurn || Game.combatManager.player.sweat >= 1)
            if (id != null) {
                let move = Game.travel.getMove(id);
                let glowing = Game.combatManager.player.willpower >= Game.combatManager.skills[move.id].def.willpower.threshold
                moveButtons.push(
                    <SoccerMoveButton data={move} text={move.name.toUpperCase()} func={() => Game.combatManager.player.useMove(x)} disabled={disabled} glowing={glowing.toString()} key={x} moveIndex={x}/>
                )
            }
            else {
                moveButtons.push(
                    <Button text={"NO MOVE EQUIPPED"} disabled key={x}/>
                )
            }
        }

        let bottomButtons = null;
        if (this.props.app.state.hasConsumablesMenuOpen) {
            bottomButtons = <ConsumablesPanel app={this.props.app}/>
        }
        else {
            let text = (Game.travel.hasAnyConsumables) ? "ITEMS" : "NO ITEMS"
            let disabled = (!Game.travel.hasAnyConsumables)
            bottomButtons = <div>
                {weaponButton}
                {moveButtons}
                <Button text={text} func={() => this.props.app.setState({hasConsumablesMenuOpen: true,})} disabled={disabled}></Button>
            </div>
        }

        return (
            <div>
                <div className="hitsplat-wrapper">
                    {this.props.app.hitsplats.playerSplats}
                </div>
                {header}
                {turnText}
                <ProgressBar hasXpBar={false} percentage={Game.combatManager.player.getHpPercentage()} level={Game.levelling.state.level} text={`${Game.combatManager.player.hp}/${Game.combatManager.player.maxHp} HP`}></ProgressBar>

                {bottomButtons}

                <Equips/>
            </div>
        )
    }
}