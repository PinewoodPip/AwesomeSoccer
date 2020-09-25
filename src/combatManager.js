import React from 'react';
import { travel, combatManager, levelling, ballGame, main, ballManager } from "./BallGame.js"
import { Player, Enemy, skillTypeDict, statusTypeDict } from "./combat.js"
import * as utils from "./utilities.js"
import * as data from "./generalData.js"
import { PlayerPanel } from "./combatComponents.js";
import _ from "lodash"

export class CombatManager {
  constructor() {
    this.skills = {};
    this.statuses = {};
    this.player = new Player(data.entities["player"]);
    this.round = 0;
    this.isPlayerTurn = false;
    this.inCombat = false;
    this.log = new Log();

    for (let x in data.skills) {
      var def = data.skills[x]
      def.id = x; // ensure we do not have misspelled ids
      // console.log(def)
      var skill = new skillTypeDict[def.behaviour](def);
      this.skills[def.id] = skill;
    }

    for (let x in data.entities) {
      data.entities[x].id = x;
    }

    setInterval(this.oocTick, this.OOC_TIMER)

  }

  ending = false;

  area;

  OOC_TIMER = 1000;
  OOCWillpowerDrain = 0.02;
  OOC_SWEAT_DRAIN = 0.02;
  TURN_DELAY = 1000;

  oocTick() {
    if (!combatManager.inCombat) {
      let player = combatManager.player;
      let heal = combatManager.player.getRealStats().oocHealing;

      if (travel.hasArtifact("engraved_ring"))
        heal += combatManager.player.maxHp * 0.04;
        
      combatManager.player.heal(heal);

      combatManager.player.loseWillpower(combatManager.OOCWillpowerDrain)
      combatManager.player.loseSweat(combatManager.OOC_SWEAT_DRAIN)

      for (let x in player.statuses) {
        player.statuses[x].onTurnOOC();
      }

      main.render();
    }
  }

  setupFight(area) {
    var totalWeight = 0;
    var enemyId;

    this.log.clear();
    main.app.hitsplats.clear();

    // enemy selection. picks the area boss if the areaprogress requirement is met (100pts)
    if (travel.state.areaProgress[area.id] >= travel.bossRequirement) {
      enemyId = area.boss.id;
      travel.state.areaProgress[area.id] -= travel.bossRequirement;
    }
    else {
      for (let x in area.enemies) {
        totalWeight += area.enemies[x].weight
      }
      var seed = totalWeight * Math.random();
      for (let x in area.enemies) {
        seed -= area.enemies[x].weight
        if (seed <= 0) {
          enemyId = area.enemies[x].id;
          this.progressReward = area.enemies[x].areaProgress;
          break;
        }
      }
    }

    var enemyDef = data.entities[enemyId];
    var playerLevel = levelling.state.level;

    let minLevel = Math.max(area.levelRange.min, (playerLevel - 3))
    let maxLevel =  Math.min(area.levelRange.max, Math.max((playerLevel + 2), minLevel+2))

    var enemyLevel = utils.randomFromRange(minLevel, maxLevel)
    this.enemy = new Enemy(enemyDef, enemyLevel)
    this.inCombat = true;
    this.round = 1;
    this.isPlayerTurn = true;
    this.area = area;

    // entry message
    let message = (this.enemy.def.boss) ? this.area.bossEntryMessage : _.sample(this.area.entryMessages);
    this.log.push(message.format(this.enemy.name))
    this.log.push("[NEW-ROUND]")

    // on-combat-start effects
    let chair = travel.getArtifact("racing_chair")
    if (chair.equipped) {
      combatManager.player.gainWillpower(combatManager.player.maxWillpower * chair.tuning.willpower)
      combatManager.player.gainSweat(chair.tuning.sweat)

      combatManager.log.push("You lean in onto the edge of your seat...!!!")
    }

    let mentalPerk = travel.getPerk("mental_gymnastics")
    if (mentalPerk.unlocked) {
      this.enemy.applyStatus(new statusTypeDict["mental_gymnastics"](this.player, this.enemy, data.statuses["mental_gymnastics"], 9999, true))
      console.log(this.enemy.getRealStats())
    }

    main.app.startCombat();

    travel.showTutorial("combat_intro")

    this.tickTurn();
  }

  playerUsedAction() {
    this.pass(combatManager.player)
  }

  pass(entity) {
    var currentCombatant = (this.isPlayerTurn) ? this.player : this.enemy;
    if (entity == currentCombatant) {
      this.log.push("[NEW-ROUND]")

      if (entity.isDead) {
        if (entity.isPlayer) {
          console.log("Game over")
        }
        else {
          console.log("Victory!")
        }
      }
      else {
        entity.onTurnEnd();
        console.log(utils.format("{0}'s turn has ended.", entity.name))
      }

      if (!this.isPlayerTurn) // how did moving this fix the end/start issue wtf
        this.round++;
      this.isPlayerTurn = !this.isPlayerTurn;

      setTimeout(this.tickTurn.bind(this), this.TURN_DELAY)
      main.render();
      // this.tickTurn();
    }

    main.app.render();
  }

  tickTurn() {
    var entity = (this.isPlayerTurn) ? this.player : this.enemy;

    if (entity.isDead) {
      this.ending = true;
      if (entity.isPlayer) {
        this.log.push("You've been defeated and give up.")
        main.render()
        setTimeout(() => {this.endCombat("defeat")}, this.TURN_DELAY)
        // this.endCombat("defeat")
      }
      else {
        this.log.push("{0} has been defeated and gives up!".format(this.enemy.name))
        main.render()
        setTimeout(() => {this.endCombat("win")}, this.TURN_DELAY)
      }
    }
    else {
      console.log(utils.format("{0}'s turn has started.", entity.name))
      console.log(entity)
      entity.onTurnStart();
    }

    main.app.render();
  }

  endCombat(reason) {
    if (!this.inCombat)
      return;
    if (!this.ending)
      return;
    if (reason == "win") {
      var xp = this.enemy.stats.xpReward;
      var title = utils.format("{0} was defeated!", this.enemy.name)
      
      var desc = travel.rollLoot(this.enemy, this.area)
      let wasBoss = this.enemy.def.boss;

      main.addPopup({
        title: title,
        description: desc,
        buttons: [
          {text: "ALRIGHT COOL", func: function(){
            levelling.gainXp(xp * data.global.enemyXpMultiplier);
            if (travel.hasArtifact("bottled_glass")) {
              let art = travel.getArtifact("bottled_glass")
              let status = data.statuses[art.tuning.buff]
              this.player.applyStatus(new statusTypeDict[status.behaviour](this, this.player, status, 3, false))
            }
            this.closeCombat("win", wasBoss)}.bind(this)}
        ]
      })

      if (!travel.hasStatCardUnlocked) {
        main.addPopup({
          title: "YOU GOT MAIL",
          description: <p>Would you look at that, your Fight Club Card arrived just in time for your first victory in combat!<br/>You can now view your combat stats in the stats screen!</p>,
          buttons: [
            {text: "ALRIGHT COOL", func: function(){}}
          ]
        })
      }
      travel.state.areaProgress[this.area.id] += this.progressReward;
      travel.state.bestiary[this.area.id].fightsWon += 1;
    }
    else {
      // this.log.push("You have been defeated and give up.")

      // if you died against a boss, refund some areaProgress
      travel.state.areaProgress[this.area.id] += travel.bossRequirement * data.global.areaProgressRefund;

      setTimeout(() => {
        this.closeCombat("defeat");
        main.addPopup({
          title: "DEFEAT",
          description: data.strings.DEFEAT_DESC,
          buttons: [
            data.popupButtons.gameOver,
          ]
        })
      }, this.TURN_DELAY);
    }
    this.ending = false;
  }

  closeCombat(result, wasBoss=false) {
    main.app.exitCombat();

    if (result == "win" && wasBoss && this.area.next != null && !travel.state.unlocks.areas.includes(this.area.next)) {
      travel.unlock("area", this.area.nextArea)
      travel.state.giftcards++;

      main.addPopup({
        title: "NEW AREA UNLOCKED",
        description: <div>
          <p>{"Following your glorious victory against {0}, a new region waits to be conquered.".format(this.enemy.name)}</p>
          <p>{"You can now travel to {0}!".format(data.travelAreas[this.area.nextArea].name)}</p>
          <p>You also gained a Gym Membership Giftcard!</p>
        </div>,
        buttons: [
          data.popupButtons.excitedClose,
        ]
      })
    }

    if (result == "win" && this.enemy.def.id == "hexer") {
      main.addPopup({
        title: "END OF THE LINE",
        description: <div>
          <p>You completed the last area currently available in the game. Congrats, and thanks for playing!</p>
          <p>You can continue playing to complete your collectibles collection if you want to.</p>
        </div>,
        buttons: [
          data.popupButtons.excitedClose,
        ]
      })
    }

    // if (this.enemy.)

    this.enemy = null;
    this.area = null;
    this.inCombat = false;
    this.player.removeCombatStatuses();
    this.log.clear();
  }

  rollAccuracy(user, target, def) {
    var userStats = user.getRealStats();
    var targetStats = target.getRealStats();
    var acc = userStats.acc * def.acc;

    var dodge = (def.dodgeable) ? targetStats.dodge : 0;
    var block = targetStats.block;
    var roll = Math.random();

    // stunned targets cannot dodge/block
    if (target.isStunned)
      return "hit"

    if (utils.checkRoll(block))
      return "blocked";
    else if (roll < (acc - dodge))
      return "hit";
    else if (roll < acc)
      return "dodged"
    else
      return "miss"
  }

  // does not take def (or the enemy at all) into account
  getAverageDmg(user, def) {
    var dmg = user.getRealStats().dmg * def.mult;

    return dmg;
  }

  sendStatusMsg(context, hit, status, fakeStatus) {
    if (status == null)
      status = fakeStatus;
    
    var msgs = (status.target.isPlayer) ? status.def.log.player : status.def.log.enemy;
    var params = [];
    var msg = msgs[context];

    if (msg == null)
      return;

    for (let x in msg.params) {
      console.log(msg.params)
      switch(msg.params[x]) {
        case "target":
          params.push(status.target.name);
          break;
        case "user":
          params.push(status.user.name);
          break;
        case "dmg":
          params.push(hit.dmg);
          break;
        case "heal":
          params.push(hit.heal);
          break;
        case "status":
          params.push(status.def.name);
          break;
      }
    }

    let str = utils.format(msg.msg, ...params)

    combatManager.log.push(str);
  }

  rollStatuses(hit, def) {
    for (let x in def.statuses) {
      let eff = def.statuses[x];
      let empower = (eff.empowered != undefined) ? true : false
      let possible = (empower) ? hit.empowered : (!hit.empowered) // require empowered hit for empowered effects
      let chance = eff.chance;

      // modify chance based on SR (StatusResistance) stat
      if (!eff.positive && eff.manipulatable)
        chance *= hit.target.manipulation

      // soccer moves have upgradeable status chances
      if (def.soccerMove != null) {
        if (def.special.bonusSuccessChancePerLevel != undefined) {
          let save = travel.getMove(def.soccerMove)
          chance += def.special.bonusSuccessChancePerLevel * (save.level - 1)
        }
      }

      if (possible) {
        if (utils.checkRoll(chance)) {
          hit.statuses.push(eff);
        }
        else {
          let fakeStatus = {
            user: hit.user,
            target: hit.target,
            def: data.statuses[eff.id],
          }
          this.sendStatusMsg("failed", hit, fakeStatus)
        }
      }
    }

    return hit;
  }

  rollStatusOnlyHit(user, target, def, postProcessFunc) {
    var hit = {
      get rawDmg() {return utils.round(this._dmg, 1)},
      set rawDmg(val) {
        this._dmg = val;
      },
      get dmg() {
        let mult = 1;
        if (this.crit)
          mult = this.user.getRealStats().critMult;
        return utils.round(this._dmg * this.target.dmgReduction * mult, 1)
      },
      set dmg(val) {this._dmg = val}, // legacy
      crit: false,
      dmgType: "default",
      empowered: false,
      user: user,
      target: target,
      skill: def,
      outcome: "hit",
      averageDmg: 0,
      get heal() {return utils.round(this._heal)},
      set heal(val) {this._heal = val},
      statuses: [],
    };
    hit.rawDmg = 0;
    hit.heal = 0;

    console.log(postProcessFunc)
    hit = (postProcessFunc != null) ? postProcessFunc(hit) : hit;
    console.log(hit)
    hit = this.rollStatuses(hit, def)

    return hit;
  }

  rollDmg(user, target, def, postProcessFunc, dmgDefParam) {
    var dmgDef = (dmgDefParam != undefined) ? dmgDefParam : def.dmg;
    var hit = {
      get rawDmg() {return utils.round(this._dmg, 1)},
      set rawDmg(val) {
        this._dmg = val;
      },
      get dmg() {
        let mult = 1;
        if (this.crit)
          mult = this.user.getRealStats().critMult;
        return utils.round(this._dmg * this.target.dmgReduction * mult, 1)
      },
      set dmg(val) {this._dmg = val}, // legacy
      crit: false,
      dmgType: "default",
      empowered: false,
      user: user,
      target: target,
      skill: def,
      outcome: this.rollAccuracy(user, target, dmgDef),
      averageDmg: this.getAverageDmg(user, dmgDef),
      get heal() {return utils.round(this._heal)},
      set heal(val) {this._heal = val},
      statuses: [],
    };

    if (utils.noneCheck(def) && def.heal != undefined) {
      hit.heal = def.heal.flatAmount + (def.heal.percentAmount * user.maxHp)
    }

    let range = dmgDef.range; // this doesnt override it right
    if (hit.user == combatManager.player) {
      if (hit.user.hasFlag("reducedDamageVariance")) {
        range -= 0.05
        range = utils.limitRange(range, 0, 9999)
      }

      if (hit.user.hasFlag("torment")) {
        if (hit.target.statuses.length > 0)
          hit.rawDmg *= 1.2;
      }
    }

    // get user damage and multiply by skill's mult, and add some randomness through the skill's dmgRange attribute. 0.1 dmgRange = +-10% damage
    hit.rawDmg = user.getRealStats().dmg * dmgDef.mult * utils.randomFromRangeFloat(1-range, 1+range);

    if (dmgDef.type != undefined && dmgDef.type != "default") {
      hit.dmgType = dmgDef.type;

      // apply dmg type bonuses
      hit.rawDmg *= hit.user.getDamageMultiplier(dmgDef.type)
      hit.rawDmg *= hit.target.getResistanceMultiplier(dmgDef.type)
    }

    if (utils.checkRoll(user.critChance)) {
      console.log("Crit!")
      hit.crit = true;
      // hit.rawDmg *= user.critMult;
    }

    hit = (postProcessFunc != null) ? postProcessFunc(hit) : hit;

    // roll statuses
    if (utils.noneCheck(def)) { // can only roll statuses from a skill def
      hit = this.rollStatuses(hit, def)
    }


    // special ball powers
    if (user == this.player) {
      switch (ballManager.state.equipped) {
        case "d20": {
          if (ballGame.d20roll == 1) { // critical failure
            this.log.push("Critical failure!")
            hit.outcome = "miss"
          }
          else if (ballGame.d20roll == 20) { // critical success
            this.log.push("Critical success!")
            hit.crit = true;
          }
          break;
        }
      }
    }

    console.log(hit)
    return hit;
  }
}

const scrollToRef = (ref) => {
  //ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // ref.current.scrollTop += 1000;
}

class Log {
  msgs = [];
  componentRef = null;

  push(msg) {
    this.msgs.push(msg)

    if (this.componentRef != null)
      scrollToRef(this.componentRef)
  }

  clear() {
    this.msgs = [];
  }
}