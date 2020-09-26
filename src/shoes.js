import React from 'react';
import * as data from "./generalData.js"
import { travel, combatManager, levelling, ballGame, main, stats } from "./BallGame.js"
import _ from "lodash"
import * as utils from "./utilities.js"
import { v4 as uuidv4 } from 'uuid';

export class ShoeManager {
    constructor() {
        for (let x in data.shoes) {
            data.shoes[x].id = x;
        }
        for (let x in data.modifiers) {
            data.modifiers[x].id = x;
        }
    }
    state = {
        equipped: [
            null,
            null,
        ],
        owned: [
            
        ],
        donatedLp: 0,
    }

    forge = {
        element1: null,
        element2: null,
        result: null,
    }

    baseLegBreakChance = 0.30;
    inventoryLimit = 15;
    helpPopup = { // todo remove this, and just use the tutorial
        title: "SHOEFORGING HELP",
        description: <div>
            <p>Welcome to the Shoeforge!</p>
            <p>This public facility allows you to create the shoes of your dreams by combining 2 shoes together at a time.</p>
            <p>The second shoe will be sacrificed to imbue the first one with its properties, upgrading them if the base shoe already had them.</p>
            <p>Specific combinations of shoe properties may bestow new unique powers onto the base shoe that cannot be acquired in other ways. Experiment often!</p>
        </div>,
        buttons: [data.popupButtons.tos],
    }

    get isForgeUnlocked() {return true}

    get isForgeReady() {return this.forge.element1 != null && this.forge.element2 != null}

    get legBreakChance() {
        // only the highest protection value is used
        let reduction = 0;
        for (let x in this.state.equipped) {
            if (this.state.equipped[x] != null) {
                let shoe = this.getShoe(this.state.equipped[x]);
                if (shoe.legProtection > reduction)
                    reduction = shoe.legProtection;
            }
        }

        return this.baseLegBreakChance - (this.baseLegBreakChance * reduction)
    }

    get shoeStatMods() {
        let statMods = _.cloneDeep(data.emptyStatSheet)
        let statMult = 1; // multiplier for all stat boosts from shoes

        let perk = travel.getPerk("beta_armor");
        if (perk.unlocked) {
            statMult += perk.level * perk.tuning.amount;
        }

        // for each equipped shoe
        for (let x in this.state.equipped) {
            let shoe = this.state.equipped[x]
            if (shoe != null) {
                // for each modifier on shoe
                for (let z in shoe.modifiers) {
                    let mod = data.modifiers[shoe.modifiers[z].id]
                    let quality = shoe.modifiers[z].quality

                    // for each stat mod
                    for (let c in mod.statMods) {
                        let value = this.getValue(mod, c, quality)
                        statMods[c] += value * statMult;
                    }
                }
            }
        }

        return statMods;
    }

    getShoeValue(save) {
        let price = 0;
        price += save.modifiers.length;
        price += save.workAmount;

        return Math.max(price, 1)
    }

    getForgePrice() {
        return Math.round((this.getShoeValue(this.forge.element1) + this.getShoeValue(this.forge.element2)) / 2, 0)
    }

    addShoeToForge(index) {
        this.forge.result = null;
        let shoe = this.state.owned[index]
        if (this.isThisShoeEquipped(shoe)) { // todo a func that checks if a shoe is equipped, load-proof
            alert("Unequip this shoe first!")
            return;
        }
        if (this.forge.element1 == null && shoe != this.forge.element2)
            this.forge.element1 = shoe;
        else if (this.forge.element2 == null && shoe != this.forge.element1)
            this.forge.element2 = shoe;
        main.render()
    }

    removeShoeFromForge(index) {
        this.forge.result = null;
        switch (index) {
            case 0: {
                this.forge.element1 = null;
                break;
            }
            case 1: {
                this.forge.element2 = null;
                break;
            }
        }
        main.render()
    }

    checkRecipes(modList) {
        console.log(modList)
        let recipesFulfilled = []
        for (let x in data.recipes) {
            let recipe = data.recipes[x]
            let fulfilled = true;

            for (let z in recipe.ingredients) {
                let ingredient = recipe.ingredients[z]

                console.log(utils.countInArray(recipe.ingredients, ingredient))
                if (utils.countInArray(recipe.ingredients, ingredient) > utils.countInArray(modList, ingredient)) {
                    fulfilled = false;
                    break;
                }
            }

            if (fulfilled && !modList.includes(recipe.id))
                recipesFulfilled.push(recipe.id);
        }
        return recipesFulfilled;
    }

    isThisShoeEquipped(save) {
        for (let x in this.state.equipped) {
            if (this.state.equipped[x] != null) {
                if (this.state.equipped[x].guid == save.guid)
                    return true;
            }
        }
        return false;
    }

    discardShoe(save, giveToCharity=true, force=false) {
        if (this.isThisShoeEquipped(save) && !force) {
            alert("Can't discard an equipped shoe!")
            return;
        }

        // warn when discarding shoes
        if (!force) {
            if (!window.confirm("Are you sure you want to discard this shoe?")) {
                return;
            }
        }
        
        if (giveToCharity) {
            this.state.donatedLp += this.getShoeValue(save)
        }

        this.state.owned = this.state.owned.filter((x) => {return x != save})

        main.render()
    }

    // get average quality of the mods of a saved shoe
    getAverageQuality(save) {
        let total = 0;
        let count = 0;
        for (let x in save.modifiers) {
            let mod = save.modifiers[x]
            total += mod.quality
            count++;
        }
        return total/count;
    }

    forgeShoes() {
        if (this.forge.element1 == null || this.forge.element2 == null)
            return;

        let price = this.getForgePrice();

        if (stats.state.legs >= price) {
            stats.state.legs -= price
        }
        else {
            alert("Not enough LP!")
            return;
        }
        
        // add new modifiers from second shoe
        let newMods = []
        let oldMods = []
        for (let x in this.forge.element1.modifiers) {
            oldMods.push(this.forge.element1.modifiers[x].id)
        }
        for (let x in this.forge.element2.modifiers) {
            let mod = _.cloneDeep(this.forge.element2.modifiers[x])
            for (let z in this.forge.element1.modifiers) {
                let basemod = this.forge.element1.modifiers[z]
                if (basemod.id != mod.id && !oldMods.includes(mod.id)) { // add the mod if base doesn't have it
                    newMods.push({id: mod.id, quality: mod.quality, crafted: true, suffix: false,})
                    oldMods.push(mod.id)
                }
                else if (oldMods.includes(mod.id)) { // otherwise add half quality of second shoe
                    basemod.quality += mod.quality / 2
                    basemod.quality = Math.min(basemod.quality, 1)
                }
            }
        }

        for (let x in newMods) {
            this.forge.element1.modifiers.push(newMods[x])
        }

        // crafting
        // this has the problem of duplicating ingredients since at this point we already added them to ele1
        let ingredients = []
        for (let x in this.forge.element1.modifiers) {
            let mod = this.forge.element1.modifiers[x];
            ingredients.push(mod.id)
        }
        for (let x in this.forge.element2.modifiers) {
            let mod = this.forge.element2.modifiers[x];
            ingredients.push(mod.id)
        }

        let recipesFullfilled = this.checkRecipes(ingredients)
        console.log("Crafted:")
        console.log(recipesFullfilled)

        let averageQuality = this.getAverageQuality(this.forge.element1)

        for (let x in recipesFullfilled) {
            let mod = {id: recipesFullfilled[x], quality: averageQuality, suffix: true}
            this.forge.element1.modifiers.push(mod)
        }
        if (recipesFullfilled.length > 0)
            window.alert("You crafted a new shoe modifier!")

        this.forge.element1.workAmount++;

        console.log(this.forge.element1)
        this.forge.result = _.cloneDeep(this.forge.element1);

        // reset forge interface and remove the sacrificed shoe
        this.forge.element1 = null;
        // this.state.owned = this.state.owned.filter((x) => {return x != this.forge.element2})
        this.discardShoe(this.forge.element2, false, true)
        this.forge.element2 = null;

        console.log(this.forge.result)

        main.render();
    }

    getShoeFlags() {
        let flags = []
        for (let x in this.state.equipped) {
            let shoe = this.getShoe(this.state.equipped[x]);
            if (shoe != null) {
                for (let z in shoe.flags)
                    flags.push(shoe.flags[z])
            }
        }
        return flags;
    }

    getValue(mod, index, quality) { // todo add negative support
        let statmod = mod.statMods[index]

        let step = (statmod.percentage) ? 0.01 : 1;
        if (statmod.step != undefined)
            step = statmod.step

        let possibleSteps = (statmod.max - statmod.min) / step
        let stepsTaken = utils.round(possibleSteps * quality);

        let rawvalue = statmod.min + (step * stepsTaken)
        let value = utils.limitRange(rawvalue, statmod.min, statmod.max);

        return value;
    }

    rollShoe(id, qualityMult=1, capIncrease=null,) {
        capIncrease = (capIncrease != null) ? capIncrease : 0;
        let base = _.cloneDeep(data.shoes[id]);
        let shoe = {
            id: base.id,
            workAmount: 0,
            guid: uuidv4(),
            modifiers: [

            ],
        }

        for (let x in base.modifiers) {
            let mod = data.modifiers[base.modifiers[x].id]
            let quality = ((base.modifiers[x].quality * data.global.shoeMaxQualityModifier) + capIncrease) * Math.random() * qualityMult;
            quality = utils.limitRange(quality, 0, 1)
            shoe.modifiers.push({id: mod.id, quality: quality, crafted: false, suffix: false,})
        }

        return shoe;
    }

    // get all info about an owned shoe. This creates a handy object that includes both the saved data as well as vanity (name, icon)
    getShoe(save) {
        if (save == null)
            return null;
        let shoe = _.cloneDeep(save)
        let base = data.shoes[shoe.id];
        shoe.name = base.name;
        shoe.icon = base.icon
        shoe.legProtection = base.legProtection;
        shoe.modifierText = []
        shoe.flags = [];

        // vanity prefixes/suffixes in name
        let prefixes = []
        let suffixes = []

        for (let x in shoe.modifiers) {
            let mod = data.modifiers[shoe.modifiers[x].id];
            let values = [];

            switch (shoe.modifiers[x].suffix) {
                case false: {
                    prefixes.push(mod.prefix)
                    break;
                }
                case true: {
                    suffixes.push(mod.suffix)
                    break;
                }
            }

            for (let z in mod.flags) {
                shoe.flags.push(mod.flags[z])
            }

            for (let z in mod.statMods) {
                let value = this.getValue(mod, z, shoe.modifiers[x].quality)
                if (mod.statMods[z].percentage != undefined) {
                    value *= 100;
                }
                values.push(utils.round(value, 2))
            }

            // format header
            let text = mod.description.format(...values)
            // {"{0} - {1}".format(mod.name, text)}
            shoe.modifierText.push(<p key={x+1}><b>{mod.name}</b>{" - "}{text}{" ({0}% Quality)".format(utils.round(shoe.modifiers[x].quality * 100, 0))}</p>)
            // shoe.modifierText.push(<p key={-x}>{"Quality: {0}%".format(utils.round(shoe.modifiers[x].quality * 100, 2))}</p>)
        }

        let prefixedName = "";
        let suffixedName = "";

        for (let x in prefixes) {
            prefixedName += prefixes[x] + " "
        }
        for (let x in suffixes) {
            suffixedName += " " + suffixes[x]
        }

        shoe.name = prefixedName + shoe.name + suffixedName;

        shoe.modifierText.push(<p key={-2000}>{"Leg Protection: {0}%".format(utils.round(shoe.legProtection * 100, 2))}</p>)

        return shoe;
    }

    equip(index) {
        let slot = (this.state.equipped[0] != null && travel.getPerk("shoe_dual_wielding").unlocked) ? 1 : 0;

        if (!this.isThisShoeEquipped(this.state.owned[index]))
            this.state.equipped[slot] = this.state.owned[index];

        main.render()
    }

    unlock(id, qualityMult=1, capIncrease=null) {
        let shoe = this.rollShoe(id, qualityMult, capIncrease);
        // this.state.equipped[0] = shoe;
        if (this.state.owned.length < this.inventoryLimit) {
            this.state.owned.push(shoe);
            console.log(this.getShoe(this.state.owned[this.state.owned.length - 1]))
        }
        else {
            alert("You have no more space for shoes. This new one has been discarded.")
        }

        return shoe;
    }
}