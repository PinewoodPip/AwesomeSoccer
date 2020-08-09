import * as Utils from "./Utils.js"
import { strings } from "./strings.js"
import * as data from "./generalData.js"
import { Entity, Player, Enemy, skillTypeDict, statusTypeDict } from "./combat.js"
import * as utils from "./utilities.js"
import _ from "lodash"
String.prototype.format = function () { // by gpvos from stackoverflow
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const baseBadges = importAll(require.context('./Assets/Icons/Badges/base', false, /\.(gif|jpe?g|svg|png)$/));
const recoloredBadges = {
  1: importAll(require.context('./Assets/Icons/Badges/recolors/2-dark-blue', false, /\.(gif|jpe?g|svg|png)$/)),
  2: importAll(require.context('./Assets/Icons/Badges/recolors/3-teal', false, /\.(gif|jpe?g|svg|png)$/)),
  3: importAll(require.context('./Assets/Icons/Badges/recolors/4-swamp', false, /\.(gif|jpe?g|svg|png)$/)),
  4: importAll(require.context('./Assets/Icons/Badges/recolors/5-nice-green', false, /\.(gif|jpe?g|svg|png)$/)),
  5: importAll(require.context('./Assets/Icons/Badges/recolors/6-lemon-calid', false, /\.(gif|jpe?g|svg|png)$/)),
  6: importAll(require.context('./Assets/Icons/Badges/recolors/7-wooden', false, /\.(gif|jpe?g|svg|png)$/)),
  8: importAll(require.context('./Assets/Icons/Badges/recolors/9-odd-desire', false, /\.(gif|jpe?g|svg|png)$/)),
  9: importAll(require.context('./Assets/Icons/Badges/recolors/10-nightly', false, /\.(gif|jpe?g|svg|png)$/)),
}

class BallGame {
  state = {
    streak: 0,
    streakType: "none",
  }

  getResultText() {
    if (this.state.streakType == "win")
      return "You win!"
    else if (this.state.streakType == "lose")
      return "You lost!"
    return "Click the ball to start playing!" // todo welcome back
  }

  getLegendaryStreakText() {
    if (this.state.streak >= 6)
      return "LEGENDARY STREAK!"
    return ""
  }

  getStreakText() {
    var text = "";
    
    if (this.state.streak == 0)
      return ""
    
    if (this.state.streakType == "win")
      text += "Win Streak";
    else if (this.state.streakType == "lose")
      text += "Lose Streak";

    text += ": " + this.state.streak;

    return text;
  }

  roll() {
    if (combatManager.inCombat && !combatManager.isPlayerTurn)
      return;
      
    var roll = Math.round(Math.random());
    var legRoll = Utils.rollCheck(30) // temp value
    
    var result = (roll == 1) ? "win" : "lose";

    stats.playedMatch();
    if (result == "win")
      stats.state.wins++;
    else if (result == "lose")
      stats.state.losses++;

    // todo xp

    if (this.state.streakType == result) {
      this.state.streak++;
    }
    else {
      this.state.streakType = result;
      this.state.streak = 1;
    }

    if (this.state.streak > stats.state.bestStreaks[result])
      stats.state.bestStreaks[result] = this.state.streak;

    // main.addPopup({
    //   title: "test",
    //   msg: "msg",
    //   buttons: [
    //     {text: "t",
    //   func: main.closePopup.bind(main)},
    //   {text: "t",
    //   func: main.closePopup.bind(main)},
    //   {text: "t",
    //   func: main.closePopup.bind(main)},
    //   ]
    // })

    if (this.state.streak >= 6) {
      this.state.legs++;
      this.state.totalLegs++;
    }

    levelling.didRoll();
    if (combatManager.inCombat && combatManager.isPlayerTurn)
      combatManager.player.cast("player_kick_ball");
    main.render();
  }
}

class Stats {
  state = {
    wins: 0,
    losses: 0,
    matches: 0,
    legs: 0,
    totalLegs: 0,
    bestStreaks: {
      win: 0,
      lose: 0,
    },
    legBreaks: 0,
    dailyMatches: 0,
    mostDailyMatches: 0,
    mostMatchesDate: null,
    lootboxesOpened: 0,
  }

  textDict = {
    "matches": "Matches Played: {0}",
    "wins": "Matches Won: {0}",
    "losses": "Matches Lost: {0}",
    "legs": "Legendary Points: {0}",
    "total_legs": "Total LP: {0}",
    "best_win_streak": "Best Win Streak: {0}",
    "best_lose_streak": "Best Lose Streak: {0}",
    "leg_breaks": "Legs Broken: {0}",
    "lootboxes_opened": "Lootboxes Opened: {0}",
  }

  addLegs(amount) {
    this.state.legs += amount;
    this.state.totalLegs += amount;
  }

  getStreakOdds(type) {
    var template = strings.stats.tooltips.streakOdds;
    var streak = (type == "win") ? this.state.bestStreaks.win : this.state.bestStreaks.lose;
    var odds = Math.pow(2, streak)
    var chance = (1/odds)*100;

    return template.format(odds, chance)
  }

  getWinrate() {
    var templateString = (config.preferLosses) ? "Lossrate: {0}%" : "Winrate: {0}%";

    if (this.state.matches == 0)
      return templateString.format(0);
    
    var winrate = (config.preferLosses) ? (this.state.matches-this.state.wins / this.state.matches)*100 : (this.state.wins / this.state.matches)*100

    winrate = +winrate.toFixed(config.winrateRounding);

    return templateString.format(winrate);
  }

  playedMatch() {
    this.state.matches++;
    this.state.matchesToday++;

    if (this.state.dailyMatches > this.state.mostDailyMatches) {
      this.state.mostDailyMatches = this.state.dailyMatches;
      this.state.mostMatchesDate = new Date().toLocaleDateString();
    }
  }
}

class BallManager {
  state = {
    unlocked: ["classic"],
    equipped: "classic"
  }

  set(id) {
    if (this.state.unlocked.includes(id)) {
      main.app.setState({ball: id})
    }
    else {
      alert("You don't have that ball (YET)!")
    }
  }

  unlock(ball) {
    if (!this.state.unlocked.includes(ball.id))
      this.state.unlocked.push(ball.id);
  }

  rollLootbox() {
    if (stats.state.legs >= 3) {
      stats.state.lootboxesOpened++;
      stats.state.legs -= 3;

      var totalWeight = 0;
      for (var x in data.balls) {
        totalWeight += data.balls[x].weight;
      }

      var seed = Math.random()*totalWeight;
      var chosenBall = null;

      for (var z in data.balls) {
        seed -= data.balls[z].weight;

        if (seed <= 0) {
          chosenBall = data.balls[z];
          break;
        }
      }

      alert("temp msg unlocked " + chosenBall.name)
      this.unlock(chosenBall);
    }
    else {
      window.alert("Not enough lp. temp msg")
    }
  }
}

class ColorManager {
  state = {
    unlocked: ["awesomeBlue"]
  }

  get collectionCompleted() {
    for (let x in data.colors) {
      if (!this.state.unlocked.includes(data.colors[x].id))
        return false;
    }
    return true;
  }

  unlockRandom() {
    let totalWeight = 0;
    let unlockables = [];
    for (let x in data.colors) {
      if (!this.state.unlocked.includes(data.colors[x])) {
        unlockables.push(data.colors[x]);
        totalWeight += data.colors[x].weight;
      }
    }
    let seed = Math.random() * totalWeight
    let unlock;
    for (let x in unlockables) {
      seed -= unlockables[x].weight
      if (seed <= 0) {
        unlock = unlockables[x]
        break;
      }
    }
    this.unlock(unlock.id);
    return unlock;
  }

  unlock(id) {
    if (!this.state.unlocked.includes(id))
      this.state.unlocked.push(id)
  }

  set(id) {
    if (this.state.unlocked.includes(id)) {
      main.app.setState({
        bgColor: data.colors[id].color,
      })
    }
    else {
      main.addPopup({
        title: "LOCKED!",
        description: "You don't own this color (YET)!",
        buttons: [
          data.popupButtons.close,
        ]
      })
    }
  }
}

class Main { // we use this to force React.js to render from game js
  app = null;

  addPopup(popup) {
    const newQueue = this.app.state.popupQueue.slice();
    newQueue.push(popup)
    this.app.setState({
      popupQueue: newQueue,
    })
  }

  closePopup() {
    const newQueue = this.app.state.popupQueue.slice();
    newQueue.shift()
    this.app.setState({
      popupQueue: newQueue,
    })
  }

  render() {
    if (this.app != null)
      this.app.forceUpdate();
  }
}

class Levelling {
  state = {
    level: 1,
    xp: 0,
    totalXp: 0,

  }

  lpMilestones = [5, 10, 13, 17, 20];
  gmgMilestones = [7, 9, 11, 13];
  baseXpGoal = 20;
  goal = this.baseXpGoal;
  colorOrder = ["",
                "2-dark-blue",
                "3-teal",
                "4-swamp",
                '5-nice-green',
                '6-lemon-calid',
                '7-wooden',
                '8-warm-desire',
                '9-odd-desire',
                '10-nightly',];
  badgeTiers = [1, 5, 10, 20, 30, 40, 50];
  badges = ['circle.svg',
          'triangle.svg',
          'square.svg',
          'romboid.svg',
          'hexagon_pointy.svg',
          '8-star.svg',
          'pinewood.svg'];

  didRoll() {
    if (!combatManager.inCombat) {
      var xp = 2;
      if (ballGame.state.streak >= 6)
        xp += 2*(ballGame.state.streak-5); 
      this.gainXp(xp)
    }
  }
  
  gainXp(amount) {
    this.state.xp += amount;
    this.state.totalXp += amount;

    this.checkLevelUp()
  }

  getProgress() {
    return (this.state.xp / this.goal)*100;
  }

  checkLevelUp() {
    if (this.state.xp > this.goal) {
      this.state.level += 1;
      this.state.xp -= this.goal;
      this.goal = this.calculateGoal();
      combatManager.player.scale(this.state.level);
      
      this.checkMilestones();
    }
  }

  checkMilestones() {
    let desc = "";

    if (this.lpMilestones.includes(this.state.level)) {
      stats.addLegs(1);
      desc += "You have gained 1 Legendary Point!"
    }

    if (this.gmgMilestones.includes(this.state.level)) {
      travel.state.giftcards++;
      desc += "You have gained a Gym Membership Giftcard!"
    }

    if (this.state.level % 5 == 0) {
      if (!colorManager.collectionCompleted) {
        let color = colorManager.unlockRandom();
        desc += utils.format("You have unlocked the '{0}' background color!", color.name)
      }
    }

    if (desc != "") {
      main.addPopup({
        title: "LEVEL UP MILESTONE!",
        description: desc,
        buttons: [
          data.popupButtons.excitedClose,
        ]
      })
    }
  }

  calculateGoal() {
    return Math.floor(this.baseXpGoal + (Math.pow(((this.state.level-1)*1.5), 1.5)))
  }

  getBadgeForLevel(level) {
    var index = 0;
    this.badgeTiers.forEach(function(i, ind) { // check which milestone we meet
      if (level >= i)
        index = ind;
    });

    var baseIcon = this.badges[index]; // then get the respective badge icon shape
    var progress = level - this.badgeTiers[index] // used to determine the badge color; how many levels are we past the milestone?

    if (progress == 0 || baseIcon == 'pinewood.svg') // if we're *AT* a milestone, use graphics from the base folder
        var icon = baseBadges[baseIcon];
    else // otherwise pull them from the respective recolor folder
        var icon = recoloredBadges[progress][baseIcon]

    return icon;
  }
}

export class TravelManager {
  state = {
    unlocks: {
      areas: ["testing", "street"],
      weapons: [],
      artifacts: [],
      gym: {
        moves: {

        },
        perks: {
          legendary_strikes: {
            level: 0,
          },
          flow: {
            level: 0,
          },
          art_of_the_steal: {
            level: 0,
          }
        }
      }
    },
    giftcards: 0,
    lootingDryStreak: 0,
    areaProgress: {},
    loadout: {
      weapon: null,
      moves: [
        null,
        null,
      ],
      artifacts: [
        null,
        null,
      ]
    }
  }

  unlockLevel = 5;
  lootingDryStreakMult = 0.05;

  get canTravel() {
    return (levelling.state.level > this.unlockLevel)
  }

  buyPerk(id) {
    let perk = this.getPerk(id);
    let cost = perk.prices[perk.level];

    if (perk.level >= perk.maxLevel) {
      main.addPopup({
        title: "IMPOSSIBLE",
        description: utils.format("{0} is at maximum level. Cannot upgrade further.", perk.name),
        buttons: [
          data.popupButtons.close,
        ]
      })
    }
    if (this.state.giftcards > cost) {
      main.addPopup({
        title: perk.name,
        description: "Are you sure you want to buy/upgrade Legendary Strikes? The gym has a strict no-refund policy.",
        buttons: [
          {text: "BUY", func: (() => {this.state.unlocks.gym.perks[id].level++; this.state.giftcards -= cost}).bind(this)}
        ]
      })
    }
    else {
      main.addPopup({
        title: "IMPOSSIBLE",
        description: utils.format("Not enough gym membership gift cards to buy/upgrade {0}!", perk.name),
        buttons: [
          data.popupButtons.close,
        ]
      })
    }
  }

  getPerk(id) {
    var perk = _.cloneDeep(data.perks[id])
    var perkData = this.state.unlocks.gym.perks[id];
    perk.unlocked = (perkData.level > 0);
    perk.level = perkData.level;
    return perk;
  }

  getCurrent(thing) {
    switch(thing) {
      case "weapon": {
        if (this.state.loadout.weapon != null) {
          let info = _.cloneDeep(data.weapons[this.state.loadout.weapon])
          return info;
        }
        else
          return null;
      }
    }
  }

  equip(type, id, slot) {
    switch (type) {
      case "artifact": {
        this.state.loadout.artifacts[slot] = id;
      };
      case "weapon": {
        this.state.loadout.weapon = id;
      };
    }
  }

  travelTo(area) {
    if (this.state.unlocks.areas.includes(area.id)) {
      combatManager.setupFight(area);
    }
  }

  hasArtifact(id) {
    return this.state.loadout.artifacts.includes(id);
  }

  rollLoot(enemy) {
    var unlocks = [];
    for (let x in enemy.def.drops) {
      var drop = enemy.def.drops[x];
      var chance = drop.chance + (this.state.lootingDryStreak * this.lootingDryStreakMult);

      // boost consumable drops if player has perk
      if (drop.type == "item") {
        var perk = travel.getPerk("art_of_the_steal");

        chance += perk.tuning.boost * perk.level;
      }

      if (utils.checkRoll(chance)) {
        unlocks.push(drop)
      }
    }

    if (unlocks.length == 0) {
      this.state.lootingDryStreak++;
      return "";
    }

    for (let x in unlocks) {
      var unlock = unlocks[x];
      var str = "";

      switch(unlock.type) {
        case "artifact": {
          if (!travel.state.unlocks.artifacts.includes(unlock.id)) {
            travel.state.unlocks.artifacts.push(unlock.id)
            str += "You got " + unlock.id
          }
        }
        case "weapon": {
          if (!travel.state.unlocks.weapons.includes(unlock.id)) {
            travel.state.unlocks.weapons.push(unlock.id)
            str += "You got " + unlock.id
          }
        }
      }
    }
    return str;
  }
}

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
      var skill = new skillTypeDict[def.behaviour](def);
      this.skills[def.id] = skill;
    }

    // for (let x in data.statuses) {
    //   var def = data.statuses[x];
    //   var status = new statusTypeDict[def.behaviour](def)
    //   this.statuses[def.id] = status
    // }

    setInterval(this.oocTick, this.OOC_TIMER)

  }

  area;

  OOC_TIMER = 1000;
  OOCHealing = 1; // base healing is 1 per sec
  OOCWillpowerDrain = 0.02;
  OOC_SWEAT_DRAIN = 0.02;
  TURN_DELAY = 1000;

  oocTick() {
    if (!combatManager.inCombat) {
      let player = combatManager.player;
      let heal = combatManager.OOCHealing;
      if (travel.hasArtifact("engraved_ring"))
        heal += combatManager.player.maxHp * 0.04;
      combatManager.player.heal(heal);

      combatManager.player.loseWillpower(combatManager.OOCWillpowerDrain)
      combatManager.player.loseSweat(combatManager.OOC_SWEAT_DRAIN)

      for (let x in player.statuses) {
        player.statuses[x].onOOCTurn();
      }

      main.render();
    }
  }

  setupFight(area) {
    var totalWeight = 0;
    for (let x in area.enemies) {
      totalWeight += area.enemies[x].weight
    }
    var seed = totalWeight * Math.random();
    var enemyId = null;
    for (let x in area.enemies) {
      seed -= area.enemies[x].weight
      if (seed <= 0) {
        var enemyId = area.enemies[x].id;
        this.progressReward = area.enemies[x].progressReward;
      }
    }

    var enemyDef = data.entities[enemyId];
    var playerLevel = levelling.state.level;
    var enemyLevel = utils.randomFromRange(Math.max(area.levelRange.min, playerLevel - 3), Math.min(area.levelRange.max, playerLevel + 2))
    this.enemy = new Enemy(enemyDef, enemyLevel)
    this.inCombat = true;
    this.round = 1;
    this.isPlayerTurn = true;
    this.area = area;

    main.app.startCombat();
    this.tickTurn();
  }

  deliverResult(hit) {
    if (hit.outcome == "miss") {
      this.log.push("")
    }
  }

  playerUsedAction() {
    this.pass(combatManager.player)
  }

  pass(entity) {
    var currentCombatant = (this.isPlayerTurn) ? this.player : this.enemy;
    if (entity == currentCombatant) {

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
      // this.tickTurn();
    }

    main.app.render();
  }

  tickTurn() {
    var entity = (this.isPlayerTurn) ? this.player : this.enemy;

    if (entity.isDead) {
      if (entity.isPlayer) {
        setTimeout(() => {this.endCombat("defeat")}, this.TURN_DELAY)
        // this.endCombat("defeat")
      }
      else {
        setTimeout(() => {this.endCombat("win")}, this.TURN_DELAY)
      }
    }
    else {
      console.log(utils.format("{0}'s turn has started.", entity.name))
      entity.onTurnStart();
    }

    main.app.render();
  }

  endCombat(reason) {
    if (!this.inCombat)
      return;
    if (reason == "win") {
      travel.state.areaProgress[this.area.id] += this.progressReward;

      var xp = this.enemy.stats.xpReward;
      var title = utils.format("{0} was defeated!", this.enemy.name)
      
      var desc = travel.rollLoot(this.enemy)

      main.addPopup({
        title: title,
        description: desc,
        buttons: [
          {text: "ok", func: function(){levelling.gainXp(xp); this.closeCombat()}.bind(this)}
        ]
      })
    }
    else {
      this.log.push("You have been defeated and give up.")

      setTimeout(() => {
        this.closeCombat();
        main.addPopup({
          title: "DEFEAT",
          description: "temp",
          buttons: [
            data.popupButtons.close,
          ]
        })
      }, this.TURN_DELAY);


    }
  }

  closeCombat() {
    main.app.exitCombat();
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

  rollDmg(user, target, def, postProcessFunc, dmgDefParam) {
    var dmgDef = (dmgDefParam != undefined) ? dmgDefParam : def.dmg;
    var hit = {
      get dmg() {return utils.round(this._dmg, 1)},
      set dmg(val) {
        this._dmg = val;
      },
      // get rawDmg() {
      //   return utils.round(this._rawDmg, 1);
      // },
      // set rawDmg(val) {
      //   this._rawDmg = val;
      // },
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

    if (dmgDef.type != undefined)
      hit.dmgType = dmgDef.type;

    // get user damage and multiply by skill's mult, and add some randomness through the skill's dmgRange attribute. 0.1 dmgRange = +-10% damage
    hit.dmg = user.getRealStats().dmg * dmgDef.mult * utils.randomFromRangeFloat(1-dmgDef.range, 1+dmgDef.range);

    if (utils.checkRoll(user.critChance)) {
      hit.crit = true;
      hit.dmg *= user.critMult;
    }

    // roll statuses
    if (def != null) { // can only roll statuses from a skill def
      for (let x in def.statuses) { // todo empowered versions
        let eff = def.statuses[x];
  
        if (utils.checkRoll(eff.chance)) {
          hit.statuses.push(eff);
        }
      }
    }

    hit = (postProcessFunc != null) ? postProcessFunc(hit) : hit;
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

export var ballGame = new BallGame();
export var stats = new Stats();
export var colorManager = new ColorManager();
export var ballManager = new BallManager();
export var levelling = new Levelling();
export var travel = new TravelManager();
export var combatManager = new CombatManager();
export var main = new Main();
export var config = {
  preferLosses: false,
  hideLogo: false,
  winrateRounding: 2,
}