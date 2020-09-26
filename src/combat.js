import { travel, combatManager, levelling, ballGame, main, shoes } from "./BallGame.js"
import update from "immutability-helper"
import * as utils from "./utilities.js"
import * as data from "./generalData.js"
import _ from "lodash"
String.prototype.format = function () { // by gpvos from stackoverflow
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

export class Entity {
  constructor(def, level=1) {
    let skills = []
    for (var x in def.skills) {
      var skill = {};
      // skill.skill = combatManager.skills[def.skills[x]]
      skill.id = def.skills[x].id
      if (def.skills[x].weight == undefined)
        skill.weight = 20;
      else
        skill.weight = def.skills[x].weight
      skills.push(skill)
    }
    this.def = def;
    this.skills = skills;
    this.name = def.name;
    this.description = def.description;

    this.stats = {};
    Object.assign(this.stats, this.def.baseStats)
    this.growth = {};
    Object.assign(this.growth, this.def.growth)

    if (def.deltaOverride != undefined) {
      for (var z in def.deltaOverride) {
          this.stats[z] += def.deltaOverride[z];
      }
    }

    this.level = this.stats.definitionLevel;
    this.hp = this.maxHp;

    this.scale(level);
  }

  statuses = [];
  _willpower = 0;
  _sweat = 0;
  charge = 0;
  chargedSkill = null;

  // player has a different one
  get willpowerMult() {
    let mult = 1;
    let stats = this.getRealStats();
    mult += stats.wpGen;

    return mult;
  }

  get hp() {return utils.round(this._hp)}
  set hp(val) {this._hp = Math.max(Math.min(val, this.maxHp), 0);}
  get isPlayer() {return false;}
  get isDead() {return (this.hp <= 0)}
  get maxHp() {
    var realStats = this.getRealStats();
    return realStats.baseHp * realStats.hpMult;
  }
  get dmg() {
    var realStats = this.getRealStats();
    return realStats.baseDmg * realStats.dmgMult;
  }
  get willpowerPercentage() {return this.willpower * 100};
  get sweatPercentage() {return this.sweat * 100};
  get willpower() {return utils.round(this._willpower, 2)}
  set willpower(val) { // make this a func
    this._willpower = Math.min(Math.max(val, 0), this.maxWillpower)
  }
  get maxWillpower() {return 1}; //todo
  get sweat() {return utils.round(this._sweat, 2)}
  set sweat(val) {
    this._sweat = Math.min(Math.max(val, 0), this.maxSweat)
  }
  get maxSweat() {return 1}; //todo
  get dmgReduction() { // capped at 0.1x
    return Math.max(1 - this.getRealStats().defense, 0.1)
  }

  get isStunned() {
    for (let x in this.statuses) {
      if (this.statuses[x].def.isStun)
        return true;
    }
    return false;
  }

  get critChance() {return this.getRealStats().critChance}
  get critMult() {return this.getRealStats().critMult}

  get manipulation() {return 1 + this.getRealStats().statusResistance}

  get willpowerPerTurn() {return this.getRealStats().turnWp}

  get magicFindMultiplier() {return 1 + this.getRealStats().magicFind}

  get sweatMult() {return (1 - this.getRealStats().sweatMult)}
  // player overrides this
  hasFlag(flag) {return false;}
  get flags() {return []}

  resetChargedSkill() {
    this.charge = 0;
    this.chargedSkill = null;
  }

  onTurnStart() {
    this.tickStatuses("onTurnStart");
  }
  onTurnEnd() {
    this.tickStatuses("onTurnEnd");
  }

  getRandomStatus(neg=false) {
    let statuses = (neg) ? _.cloneDeep(this.statuses.filter((x) => {return !x.def.positive})) : _.cloneDeep(this.statuses);

    statuses = utils.shuffle(statuses)

    let stat = statuses[0];

    // absolute genius, man, gotta clap myself on the back
    return this.statuses[this.statuses.indexOf(stat)];
  }

  tickStatuses(context) {
    for (let x in this.statuses) {
      let status = this.statuses[x];
      switch(context) {
        case "onTurnStart": {
          status.onTurnStart();
          break; // why is this needed? why does it "overflow" into the next case without a break?
        }
        case "onTurnEnd": {
          status.onTurnEnd();
          status.reduceDuration();
          break;
        }
        case "ooc": {
          status.onTurnOOC();
          status.reduceDuration(); // should this be handled within the status methods?
          break;
        }
      }
    }
  }

  removeCombatStatuses() {
    for (let x in this.statuses) {
      let status = this.statuses[x];

      if (!status.def.ooc) {
        this.removeStatus(status);
      }
    }
  }

  getStatusStatMods() {
    var totalStatMods = _.cloneDeep(data.emptyStatSheet)

    // multiplier for positive statmods
    let positiveBuffMult = 1;
    if (this.isPlayer && travel.hasArtifact("chronicle")) {
      positiveBuffMult = travel.getArtifact("chronicle").tuning.statMult;
    }

    for (let x = 0; x < this.statuses.length; x++) {
        let effect = this.statuses[x];
        var mods = this.statuses[x].def.statMods;
        for (var z in mods) {
          let val = mods[z]
          if (val > 0)
            val *= positiveBuffMult
          totalStatMods[z] += (mods[z] * effect.stacks);
        }
    }

    return totalStatMods;
  }

  getStatus(status) {
    for (let x in this.statuses) {
      if (this.statuses[x].def.id == status.def.id) {
        return this.statuses[x];
      }
    }
    return null;
  }

  applyStatus(status) {
    var eff = this.getStatus(status)
    if (eff != null) {
      if (eff.stackable) {
        eff.stacks += 1;
        if (eff.def.stacking.refreshDurationOnStackGain)
          eff.duration = Math.max(status.duration, eff.duration);
        eff.onApply();
      }
      // allow reapplying statuses if the new instance has higher duration
      else if (status.duration > eff.duration) {
        eff.duration = status.duration;
      }

      console.log(utils.format("{0} was affected by {1} again", eff.target.name, eff.def.name))
    }
    else {
      this.statuses.push(status);
      status.onApply();

      console.log(utils.format("{0} was affected by {1}", status.target.name, status.def.name))
    }
  }

  removeStatus(status) {
    var eff = this.getStatus(status)
    if (eff != null) {
      this.statuses.splice(this.statuses.indexOf(status))

      console.log(utils.format("{0} has worn off on {1}", status.def.name, status.target.name))
    }
  }

  gainWillpower(amount, dmgDone=0, averageDmg=0, useMultiplier=true) {
    let mult = (utils.noneCheck(dmgDone)) ? dmgDone/averageDmg : 1;
    let wpmult = (useMultiplier) ? this.willpowerMult : 1
    this.willpower += amount * mult * wpmult; // todo add wp regen mult stat
  }

  loseWillpower(amount) {
    this.willpower -= amount;
  }

  spendWillpower(amount) {
    if (travel.hasArtifact("engraved_ring")) {
      let art = travel.getArtifact("engraved_ring")

      let healing = this.maxHp * art.tuning.healingPerWillpower * amount
      combatManager.log.push("The Engraved Ring of Healing restores {0} health upon you!".format(healing))
      this.heal(healing)
    }

    this.willpower -= amount;
  }

  loseSweat(amount) {
    this.sweat -= amount;
  }

  gainSweat(amount) {
    console.log(this.sweatMult)
    this.sweat += (amount * this.sweatMult);
  }

  healSweat(amount) {
    this.sweat -= amount;
  }

  heal(amount) {
    this.hp += amount;
  }

  cast(skillId) {
    console.log(skillId)
    combatManager.skills[skillId].cast(this);
    main.render();
  }

  getHpPercentage() {
    return (this.hp / this.maxHp) * 100;
  }

  getRealStats() {
    var realStats = _.cloneDeep(this.stats)
    let statMods = this.getStatusStatMods();

    for (let x in statMods) {
      realStats[x] += statMods[x]
    }

    if (this.isPlayer) {
      let shoeMods = shoes.shoeStatMods;
      for (let x in shoeMods) {
        realStats[x] += shoeMods[x];
      }

      if (travel.state.loadout.weapon == "shield")
        realStats.baseBlock += 0.1;
    }

    realStats.dmg = Math.max(realStats.baseDmg * realStats.dmgMult, 0);
    realStats.acc = Math.max(realStats.baseAcc, 0);
    realStats.dodge = realStats.baseDodge;
    realStats.block = realStats.baseBlock;

    if (this.isPlayer) {
      if (travel.hasArtifact("monocles_of_duality")) {
        let art = travel.getArtifact("monocles_of_duality")
        realStats.critChance += art.tuning.bonusCritChance
      }

      // allowance perk
      let allowance = travel.getPerk("allowance")
      realStats.turnWp += allowance.level * allowance.tuning.boost
    }
    
    return realStats;
  }

  scale(level) {
    if (level <= this.level)
      return;
    for (let z = level-this.level; z > 0; z--) { // dont need to nest loops here unless we going to need a stat that isnt linear
      for (let x in this.growth) {
        this.stats[x] += this.growth[x];
      }
    }

    this.level = level;
    this.hp = this.maxHp;
  }

  receiveDmg(hit, silent=true) {
    if (hit.outcome != "hit") {
      if (hit.user.isPlayer && travel.hasArtifact("monocles_of_duality") && hit.outcome != "blocked") {
        let status = data.statuses[travel.getArtifact("monocles_of_duality").tuning.negativeStatus];
        hit.user.applyStatus(new statusTypeDict[status.behaviour](hit.user, hit.user, status, 3));
      }

      return;
    }

    if (hit.user.isPlayer && travel.hasArtifact("monocles_of_duality") && hit.outcome != "blocked") {
      let status = data.statuses[travel.getArtifact("monocles_of_duality").tuning.positiveStatus];
      hit.user.applyStatus(new statusTypeDict[status.behaviour](hit.user, hit.user, status, 3));
    }

    let art = travel.getArtifact("realitious_virtuality_binocles")
    if (this.isPlayer && art.equipped && this.willpower >= art.tuning.cost && hit.dmg >= this.maxHp * art.tuning.threshold) {
      this.spendWillpower(art.tuning.cost)

      combatManager.log.push("The immersion of your RVBs nullifies damage!")
    }
    else {
      this.hp -= hit.dmg;
    }

    // self-dmg from confusion etc
    if (hit.skill != null && hit.user.getRealStats().selfDmg > 0) {
      let dmgDef = {
        mult: hit.user.dmg * hit.user.getRealStats().selfDmg,
        type: "default",
        range: 0.1,
        acc: 1,
        dodgeable: false,
      }
      let newhit = {
        get rawDmg() {return utils.round(this._dmg, 1)},
        set rawDmg(val) {
          this._dmg = val;
        },
        get dmg() {return utils.round(this._dmg * this.target.dmgReduction, 1)},
        set dmg(val) {this._dmg = val}, // legacy
        crit: false,
        dmgType: "default",
        empowered: false,
        user: hit.user,
        target: hit.user,
        skill: null,
        outcome: "hit",
        averageDmg: combatManager.getAverageDmg(hit.user, dmgDef),
        get heal() {return utils.round(this._heal)},
        set heal(val) {this._heal = val},
        statuses: [],
      }
      hit.user.receiveDmg(newhit)
    }

    if (hit.skill != null) {
      if (hit.skill.log.autoLogDmg) {
        this.logDmg(hit);
      }
  
      if (hit.user.isPlayer && hit.skill.isWeaponSkill) {
        if (travel.hasArtifact("cleansing_talisman")) {
          let art = travel.getArtifact("cleansing_talisman")
          let remove = null;
          for (let x in this.statuses) {
            let status = this.statuses[x]
            if (!status.def.positive) {
              remove = status;
              break;
            }
          }
          if (remove != null) {
            this.removeStatus(remove)
            hit.user.gainWillpower(art.tuning.willpowerGain)
            combatManager.log.push("You cleanse {0} off of {1} and gain Willpower!".format(remove.def.name, hit.target.name))
          }
        }
      }
    }

    // healing
    if (hit.heal > 0) {
      switch (hit.skill.heal.target) {
        case "self": {
          hit.user.heal(hit.heal)
          break;
        }
        case "target": {
          hit.target.heal(hit.heal);
        }
      }
    }

    // apply statuses
    for (let x in hit.statuses) {
      var id = hit.statuses[x].id
      var def = data.statuses[id];
      this.applyStatus(new statusTypeDict[def.behaviour](hit.user, hit.target, def, hit.statuses[x].duration))
    }

    if (hit.user == combatManager.player && hit.target != combatManager.player) {
      if (hit.user.hasFlag("willpowerOnHit")) {
        hit.user.gainWillpower(0.05, 0, 0, false)
      }
    }

    // generate hitsplat
    main.generateHitsplat(hit)

    main.render();
  }

  getDamageMultiplier(type) {
    return 1 + this.getRealStats()[data.dmg_dict[type]];
  }

  getResistanceMultiplier(type) {
    return 1 - this.getRealStats()[data.resist_dict[type]];
  }

  logDmg(hit) {}
}

export class Player extends Entity {
  constructor(def, level=1) {
    super(def, level);
    this.scale(levelling.state.level);
  }

  hasFlag(flag) {
    let flags = this.flags;
    return flags.includes(flag);
  }

  get flags() {
    let flags = [...shoes.getShoeFlags()]

    // status effect flags
    for (let x in this.statuses) {
      let status = this.statuses[x]
      for (let z in status.def.flags) {
        flags.push(status.def.flags[z]);
      }
    }
    return flags;
  }

  useWeapon() {
    if (combatManager.isPlayerTurn) {
      this.cast(travel.state.loadout.weapon);
      if (travel.hasArtifact("zeal")) {
        let art = travel.getArtifact("zeal");
        if (this.willpower >= this.maxWillpower * art.tuning.threshold) {
          combatManager.log.push("You perform a zealous strike!")
          this.spendWillpower(art.tuning.willpowerLoss);
          this.cast(travel.state.loadout.weapon);
        }
      }
      combatManager.playerUsedAction(); // todo also handle ball this way
    }
  }

  useMove(slot) {
    if (combatManager.isPlayerTurn) {
      this.cast(travel.state.loadout.moves[slot])
      combatManager.playerUsedAction();
    }
  }

  logDmg(hit) {
    var str = `You take ${hit.dmg} damage!`
    combatManager.log.push(str);
  }

  onTurnStart() {
    // passive willpower gain (turnWp stat) - CANNOT HAPPEN ON TURN 1
    if (this.willpowerPerTurn > 0 && combatManager.round > 1) {
      this.gainWillpower(this.willpowerPerTurn)
    }

    if (travel.hasArtifact("bottled_glass")) {
      let art = travel.getArtifact("bottled_glass")
      let status = data.statuses[art.tuning.debuff]
      this.applyStatus(new statusTypeDict[status.behaviour](this, this, status, 2, false))
    }

    if (travel.hasArtifact("travelling_mug")) {
      let art = travel.getArtifact("travelling_mug")
      if (this.willpower < art.tuning.threshold) {
        this.gainSweat(art.tuning.sweatInflicted)
      }
    }

    this.tickStatuses("onTurnStart");
    main.render();

    if (this.isStunned) {
      combatManager.log.push("You're stunned!")
      combatManager.playerUsedAction();
    }
    else if (this.chargedSkill != null) {
      combatManager.skills[this.chargedSkill].cast(this);
      combatManager.playerUsedAction();
    }
  }

  get isPlayer() {return true;}
  get willpowerMult() {
    let mult = 1;

    let flow = travel.getPerk("flow")
    if (flow.unlocked && ballGame.state.streak >= 3) {
      mult += flow.tuning.baseBoost + (flow.tuning.levelBoost * (flow.level-1))
    }

    let stats = this.getRealStats();
    mult += stats.wpGen;

    let art = travel.getArtifact("clipboard")
    if (art.equipped) {
      let hpPercentage = this.hp / this.maxHp;

      if (hpPercentage > art.tuning.threshold) {
        let steps = (hpPercentage - art.tuning.threshold) / 0.02
        mult += art.tuning.step * steps
      }
      else {
        let steps = (art.tuning.threshold - hpPercentage) / 0.02
        mult -= art.tuning.step * steps
      }
    }

    return mult;
  }
  get maxWillpower() {
    let max = 1;

    if (travel.hasArtifact("travelling_mug")) {
      max += travel.getArtifact("travelling_mug").tuning.maxWillpowerIncrease;
    }

    return max;
  }
}

export class Enemy extends Entity {
  constructor(def, level=1) {
    super(def, level);
    this.scale(level);
  }

  logDmg(hit) {
    var str = `${this.name} takes ${hit.dmg} damage!`
    combatManager.log.push(str);
  }

  onTurnStart() {
    this.tickStatuses("onTurnStart");

    if (this.isStunned) {
      combatManager.log.push("{0} is stunned!".format(this.name))
      combatManager.pass(this)
    }
    else {
      this.ai();
    }
  }

  ai() {
    this.chooseSkillToCast()
  }

  chooseSkillToCast() {
    var id;
    var totalWeight = 0;

    if (this.chargedSkill != null) {
      id = this.chargedSkill;
    }
    else {
      for (let x in this.skills) {
        totalWeight += this.skills[x].weight;
      }
      let seed = Math.random() * totalWeight;
      for (let x in this.skills) {
        console.log(this.skills)
        seed -= this.skills[x].weight
        if (seed <= 0) {
          id = this.skills[x].id
          break;
        }
      }
    }

    this.cast(id);
    combatManager.pass(this)
  }
}

class Skill {
  constructor(def) {
    if (def.base != undefined) { // parse skill def
      var newDef = _.cloneDeep(data.skills[def.base])

      for (let x in def) {
        if (typeof def[x] == "object" && x != "special" && x != "statuses") { // ignore the special properties, we set them later
          for (let z in def[x]) {
            if (typeof def[x][z] == "object") {
              for (let y in def[x][z])
                newDef[x][z][y] = def[x][z][y]
            }
            else
              newDef[x][z] = def[x][z]
          }
        }
        else
          newDef[x] = def[x]
      }

      newDef.special = def.special;
      this.def = newDef;
    }
    else
      this.def = def;
  }

  getTarget(user) {
    switch(this.def.target) {
      case "enemy": {
        if (user.isPlayer)
          return combatManager.enemy;
        else
          return combatManager.player;
      }
      case "self": {
        return user;
      }
    }
  }

  postProcessDmg(hit) {
    return hit;
  }

  // intial casting logic. can put pre-execute logic
  cast(user) {}

  execute(user, target) {}

  sendMsg(user, target, hit, context=null) {

    if (context == "charging") {
      var str = this.def.special.chargeUpText.format(user.name)
      combatManager.log.push(str);
      return;
    }

    if (hit.outcome == "miss")
      var str = (user == combatManager.player) ? utils.format("You missed while using {0}!", hit.skill.name) : utils.format("{0} missed while using {1}!", user.name, hit.skill.name)
    else if (hit.outcome == "hit") {
      var params = []
      for (let x in this.def.log.use.params) {
        switch(this.def.log.use.params[x]) {
          case "target":
            params.push(target.name);
            break;
          case "dmg":
            params.push(hit.dmg);
            break;
          case "user":
            params.push(user.name);
            break;
          case "skill":
            params.push(this.def.name);
            break;
          case "heal":
            params.push(hit.heal);
            break;
        }
      }
      var str = this.def.log.use.msg.format(...params)
    }
    else if (hit.outcome == "blocked")
      var str = "Blocked!"
    else if (hit.outcome == "dodged") {
      var str = (user == combatManager.player) ? utils.format("{0} dodged your {1}!", target.name, hit.skill.name) : utils.format("You dodged {0}'s {1}!", user.name, hit.skill.name)
    }

    combatManager.log.push(str);
  }
}

class SkillGenericAttack extends Skill {
  constructor(def) {super(def)}

  cast(user) {
    var target = this.getTarget(user);
    var hit = combatManager.rollDmg(user, target, this.def, this.postProcessDmg.bind(this));

    if (this.def.isChargedSkill) {
      user.chargedSkill = this.def.id;
      if (user.charge >= this.def.special.chargeTime) {
        this.execute(user, target, hit)
      }
      else {
        user.charge += 1;
        this.sendMsg(user, null, null, "charging")
      }
    }
    else {
      this.execute(user, target, hit)
    }
  }

  execute(user, target, hit) {
    this.sendMsg(user, target, hit)
    target.receiveDmg(hit)
    user.resetChargedSkill();
  }
}

class SkillGenericSelfBuff extends Skill {
  constructor(def) {super(def)}

  cast(user) {
    this.execute(user, this.getTarget(user))
  }
  execute(user) {
    let hit = combatManager.rollStatusOnlyHit(user, user, this.def)
    this.sendMsg(user, user, hit); // comment out?
    user.receiveDmg(hit)
  }
}

class SkillGenericSelfBuffPlayer extends SkillGenericSelfBuff {
  constructor(def) {super(def)}

  execute(user) {
    let hit = combatManager.rollStatusOnlyHit(user, user, this.def, this.postProcessDmg.bind(this))
    // hit = this.postProcessDmg(hit); // todo clean up and do it properly?
    this.sendMsg(user, user, hit)
    user.receiveDmg(hit)
  }

  postProcessDmg(hit) {
    return this.willpowerMechanics(hit); // note we dont pass the other params
  }

  willpowerMechanics(hit) {
    if (hit.skill.willpower.gain > 0) {
      hit.user.gainWillpower(hit.skill.willpower.gain, hit.dmg, hit.averageDmg)
    }
    if (hit.skill.willpower.empowerable) {
      if (hit.user.willpower >= hit.skill.willpower.threshold && hit.skill.willpower.threshold > 0) {
        hit.empowered = true;
        hit.user.spendWillpower(hit.skill.willpower.drain)
      }
    }

    if (hit.skill.special.sweatGain != undefined)
      hit.user.gainSweat(hit.skill.special.sweatGain);

    return hit;
  }
}

class SkillGenericHex extends Skill {
  constructor(def) {super(def)}

  cast(user) {
    this.execute(user, this.getTarget(user))
  }
  execute(user, target) {
    let hit = combatManager.rollStatusOnlyHit(user, target, this.def)
    this.sendMsg(user, target, hit)
    target.receiveDmg(hit)
  }
}

class SkillPlayerSoccerMove extends SkillGenericAttack {
  constructor(def) {super(def)}

  willpowerMechanics(hit) {
    if (hit.skill.willpower.gain > 0) {
      hit.user.gainWillpower(hit.skill.willpower.gain, hit.dmg, hit.averageDmg)
    }
    if (hit.skill.willpower.empowerable) {
      if (hit.user.willpower >= hit.skill.willpower.threshold && hit.skill.willpower.threshold > 0) {
        hit.empowered = true;
        hit.user.spendWillpower(hit.skill.willpower.drain)
      }
    }

    if (hit.skill.special.sweatGain != undefined)
      hit.user.gainSweat(hit.skill.special.sweatGain);

    return hit;
  }

  postProcessDmg(hit) { // gain extra dmg from wp
    hit.dmg *= (1 + this.def.willpower.dmgBonus * hit.user.willpower)
    hit = this.willpowerMechanics(hit);
    return hit;
  }
}

class SkillFeignInjury extends SkillPlayerSoccerMove {
  constructor(def) {super(def)}

  cast(user) {
    this.execute(user, this.getTarget(user))
  }
  execute(user, target) {
    let hit = combatManager.rollStatusOnlyHit(user, target, this.def, this.postProcessDmg.bind(this))
    this.sendMsg(user, target, hit);
    target.receiveDmg(hit)
  }
}

class SkillPlayerKickBall extends SkillPlayerSoccerMove {
  constructor(def) {super(def)}

  cast(user) {
    var target = this.getTarget(user);
    var hit = combatManager.rollDmg(user, target, this.def, this.postProcessDmg.bind(this));

    // check the execution order for this
    var perk = travel.getPerk("legendary_strikes")
    if (perk.unlocked && ballGame.state.streak >= 6) {
      hit.dmg *= perk.tuning.mult;
    }
    
    this.execute(user, target, hit)
    // if (hit.outcome == "hit") {
    //   this.execute(user, target, hit)
    // }
    // else {
    //   this.sendMsg(user, target, hit);
    // }

    combatManager.playerUsedAction();
  }

  execute(user, target, hit) {
    this.sendMsg(user, target, hit)
    target.receiveDmg(hit)
  }
}

class SkillPlayerBreakdawner extends SkillGenericAttack {
  constructor(def) {super(def)}

  execute(user, target, hit) {
    this.sendMsg(user, target, hit)
    target.receiveDmg(hit)
  }

  postProcessDmg(hit) {
    hit.heal = (this.def.special.baseLifeSteal + (this.def.special.bonusLifeSteal * hit.user.willpower)) * hit.dmg;

    return hit;
  }
}

class StatusEffect {
  constructor(user, target, def, duration=2, infinite=false) {
    this.user = user;
    this.target = target;
    this._stacks = 1;
    this.startingDuration = duration;
    this.duration = duration;
    this.infinite = infinite;
    
    if (def.base != undefined) {
      var newDef = _.cloneDeep(data.statuses[def.base])

      for (let x in def) {
        if (typeof def[x] == "object" && x != "special" && x != "statuses" && x != "dot") { // ignore the special properties, we set them later
          for (let z in def[x]) {
            if (typeof def[x][z] == "object") {
              for (let y in def[x][z])
                newDef[x][z][y] = def[x][z][y]
            }
            else
              newDef[x][z] = def[x][z]
          }
        }
        else
          newDef[x] = def[x]
      }

      newDef.special = def.special;
      this.def = newDef; 
    }
    else
      this.def = def;
  }

  get stackable() {return (this.def.stacking.maxStacks > 1)};
  get stacks() {return this._stacks}
  set stacks(amount) {this._stacks = Math.min(amount, this.def.stacking.maxStacks)}

  onTurnStart() {};
  onAction() {}; // unused
  onApply() {
    this.sendMsg("apply")
  };
  onEnd() {};
  onDecay() {};
  onTurnOOC() {
    this.reduceDuration();
  };

  onTurnEnd() {
    if (this.def.dot != null) {
      var hit = combatManager.rollDmg(this.user, this.target, null, null, this.def.dot)

      // dots deal dmg per stack
      hit.dmg *= this.stacks;

      this.target.receiveDmg(hit)
      this.sendMsg("ticked", hit)
    }
  }

  reduceDuration(turns=1) {
    if (this.infinite)
      return;

    // prevent status decay with chronicle artifact
    if (this.target.isPlayer) {
      let art = travel.getArtifact("chronicle")
      if (this.target.willpower < art.tuning.threshold) {
        return;
      }
    }

    this.duration -= turns;

    if (this.duration <= 0) {
      this.stacks -= 1;

      if (this.def.stacking.refreshDurationOnStackLoss)
        this.duration = this.startingDuration;
      else
        this.stacks = 0;
    }

    if (this.stacks == 0) {
      this.target.removeStatus(this);
    }
  }

  sendMsg(context, hit) {
    combatManager.sendStatusMsg(context, hit, this)
  }
}

class StatusEffectUpgradeable extends StatusEffect {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite);
    this.save = travel.getMove(this.def.soccerMove)
  }
}

class StatusEffectFeignInjury extends StatusEffectUpgradeable {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite)

    this.duration += (this.save.level > this.def.special.bonusExtraDurationThreshold) ? 1 : 0 
  }
}

class StatusEffectPenaltyKick extends StatusEffectUpgradeable {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite);

    this.def.statMods.defense += this.def.special.bonusDefenseReductionPerLevel * (this.save.level - 1)

    this.duration += (this.save.level >= 3) ? this.def.special.durationBonusAtLevel3 : 0
  }
}

class StatusEffectSelfReserve extends StatusEffectUpgradeable {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite);

    this.hasHealed = false;
    this.heal = 0.15 + (this.save.level * 0.05)

    if (this.def.isEmpowered) {
      this.heal += 0.10

      if (this.save.level >= 2) {
        // cleanse random debuff
        let stat = this.user.getRandomStatus("negative");
        this.user.removeStatus(stat)
      }
    }
  }

  onTurnStart() {
    if (!this.hasHealed) {
      this.user.heal(this.user.maxHp * this.heal)
      this.hasHealed = true;

      if (this.save.level >= 3) {
        this.user.loseSweat(0.25)
      }

      combatManager.log.push("You come back from your break, having restored {0} health!".format(utils.round(this.user.maxHp * this.heal)))
    }
  };
}

class StatusEffectBottledGlass extends StatusEffect {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite)
  }

  onTurnEnd() {
    this.duration += 1; // keep the status alive
  }

  onTurnOOC() {
    // this.duration = Math.floor(this.duration, 1)
  }
}

class StatusEffectMentalGymnastics extends StatusEffect {
  constructor(user, target, def, duration=2, infinite=false) {
    super(user, target, def, duration, infinite)

    let perk = travel.getPerk("mental_gymnastics")

    this.def.statMods.statusResistance -= perk.tuning.amount * perk.level
  }
}

export const skillTypeDict = {
  "attack": SkillGenericAttack,
  "soccerAttack": SkillPlayerSoccerMove,
  // "heal": SkillGenericHeal,
  "player_kick_ball": SkillPlayerKickBall,
  "player_breakdawner": SkillPlayerBreakdawner,
  "player_tinderbow": SkillGenericAttack, // lol
  "self_buff": SkillGenericSelfBuff,
  "self_buff_player": SkillGenericSelfBuffPlayer,
  "hex": SkillGenericHex,
  "feign_injury": SkillFeignInjury,
  // "charged_attack": SkillGenericChargedAttack,
}

export const statusTypeDict = {
  "base": StatusEffect,
  "genericStatus": StatusEffect,
  "penaltyKickStatus": StatusEffectPenaltyKick,
  "feignInjuryStatus": StatusEffectFeignInjury,
  "bottled_glass_status": StatusEffectBottledGlass,
  "self_reserve": StatusEffectSelfReserve,
  "mental_gymnastics": StatusEffectMentalGymnastics,
}