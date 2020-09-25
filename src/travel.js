import * as utils from "./utilities.js"
import _ from "lodash"
import * as data from "./generalData.js"
import { travel, combatManager, levelling, ballGame, main, shoes, colorManager, ballManager, config } from "./BallGame.js"
import { LootScreen } from "./panels.js"
import React from 'react';

export class TravelManager {
    constructor() {
      for (let x in data.travelAreas) {
        let area = data.travelAreas[x]
        this.state.bestiary[area.id] = {
          fightsWon: 0,
        }
      }
    }
    state = {
      unlocks: {
        areas: ["testing", "street"],
        weapons: [],
        artifacts: [],
        gym: {
          moves: {
            penalty_kick: {
              level: 0,
            },
            feign_injury: {
              level: 0,
            },
            self_reserve: {
              level: 0,
            },
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
            },
            allowance: {
              level: 0,
            },
            shoe_dual_wielding: {
              level: 0,
            },
            beta_armor: {
              level: 0,
            },
            mental_gymnastics: {
              level: 0,
            }
            // test: {
            //   level: 0,
            // },
          }
        }
      },
      giftcards: 0,
      canUseGym: false,
      lootingDryStreak: 0,
      areaProgress: {
        testing: 0,
        street: 0,
        market: 0,
      },
      savedHp: 20,
      bestiary: {
  
      },
      tutorialsSeen: [],
      loadout: {
        weapon: null,
        moves: [
          null,
          null,
        ],
        artifacts: [
          null,
          null,
        ],
        consumables: {
          water_bottle: {
            amount: 0,
            unlocked: false,
          },
          towel: {
            amount: 0,
            unlocked: false,
          },
          pepper_spray: {
            amount: 0,
            unlocked: false,
          },
          arena_ticket: {
            amount: 0,
            unlocked: false,
          },
          clarity_nut: {
            amount: 0,
            unlocked: false,
          },
        }
      }
    }
  
    unlockLevel = 5;
    lootingDryStreakMult = 0.05;
  
    get canTravel() {
      return (levelling.state.level >= this.unlockLevel)
    }

    get bossRequirement() {return 100 * data.global.areaProgressNeededMultiplier}

    get hasStatCardUnlocked() {return this.fightsWon > 0}
  
    get hasAnyConsumables() {
      for (let x in this.state.loadout.consumables) {
        if (this.state.loadout.consumables[x].amount > 0)
          return true;
      }
      return false;
    }

    get canUseGym() {
      if (this.state.giftcards > 0) {
        this.state.canUseGym = true; // this is janky, do it somewhere else
      }
      return (this.state.giftcards > 0 || this.state.canUseGym)
    }
  
    get fightsWon() {
      let num = 0;
      for (let x in this.state.bestiary) {
        num += this.state.bestiary[x].fightsWon;
      }
      return num;
    }

    get hasAnyGearOrMoves() {
      if (this.state.unlocks.weapons.length > 0)
        return true;
      if (this.state.unlocks.artifacts.length > 0)
        return true;
      if (shoes.state.owned.length > 0)
        return true;
      if (this.hasAnyConsumables)
        return true;
      for (let x in this.state.unlocks.gym.moves) {
        if (this.state.unlocks.gym.moves[x].level > 0)
          return true;
      }
      return false;
    }

    showTutorial(id, forced=false) {
      if ((!this.state.tutorialsSeen.includes(id) && !config.skipTutorials) || forced) {
        let tutorial = data.tutorials[id];
        if (!this.state.tutorialsSeen.includes(id))
          this.state.tutorialsSeen.push(id)

        main.addPopup({
          title: tutorial.title,
          description: tutorial.description,
          buttons: [
            data.popupButtons.excitedClose,
            {text: "DON'T SHOW TUTORIALS", func: () => {config.skipTutorials = true}}
          ]
        })
      }
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
      else if (this.state.giftcards >= cost) {
        main.addPopup({
          title: perk.name,
          description: "Are you sure you want to buy/upgrade {0}? The gym has a strict no-refund policy.".format(perk.name),
          buttons: [
            {text: "BUY", func: () => {console.log("t"); this.state.unlocks.gym.perks[id].level++; this.state.giftcards -= cost}},
            data.popupButtons.cancel,
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
  
    buyMove(id) {
      let move = this.getMove(id);
  
      if (move.level == move.maxLevel) {
        main.addPopup({
          title: "IMPOSSIBLE",
          description: utils.format("{0} is at maximum level. Cannot upgrade further.", move.name),
          buttons: [
            data.popupButtons.close,
          ]
        })
      }
      else if (this.state.giftcards >= move.nextLevelCost) {
        main.addPopup({
          title: move.name,
          description: "Are you sure you want to buy/upgrade {0}? The gym has a strict no-refund policy.".format(move.name),
          buttons: [
            {text: "BUY", func: (() => {
              if (move.level == 0) {
                main.addPopup({
                  title: "MOVE ACQUIRED",
                  description: utils.format("You have learnt the art of {0}! You can equip it from your wardrobe.", move.name),
                  buttons: [
                    data.popupButtons.excitedClose,
                  ]
                })
              }
              this.state.unlocks.gym.moves[id].level++;
              this.state.giftcards -= move.nextLevelCost
              this.showTutorial("soccer_moves")
            }).bind(this)
            }, // hope this deducts the right amount
            data.popupButtons.cancel,
          ]
        })
      }
      else {
        main.addPopup({
          title: "IMPOSSIBLE",
          description: utils.format("Not enough gym membership gift cards to buy/upgrade {0}!", move.name),
          buttons: [
            data.popupButtons.close,
          ]
        })
      }
    }
  
    getUnlockablesCount(type) {
      let count = 0;
      let total = 0;
      switch (type) {
        case "weapon": {
          for (let x in data.weapons) {
            total += 1;
            if (this.state.unlocks.weapons.includes(x))
              count += 1;
          }
          break;
        }
        case "artifact": {
          for (let x in data.artifacts) {
            total += 1;
            if (this.state.unlocks.artifacts.includes(x))
              count += 1;
          }
          break;
        }
        case "consumable": {
          for (let x in data.consumables) {
            total += 1;
            if (this.state.loadout.consumables[x].unlocked) {
              count += 1;
            }
          }
          break;
        }
        case "color": {
          for (let x in data.colors) {
            total += 1;
            if (colorManager.state.unlocked.includes(x))
              count += 1;
          }
          break;
        }
        case "ball": {
          for (let x in data.balls) {
            total += 1;
            if (ballManager.state.unlocked.includes(x))
              count += 1;
          }
          break;
        }
        case "all": {
          let types = ["weapon", "artifact", "consumable", "ball", "color"]
          for (let x in types) {
            count += this.getUnlockablesCount(types[x]).count;
            total += this.getUnlockablesCount(types[x]).total;
          }
          break;
        }
      }
  
      return {count: count, total: total}
    }
  
    useNonSkillConsumable(item) {
      switch(item.id) {
        case "water_bottle": {
          let heal = item.tuning.heal * combatManager.player.maxHp
          combatManager.player.heal(heal)
          combatManager.log.push("You drink a refreshing bottle of water, recovering {0} health!".format(heal))
          break;
        }
        case "towel": {
          combatManager.player.healSweat(item.tuning.sweatHeal)
          combatManager.log.push("You wipe off {0}% of your sweat with a towel!".format(item.tuning.sweatHeal))
          break;
        }
        case "clarity_nut": {
          combatManager.player.gainWillpower(item.tuning.amount, null, null, false)
          combatManager.log.push("You bust a Clarity Nut and gain {0} Willpower!".format(item.tuning.amount * 100))
          break;
        }
      }
    }
  
    useConsumable(id) {
      let item = this.getConsumable(id);
      if (item.amount > 0 && item.isUsable) {
        if (combatManager.inCombat) {
          console.log("Using " + id)
  
          if (item.skill != undefined) {
            combatManager.player.cast(item.skill)
          }
          else {
            this.useNonSkillConsumable(item);
          }
          
          combatManager.playerUsedAction();
          main.app.openPanel("combat_player", "right")
          this.state.loadout.consumables[id].amount -= 1;
        }
        else if (item.ooc) {
          console.log("Using " + id + " OOC")
          this.useNonSkillConsumable(item);
          this.state.loadout.consumables[id].amount -= 1;
        }
  
        main.render();
      }
    }
  
    getPerk(id) {
      var perk = _.cloneDeep(data.perks[id])
      var perkData = this.state.unlocks.gym.perks[id];
      perk.unlocked = (perkData.level > 0);
      perk.level = perkData.level;
      perk.nextLevelCost = (perk.level < perk.maxLevel) ? perk.prices[perk.level] : null;
      return perk;
    }
  
    getMove(id) {
      let move = _.cloneDeep(data.moves[id])
      let save = this.state.unlocks.gym.moves[id]
      move.level = save.level;
      move.unlocked = (save.level > 0)
      move.maxLevel = move.prices.length;
      move.nextLevelCost = (move.level < move.maxLevel) ? move.prices[move.level] : null;
  
      return move;
    }
    
    getCurrent(thing) {
      switch(thing) {
        case "weapon": {
          let current = this.state.loadout.weapon;
          if (current != null)
            return this.getWeapon(current)
          return null;
        }
        // todo
      }
    }
  
    getWeapon(id) {
      let wep = _.cloneDeep(data.weapons[id])
      wep.unlocked = this.state.unlocks.weapons.includes(id)
  
      return wep;
    }
  
    getArtifact(id) {
      let art = _.cloneDeep(data.artifacts[id])
      art.unlocked = this.state.unlocks.artifacts.includes(id)
      art.equipped = this.state.loadout.artifacts.includes(id)
  
      return art;
    }
  
    getConsumable(id) {
      let item = _.cloneDeep(data.consumables[id])
  
      item.amount = this.state.loadout.consumables[id].amount;
      item.unlocked = this.state.loadout.consumables[id].unlocked;
      item.isUsable = (item.notUsable == undefined && ((!combatManager.inCombat && item.ooc)))
  
      return item;
    }
  
    equip(type, id, slot=0) {
      switch (type) {
        case "artifact": {
          if (this.getArtifact(id).unlocked) {
            this.state.loadout.artifacts[slot] = id;
          }
          break;
        };
        case "weapon": {
          if (this.getWeapon(id).unlocked)
            this.state.loadout.weapon = id;
          break;
        };
        case "move": {
          if (this.getMove(id).unlocked)
            this.state.loadout.moves[slot] = id;
          break;
        };
      }
    }
  
    unequip(type) {
      switch(type) {
        case "weapons": {
          this.state.loadout.weapon = null;
          break;
        }
        case "artifacts": {
          for (let x in this.state.loadout.artifacts) {
            this.state.loadout.artifacts[x] = null;
          }
          break;
        }
        case "moves": {
          for (let x in this.state.loadout.moves) {
            this.state.loadout.moves[x] = null;
          }
          break;
        }
        case "shoes": {
          for (let x in shoes.state.equipped) {
            shoes.state.equipped[x] = null;
          }
          break;
        }
      }
      main.render();
    }
  
    unlock(type, id, amount=1) {
      if (id == null)
        return;
      switch(type) {
        case "artifact": {
          if (!this.state.unlocks.artifacts.includes(id)) {
            this.state.unlocks.artifacts.push(id)
          }
          break;
        };
        case "weapon": {
          if (!this.state.unlocks.weapons.includes(id)) {
            this.state.unlocks.weapons.push(id)
          }
          break;
        };
        case "consumable": {
          let item = this.getConsumable(id)
          this.state.loadout.consumables[id].amount += amount;
          this.state.loadout.consumables[id].amount = utils.limitRange(this.state.loadout.consumables[id].amount, 0, item.maxStacks)
          this.state.loadout.consumables[id].unlocked = true;
          break;
        };
        case "area": {
          if (!this.state.unlocks.areas.includes(id)) {
            this.state.unlocks.areas.push(id)
            break;
          }
        }
      }
    }
  
    travelTo(id) {
      let area = data.travelAreas[id]
      if (this.state.unlocks.areas.includes(area.id)) {
        combatManager.setupFight(area);
      }
    }
  
    hasArtifact(id) {
      return this.state.loadout.artifacts.includes(id);
    }
  
    rollLoot(enemy, area) {
      var unlocks = [];
      let gotNewEquipment = false;
      let drops = [
        ...enemy.def.drops,
        ...area.areaDrops,
      ]
      for (let x in drops) {
        var drop = drops[x];
        var chance = drop.chance + (this.state.lootingDryStreak * this.lootingDryStreakMult);

        // magic find stat
        chance *= combatManager.player.magicFindMultiplier
  
        // boost consumable drops if player has perk
        if (drop.type == "consumable") {
          var perk = travel.getPerk("art_of_the_steal");
  
          chance += perk.tuning.boost * perk.level;
        }
  
        if (utils.checkRoll(chance)) {
          unlocks.push(drop)
        }
      }

      // filter out stuff we already have
      let alreadyUnlocked = [];
      for (let x in unlocks) {
        let unlock = unlocks[x]
        switch (unlock.type) {
          case "artifact": {
            if (travel.getArtifact(unlock.id).unlocked)
              alreadyUnlocked.push(unlock)
            break;
          }
          case "weapon": {
            if (travel.getWeapon(unlock.id).unlocked)
              alreadyUnlocked.push(unlock)
            break;
          }
        }
      }
      unlocks = unlocks.filter((x) => {return !alreadyUnlocked.includes(x)})

      let gotEquipment = false;
      let shoesUnlocked = [];
      let gotNewUnlock = false;

      for (let x in unlocks) {
        let unlock = unlocks[x];
        switch(unlock.type) {
          case "artifact": {
            let art = this.getArtifact(unlock.id)
            if (!art.unlocked) {
              this.unlock("artifact", art.id)
              // str += "You found {0}!".format(art.name)
              gotNewUnlock = true;
              gotEquipment = true;
            }
            break;
          }
          case "weapon": {
            let wep = this.getWeapon(unlock.id)
            if (!wep.unlocked) {
              this.unlock("weapon", wep.id)
              // str += "You found {0}!".format(wep.name)
              gotNewUnlock = true;
              gotEquipment = true;
            }
            break;
          }
          case "consumable": {
            let item = this.getConsumable(unlock.id)
            this.unlock("consumable", item.id, 1)
            // str += "You found a {0}!".format(item.name)
            gotNewUnlock = true;
            break;
          }
          case "shoe": {
            let item = shoes.unlock(unlock.id, area.shoeQualityMult)
            shoesUnlocked.push(shoes.getShoe(item))
            // str += "You found some {0}!".format(shoes.getShoe(item).name)
            gotNewUnlock = true;
            gotEquipment = true;
            break;
          }
        }
      }

      let msg = (unlocks.length > 0) ? "While rummaging through your foe's belongings, you pick out a few souvenirs to mark your victory:" : "Your foe did not appear to carry anything noteworthy."

      let header = "You defeated {0}! You gained {1} XP.".format(enemy.name, enemy.getRealStats().xpReward)

      console.log("Unlocks:")
      console.log(unlocks)
      console.log(shoesUnlocked)

      return <div>
        <p>{header}</p>
        <p>{msg}</p>
        <LootScreen data={{
        gotEquipment: gotEquipment,
        gotSomething: gotNewUnlock,
        drops: unlocks,
        shoes: shoesUnlocked,
      }}/>
      </div>
    }
  }