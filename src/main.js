import React from 'react';
import { FileButton } from "./genericElements.js"
import * as utils from "./utilities.js"
import _ from "lodash"
import * as data from "./generalData.js"
import { travel, combatManager, levelling, ballGame, main, shoes, colorManager, ballManager, stats, config, saveMetaData, IGNORE_SAVE } from "./BallGame.js"
import { Hitsplat } from './combatComponents.js';

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
    save = JSON.parse(save)
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
    for (let x in newObject) {
      if (typeof newObject[x] == "object") {
        newObject[x] = this.deepExtend(newObject[x], override[x])
      }
      else {
        if (override != undefined && override[x] != undefined) {
          console.log(override)
          newObject[x] = override[x];
        }
      }
    }
    console.log(newObject)
    return newObject;
  }

  loadSave() {
    let save = utils.load("save")

    if (save != null && save != undefined) {
      if (save.meta.protocol < saveMetaData.protocol) {
        main.addPopup({
          title: "OBSOLETE SAVE",
          description: "Your save was wiped due to changes in the save format. My deepest condolences.",
          buttons: [data.popupButtons.sadClose],
        })
      }
      else {
        _.extend(ballGame.state, save.ballGame)
        _.extend(stats.state, save.stats)
        _.extend(colorManager.state, save.colors)
        _.extend(ballManager.state, save.balls)
        _.extend(travel.state, save.travel)
        //travel.state = this.deepExtend(travel.state, save.travel)
        _.extend(levelling.state, save.levelling)
        config = save.config;
        saveMetaData = save.meta;

        // combatManager.player.level = 1;
        combatManager.player.scale(levelling.state.level)
        combatManager.player.hp = travel.state.savedHp;
        console.log(combatManager.player)

        //travel.getPerk("test")

        stats.updateDay()
      }
    }
  }

  beforeUnload() {
    if (!IGNORE_SAVE)
      this.save();
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
    
    newQueue.push(popup)
    this.popupQueue = newQueue;
    this.render();
  }

  closePopup() {
    const newQueue = this.popupQueue.slice();
    newQueue.shift()
    this.popupQueue = newQueue;
    console.log(this.popupQueue)
    this.render();
  }

  generateHitsplat(hit) {
    this.app.hitsplats.queued.push({
      duration: 1000,
      hit: hit,
      element: <Hitsplat value={hit.dmg}/>,
    })
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
