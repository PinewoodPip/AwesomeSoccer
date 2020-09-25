import React from 'react';
import { strings } from "./strings.js"
import * as data from "./generalData.js"
import { FileButton } from "./genericElements.js"
import { Entity, Player, Enemy, skillTypeDict, statusTypeDict } from "./combat.js"
import * as utils from "./utilities.js"
import _ from "lodash"
import { CombatManager } from "./combatManager.js"
import { ShoeManager } from "./shoes.js"
import { Hitsplat, PlayerPanel } from './combatComponents.js';
import { TravelManager } from "./travel.js"
// import { Main } from "./main.js"
String.prototype.format = function () { // by gpvos from stackoverflow
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

export var IGNORE_SAVE = false;

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
  7: importAll(require.context('./Assets/Icons/Badges/recolors/8-warm-desire', false, /\.(gif|jpe?g|svg|png)$/)),
  8: importAll(require.context('./Assets/Icons/Badges/recolors/9-odd-desire', false, /\.(gif|jpe?g|svg|png)$/)),
  9: importAll(require.context('./Assets/Icons/Badges/recolors/10-nightly', false, /\.(gif|jpe?g|svg|png)$/)),
}

class BallGame {
  state = {
    streak: 0,
    streakType: "none",
    brokenLeg: false,
  }

  d20roll = null;

  getResultText() {
    if (this.state.streakType == "win")
      return "You win!"
    else if (this.state.streakType == "lose")
      return "You lost!"
    else if (stats.state.matches > 0)
      return "Welcome back!"
    return "Click the ball to start playing!"
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
    var legRoll = (this.state.brokenLeg) ? false : utils.checkRoll(shoes.legBreakChance) // can't break leg twice in a row
    
    var result = (roll == 1) ? "win" : "lose";

    if (legRoll) {
      this.state.brokenLeg = true;
      stats.state.legBreaks++;
    }
    else {
      this.state.brokenLeg = false;
      stats.playedMatch();
      if (result == "win")
        stats.state.wins++;
      else if (result == "lose")
        stats.state.losses++;

      if (this.state.streakType == result) {
        this.state.streak++;
      }
      else {
        this.state.streakType = result;
        this.state.streak = 1;
      }

      if (this.state.streak > stats.state.bestStreaks[result])
        stats.state.bestStreaks[result] = this.state.streak;

      if (this.state.streak >= 6) {
        stats.state.legs++;
        stats.state.totalLegs++;
      }

      // special ball effects
      switch (ballManager.state.equipped) {
        case "d20": {
          this.d20roll = utils.randomFromRange(1, 20)
          break;
        }
        case "cookie": {
          combatManager.player.heal(1)
          break;
        }
        case "signed": {
          if (combatManager.player.willpower < 0.3)
            combatManager.player.gainWillpower(0.05, null, null, false);
          break;
        }
        default: {
          this.d20roll = null;
          break;
        }
      }

      levelling.didRoll();

      // cast combat skill
      if (combatManager.inCombat && combatManager.isPlayerTurn && !combatManager.player.isDead)
        combatManager.player.cast("player_kick_ball");
    }

    
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
    lastPlayed: null,
    lootboxesOpened: 0,
  }

  getDailyMatchesTooltip() {
    let record = (this.state.mostMatchesDate != null) ? <p>{"Most matches in a day: {0} on {1}".format(this.state.mostDailyMatches, this.state.mostMatchesDate)}</p> : null;
    return (
      <div className="generic-tooltip">
        <p>{"Matches played today: {0}".format(this.state.dailyMatches)}</p>
        {record}
        <p></p>
        <p>{"Legs broken: {0}".format(this.state.legBreaks)}</p>
      </div>
    )
  }

  // update daily records
  updateDay() {
    if (this.state.lastPlayed != new Date().toLocaleDateString()) {
      this.state.dailyMatches = 0;
      this.state.lastPlayed = new Date().toLocaleDateString();
    }
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
    
    var winrate = (config.preferLosses) ? ((this.state.matches-this.state.wins) / this.state.matches)*100 : (this.state.wins / this.state.matches)*100

    winrate = +winrate.toFixed(config.winrateRounding);

    return templateString.format(winrate);
  }

  playedMatch() {
    this.state.matches++;
    this.state.dailyMatches++;

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
    ballGame.d20roll = null;
    if (this.state.unlocked.includes(id)) {
      this.state.equipped = id;
    }
    else {
      main.addPopup({
        title: "LOCKED!",
        description: <div>
          <p>You don't have that ball (YET)!</p>
          <p>Buy lootboxes to obtain more balls!</p>
        </div>,
        buttons: [data.popupButtons.close]
      })
    }

    main.render()
  }

  getBall(id) {
    let info = _.cloneDeep(data.balls[id])
    info.unlocked = this.state.unlocked.includes(id)
    return info;
  }

  unlock(ball) {
    if (!this.state.unlocked.includes(ball.id)) {
      this.state.unlocked.push(ball.id);

      // killfreak temple unlock condition
      if (ball.id == "meridia") {
        travel.unlock("area", "temple")
        main.addPopup({
          title: "A NEW HAND TOUCHES THE BEACON",
          description: <div>
            <p>"Listen. Hear me and obey. A foul darkness has seeped into my temple. A darkness that you will destroy."</p>
            <p>(You can now travel to the Killfreak Temple)</p>
          </div>,
          buttons: [data.popupButtons.excitedClose]
        })
      }
    }
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

      let unlockString = (this.getBall(chosenBall.id).unlocked) ? "You unlocked the {0}! ...Again!" : "You unlocked the {0}!"
      let title = (this.getBall(chosenBall.id).unlocked) ? "NEW BALL UNLOCKED! (NOT REALLY)" : "NEW BALL UNLOCKED!"

      main.addPopup({
        title: "NEW BALL UNLOCKED!",
        description: <div>
          <p>{unlockString.format(chosenBall.name)}</p>
        </div>,
        buttons: [data.popupButtons.excitedClose]
      })

      this.unlock(chosenBall);
    }
    else {
      main.addPopup({
        title: "NOT ENOUGH LP!",
        description: <div>
          <p>{"Come back when you're a little ummm... Richer!"}</p>
        </div>,
        buttons: [data.popupButtons.close]
      })
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

  get hasAnyColorUnlocked() {
    return this.state.unlocked.length > 1;
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

export class Main { // we use this to force React.js to render from game js
  app = null;
  popupQueue = [];

  getSave() {
    travel.state.savedHp = combatManager.player.hp
    let save = {
      ballGame: _.cloneDeep(ballGame.state),
      stats: _.cloneDeep(stats.state),
      colors: _.cloneDeep(colorManager.state),
      balls: _.cloneDeep(ballManager.state),
      travel: _.cloneDeep(travel.state),
      levelling: _.cloneDeep(levelling.state),
      shoes: _.cloneDeep(shoes.state),
      config: _.cloneDeep(config),
      meta: _.cloneDeep(saveMetaData),
      // combat: _.cloneDeep(combatManager.state),
    }
    return save;
  }

  save() {
    let save = this.getSave();

    utils.save(save, "save")
  }

  resetSave() {
    if (window.confirm("Are you sure you want to wipe your save?")) {
      IGNORE_SAVE = true;
      window.localStorage.setItem("save", null);
      window.location.reload()
    }
  }

  importSave(save) {
    try {
      save = JSON.parse(save)
    }
    catch {
      window.alert("Invalid save!")
      return;
    }
    
    this.loadSave(save)

    main.closePopup();
  }

  exportSave() {
    let save = this.getSave()
    let json = JSON.stringify(save, null, 2);
    console.log(json)

    var FileSaver = require('file-saver');
    var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "awesome_soccer_save.json");

    main.closePopup();
  }

  deepExtend(base, override) {
    let newObject = _.cloneDeep(base);

    for (let x in override) {
      let thing = override[x]
      if (newObject[x] == null)
        newObject[x] = override[x]
      else if (typeof thing == "object") {
        newObject[x] = this.deepExtend(newObject[x], thing)
      }
      else {
        if (newObject != undefined)
          newObject[x] = override[x];
      }
    }
    // console.log(newObject)
    return newObject;
  }

  loadSave() {
    let save = utils.load("save")

    try {
      console.log(save.meta)
    }
    catch {
      console.log("error loading save")
      return;
    }

    if (save != null && save != undefined) {
      if (save.meta.protocol < saveMetaData.protocol) {
        main.addPopup({
          title: "OBSOLETE SAVE",
          description: "Your save was wiped due to changes in the save format. My deepest condolences.",
          buttons: [data.popupButtons.sadClose],
        })
      }
      else {
        // ballGame.state = this.deepExtend(ballGame.state, save.ballGame)
        stats.state = this.deepExtend(stats.state, save.stats)
        colorManager.state = this.deepExtend(colorManager.state, save.colors)
        ballManager.state = this.deepExtend(ballManager.state, save.balls)
        travel.state = this.deepExtend(travel.state, save.travel)
        levelling.state = this.deepExtend(levelling.state, save.levelling)
        shoes.state = this.deepExtend(shoes.state, save.shoes)
        config = save.config;
        saveMetaData = save.meta;

        combatManager.player.scale(levelling.state.level)
        combatManager.player.hp = travel.state.savedHp;

        stats.updateDay()
      }
    }
  }

  beforeUnload() {
    if (!IGNORE_SAVE)
      this.save();
  }

  generateHitsplat(hit) {
    let elements = [];

    if (hit.dmg != 0 && hit.dmg != undefined) {
      elements.push({value: hit.dmg, type: hit.dmgType})
    }

    if (utils.noneCheck(hit.heal)) {
      elements.push({value: hit.heal, type: "healing"})
    }

    for (let x in elements) {
      let element = elements[x];
      this.app.hitsplats.queued.push({
        duration: 1000,
        hit: hit,
        element: <Hitsplat key={this.app.hitsplats.queued.length} value={element.value} type={element.type}/>
      })
    }
  }

  openSaveMenu() {
    this.addPopup({
      title: "IMPORT/EXPORT SAVES",
      description: "How may this menu serve you?",
      buttons: [
        <FileButton text="IMPORT" func={(f) => {this.importSave(f)}}/>,
        {text: "EXPORT", func: () => {this.exportSave()}},
        {text: "RESET", func: () => {this.resetSave()}},
        {text: "I'M JUST LOOKING", func: () => {}},
      ]
    })
  }

  addPopup(popup) {
    const newQueue = this.popupQueue.slice();

    // randomized button text
    for (let x in popup.buttons) {
      if (!React.isValidElement(popup.buttons[x])) {
        if (typeof popup.buttons[x].text != "string") {
          popup.buttons[x].text = _.sample(popup.buttons[x].text)
        }
      }
    }

    // randomized desc
    if (typeof popup.description != "string" && !React.isValidElement(popup.description)) {
      popup.description = _.sample(popup.description)
    }
    
    newQueue.push(popup)
    this.popupQueue = newQueue;
    this.render();
  }

  closePopup() {
    const newQueue = this.popupQueue.slice();
    newQueue.shift()
    this.popupQueue = newQueue;
    this.render();
  }

  render() {
    if (this.app != null) {
      // this.app.forceUpdate();
      this.app.setState({
        popupQueue: this.popupQueue,
      })
    }
  }
}

class Levelling {
  state = {
    level: 1,
    xp: 0,
    totalXp: 0,
  }

  lpMilestones = [7, 10, 13, 17, 20];
  gmgMilestones = [6, 9, 11, 13, 15, 17, 19, 21];
  baseXpGoal = 20;
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

  get goal() {return this.calculateGoal()}

  didRoll() {
    if (!combatManager.inCombat) {
      var xp = 2;
      if (ballGame.state.streak >= 6)
        xp += 2*(ballGame.state.streak-5); 
      this.gainXp(xp)
    }
  }
  
  gainXp(amount) {
    amount = utils.round(amount, 0)
    this.state.xp += amount;
    this.state.totalXp += amount;

    this.checkLevelUp()
  }

  getProgress() {
    return (this.state.xp / this.goal)*100;
  }

  checkLevelUp() {
    while (this.state.xp >= this.goal) {
      this.state.xp -= this.goal;
      this.state.level += 1;
      combatManager.player.scale(this.state.level);

      if (this.state.level == 5) {
        main.addPopup({
          title: "TRAVEL UNLOCKED",
          description: <div>
            <p>You feel like you're getting the hang of this, but you know you could be so much more.</p>
            <p>You seek more intense training, trials, and glory. Such desires can only be fulfilled outside your backyard.</p>
            <p>(You can now use the travel button.)</p>
            <p></p>
          </div>,
          buttons: [data.popupButtons.excitedClose]
        })
      }
      
      this.checkMilestones();
    }
  }

  checkMilestones() {
    let desc = "";
    let hasJustUnlockedGym = false;

    if (this.lpMilestones.includes(this.state.level)) {
      stats.addLegs(1);
      desc += "You have gained 1 Legendary Point!"
    }

    if (this.gmgMilestones.includes(this.state.level)) {
      if (!travel.canUseGym) {
        hasJustUnlockedGym = true;
      }
      travel.state.giftcards++;
      desc += "You have gained a Gym Membership Giftcard!"
    }

    if (this.state.level % 5 == 0 && this.state.level > 5) {
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

    if (hasJustUnlockedGym) {
      main.addPopup({
        title: "GYM UNLOCKED",
        description: "You've obtained a Gym Membership Giftcard! You can use these at the Gym to get professional training in all things soccer-related.",
        buttons: [data.popupButtons.excitedClose]
      })
    }
  }

  calculateGoal(level) {
    if (level == null)
      level = this.state.level;
    return Math.floor(this.baseXpGoal + (Math.pow(((level-1)*1.5), 1.5)))
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

export var config = {
  preferLosses: false,
  hideLogo: false,
  winrateRounding: 2,
  skipTutorials: false,
}
export var saveMetaData = {
  protocol: data.global.saveProtocol,
  version: data.global.version,
}
export var ballGame = new BallGame();
export var stats = new Stats();
export var colorManager = new ColorManager();
export var ballManager = new BallManager();
export var levelling = new Levelling();
export var travel = new TravelManager();
export var shoes = new ShoeManager(); // UH OHH!! RACING CONDITIONS!!
export var combatManager = new CombatManager();
export var main = new Main();

main.loadSave()