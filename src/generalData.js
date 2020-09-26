import React from 'react';
import * as utils from "./utilities.js"
import * as Game from "./BallGame.js"
import * as miscData from "./miscData.js"
// import * as shoeData from "./shoeData.js"
import * as entityData from "./entityData.js"
import _ from "lodash"

// note: using <br/> in a <p> will turn that element into a collection and spew "no key" errors

export const images = miscData.images;
export const colors = miscData.colors;
export const balls = miscData.balls;
export const tutorials = miscData.tutorials;
export const strings = miscData.strings;
export const drops = entityData.drops;
export const global = {
    version: "v0.7.0",
    protocol: 0,
    production: true,

    // global game tuning
    shoeMaxQualityModifier: 1,
    enemyXpMultiplier: 1,
    areaProgressNeededMultiplier: 1.4,
    areaProgressRefund: 0.5,
    duplicateBallWeightMultiplier: 0.6,
}

export const emptyStatSheet = entityData.emptyStatSheet;

export const travelAreas = {
    // testing: {
    //     name: "Debug Area",
    //     id: "testing",
    //     description: "Your local testing area.",
    //     levelRange: {
    //         min: 1,
    //         max: 50,
    //     },
    //     enemies: [
    //         {id: "testing_dummy", weight: 100},
    //     ],
    //     entryMessages: [
    //         "{0} appears!"
    //     ],
    // },
    street: {
        name: "Street",
        id: "street",
        description: "Your local street.",
        levelRange: {
            min: 5,
            max: 10,
        },
        enemies: [
            {id: "random_dude", weight: 100, areaProgress: 15},
            {id: "random_dog", weight: 100, areaProgress: 10},
            {id: "random_dawg", weight: 60, areaProgress: 25},
        ],
        boss: {id: "emo_kid", weight: 1},
        nextArea: "market",
        entryMessages: [
            "{0} appears!",
            "You stumble upon a hostile {0}!",
            "{0} wants to beat you up!",
            "{0} stands in your way!"
        ],
        bossEntryMessage: "{0} leaps out of a dark alleyway!",
        areaDrops: drops.street,
        shoeQualityMult: 1,
    },
    market: {
        name: "Market",
        id: "market",
        description: "Your local supermarket.",
        levelRange: {
            min: 10,
            max: 17,
        },
        enemies: [
            {id: "random_customer", weight: 120},
            {id: "market_cop", weight: 100},
            {id: "cardboard_standee", weight: 40},
        ],
        entryMessages: [
            "{0} appears!",
            "You stumble upon a hostile {0}!",
            "{0} wants to beat you up!",
            "{0} stands in your way!"
        ],
        boss: {id: "karen", weight: 1},
        bossEntryMessage: "{0} comes to vent her anger!",
        nextArea: "forest",
        areaDrops: [...drops.market, ...drops.street],
        shoeQualityMult: 1.2,
    },
    forest: {
        name: "The Pine Woods",
        id: "market",
        description: "Your local alpine forest.",
        levelRange: {
            min: 15,
            max: 25,
        },
        enemies: [
            {id: "slime", weight: 70},
            {id: "bandit", weight: 100},
            {id: "muddy_crab", weight: 80},
            {id: "bear", weight: 100},
            {id: "travelling_merchant", weight: 70},
            // {id: "quest_giver", weight: 70},
        ],
        entryMessages: [
            "{0} appears!",
            "You stumble upon a hostile {0}!",
            "{0} wants to beat you up!",
            "{0} stands in your way!"
        ],
        boss: {id: "hexer", weight: 1},
        bossEntryMessage: "{0} senses your scent!",
        nextArea: "battlefield",
        areaDrops: drops.forest,
        shoeQualityMult: 1.4,
    },
    temple: {
        name: "Killfreak Temple",
        id: "temple",
        description: "Your local temple of Merida.",
        levelRange: {
            min: 20,
            max: 50,
        },
        enemies: [
            {id: "corrupted_shade", weight: 100},
            {id: "droughted_skeleton", weight: 100},
            {id: "muddy_crab", weight: 80},
            {id: "dragon", weight: 60},
            {id: "radiant_quest_giver", weight: 50},
        ],
        entryMessages: [
            "{0} appears!",
            "You stumble upon a hostile {0}!",
            "{0} ambushed you!",
            "{0} creeps around the corner!"
        ],
        boss: {id: "malkoran", weight: 1},
        bossEntryMessage: "You finally arrive at {0}'s doorstep!",
        nextArea: null,
        areaDrops: [...drops.temple, ...drops.forest],
        shoeQualityMult: 1.5,
    },
}

export const moves = {
    penalty_kick: {
        name: "Penalty Kick",
        id: "penalty_kick",
        description: <div>
            <p>A strike which pierces enemy defenses and heavily reduces them for multiple turns.</p>
            <p>Defense reduction is increased if empowered with Willpower.</p>
            <p>Requires 40 Willpower to empower. Drains 20 Willpower to empower. Inflicts 20 sweat.</p>
        </div>,
        scalingDescription: [
            "+10% damage per level.",
            "+10% defense deduction per level.",
            "At level 3: +1 turn duration.",
        ],
        prices: [1, 1, 1]
    },
    feign_injury: {
        name: "Feign Injury",
        id: "feign_injury",
        description: <div>
            <p>Feign an injury to get the attention of a judge, who may give your enemy a red card, stopping them from playing for a while.</p>
            <p>Duration of effect is increased if empowered with Willpower.</p>
            <p>Requires 50 Willpower to empower. Drains 30 Willpower to empower. Inflicts 70 sweat.</p>
        </div>,
        scalingDescription: [
            "+10% success chance per level.",
            "-10% sweat gained per level on use.",
            "At level 3: 35% chance of +1 turn duration.",
        ],
        prices: [1, 1, 1]
    },
    self_reserve: {
        name: "Self-Reserve",
        id: "self_reserve",
        description: <div>
            <p>Restore 15% health at the start of your next turn. Additionally, gain a 20% damage bonus for 3 turns. If empowered, restore 10% more health and gain +20% defense for 3 turns as well.</p>
            <p>Requires 50 Willpower to empower. Drains 30 Willpower to empower. Inflicts 30 sweat.</p>
        </div>,
        scalingDescription: [
            "+5% healing per level.",
            "At level 2: cleanse a random negative status effect off of yourself immediately, if empowered.",
            "At level 3: remove 25% sweat at the start of your next turn, if empowered.",
        ],
        prices: [1, 1, 2]
    },
}

export const weapons = {
    breakdawner: {
        name: "The Breakdawner",
        id: "breakdawner",
        icon: images.weapons["breakdawner.png"],
        description: <div>
            <p>Strikes from The Breakdawner fill you with determination, dealing religious-type damage and restoring health based on damage done, smiting undead foes harder. Its lifesteal increases with Willpower, but does not consume it.</p>
        </div>,
        lore: "",
        skillName: "Breakdawner", // shown in combat button (?)
    },
    tinderbow: {
        name: "Tinderbow & Matchsticks",
        id: "tinderbow",
        icon: images.weapons["placeholder.png"],
        description: <div>
            <p>The Tinderbow shoots lit matchsticks which ignite your enemy, dealing damage every turn. The burning effect stacks up to 5 times, and all stacks are removed when the effect ends. Deals less damage than your average weapon.</p>
        </div>,
        lore: "",
        skillName: "Tinderbow",
    },
    // player_weapon_kifafuq_scepter: {
    //     name: "Kifafuq's Scepter",
    //     id: "player_weapon_kifafuq_scepter",
    //     icon: "Assets/Icons/placeholder.png",
    //     desc: "Hits from Kifafuq's Scepter have a chance to inflict a random negative status effect onto the enemy. Very mischievous!",
    //     skillName: "Scepter",
    // },
    nerfing_gun: {
        name: "Nerfing Gun",
        id: "nerfing_gun",
        icon: images.weapons["placeholder.png"],
        description: <div>
            <p>The Nerfing Gun fires nerfing bolts which weaken targets, reducing their health, damage, accuracy and defense by minor amounts. The debuff is stackable, but stacks expire after 3 turns.</p>
        </div>,
        lore: "",
        skillName: "Nerfing Gun",
    },
    sniper_rifle: {
        name: "Sniping Rifle",
        id: "sniper_rifle",
        icon: images.weapons["placeholder.png"],
        description: <div>
            <p>The Sniping Rifle is exceptionally accurate and passively increases your accuracy, but is considerably weaker than other weapons.<i>Sometimes it takes the wrong type of technique to do the right job.</i></p>
        </div>,
        lore: "<i>Turns out it's hard to miss when you don't have ammo and opt to bash your enemy with the firearm itself.</i>",
        skillName: "Sniper Rifle",
    },
    shield: {
        name: "Shield of Resistance",
        id: "shield",
        icon: images.weapons["placeholder.png"],
        description: <div>
            <p>The Shield of Resistance does not deal damage, but instead increases your defense during the next enemy turn by 45%, or 75% if empowered. Additionally, it confers a passive 10% chance to block any attack.</p>
        </div>,
        lore: "<i>todooo</i>",
        skillName: "Shield of Resistance",
    },
}

export const artifacts = {
    engraved_ring: {
        name: "Engraved Ring of Healing", // Fargoth? more like Faggot LOL
        id: "engraved_ring",
        description: <div>
            <p>When you spend Willpower, restore (Willpower Spent * 0.7)% of your health. Increases healing when out of combat by +3% of your maximum HP per second.</p>
        </div>,
        icon: images.artifacts["temp_ring.png"],
        tuning: {
            victoryHealing: 0.2,
            OOCHealing: 3,
            healingPerWillpower: 0.7, // restore 80% health if you use 100% willpower at once. OP?
        },
    },
    monocles_of_duality: {
        name: "Monocles of Duality",
        id: "monocles_of_duality",
        description: <div>
            <p>Increases your chance to deal a critical hit by 10%. Decreases your accuracy by 15% (bad prescription), but your precision is increased by 10% per hit, helping you get more consistent outcomes.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            positiveStatus: "monocles_of_duality_status_positive",
            negativeStatus: "monocles_of_duality_status_negative",
            bonusAccuracy: -0.15,
            bonusCritChance: 0.1, // "només 0.1 ???"
            bonusPrecision: 0.1,
        },
    },
    bottled_glass: {
        name: "Bottled Glass",
        id: "bottled_glass",
        description: <div>
            <p>Your damage increases by 30% for each fight completed, but your maximum health decreases by 5% of your normal maximum health each turn. Both effects decay outside of combat.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            buff: "bottled_glass_status_positive",
            debuff: "bottled_glass_status_negative"
        },
    },
    cleansing_talisman: {
        name: "Cleansing Talisman",
        id: "cleansing_talisman",
        description: <div>
            <p>When you attack with your weapon, the Cleansing Talisman removes one negative effect from your target to grant you 20 Willpower.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            willpowerGain: 0.2,
        },
    },
    travelling_mug: {
        name: "Travelling Mug",
        id: "travelling_mug",
        description: <div>
            <p>Your Willpower capacity is increased to 200, but you gain 20 Sweat at the start of your turns if your Willpower is below 100.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            maxWillpowerIncrease: 1,
            threshold: 1,
            sweatInflicted: 0.2,
        },
    },
    zeal: {
        name: "Zeal",
        id: "zeal",
        description: <div>
            <p>If you're at maximum willpower, your next weapon strike is performed twice in that turn and expends 50% of your maximum willpower.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            willpowerLoss: 0.5,
            threshold: 1,
        },
    },
    realitious_virtuality_binocles: {
        name: "Realitious Virtuality Binocles",
        id: "realitious_virtuality_binocles",
        description: <div>
            <p>If you were to take damage worth more than 30% of your maximum health, don't, and instead pay 40 Willpower. If you don't have enough willpower, this effect does not trigger.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            cost: 0.4,
            threshold: 0.3,
        },
    },
    clipboard: {
        name: "Clipboard o' Deadlines",
        id: "clipboard",
        description: <div>
            <p>Your Willpower Generation gets a bonus inversely proportional to your health %; for every 2% of health below/above 80%, your Willpower Generation is increased/decreased by 2% respectively.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            step: 0.02,
            threshold: 0.8,
        },
    },
    racing_chair: {
        name: "Racing Car Chair",
        id: "racing_chair",
        description: <div>
            <p>When you enter combat, gain Willpower equal to 50% of your maximum capacity, as well as 50 Sweat.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            willpower: 0.5,
            sweat: 0.5,
        },
    },
    chronicle: {
        name: "The Kingdom's Chronicles",
        id: "chronicle",
        description: <div>
            <p>When you're below 40 Willpower, status effects which afflict you no longer decay. Positive stat increases from statuses are 20% less effective on you at all times.</p>
        </div>,
        icon: images.artifacts["placeholder.png"],
        tuning: {
            threshold: 0.4,
            statMult: 0.8,
        },
    },
}

export const popupButtons = miscData.popupButtons;

export const perks =  {
    legendary_strikes: {
        name: "Legendary Strikes",
        id: "legendary_strikes",
        description: "Allows your ball to deal devastating damage when used to attack during a Legendary Streak.",
        maxLevel: 1,
        prices: [1],
        tuning: {
            mult: 6, // for real?
        }
    },
    flow: {
        name: "The Flow",
        id: "flow",
        description: "Gain more Willpower during streaks. Gain +10% Willpower generation per win/loss in streaks of 3+ wins/losses, +5% per level.",
        maxLevel: 3,
        prices: [1, 1, 1],
        tuning: { // additive
            baseBoost: 0.1,
            levelBoost: 0.05,
        }
    },
    art_of_the_steal: {
        name: "The Art of The Steal",
        id: "art_of_the_steal",
        description: "Increases your chance to find consumable items after winning a fight by 4% per level.",
        maxLevel: 2,
        prices: [1, 1],
        tuning: {
            boost: 0.04,
        }
    },
    allowance: {
        name: "Mindfulness",
        id: "allowance",
        description: "Increases your Willpower Allowance by 5 per level.",
        maxLevel: 3,
        prices: [1, 1, 2],
        tuning: {
            boost: 0.05,
        }
    },
    shoe_dual_wielding: {
        name: "Dual-Wearing",
        id: "shoe_dual_wielding",
        description: <div>
            <p>Allows you to wear 2 shoes at a time.</p>
            <p><i>Turns out there's nothing stopping you from putting a second shoe on your other foot! Who would've thought?</i></p>
        </div>,
        maxLevel: 1,
        prices: [2],
        tuning: {}
    },
    beta_armor: {
        name: "Beta Armor",
        id: "beta_armor",
        description: <div>
            <p>Increases stat boosts from shoes by 10% per level.</p>
            <p><i></i></p>
        </div>,
        maxLevel: 3,
        prices: [1, 1, 1],
        tuning: {
            amount: 0.1,
        }
    },
    mental_gymnastics: {
        name: "Mental Gymnastics",
        id: "mental_gymnastics",
        description: <div>
            <p>Mental Gymnastics apply a permanent debuff to your enemies which increases their Manipulation by 8% per level, allowing you to inflict statuses upon them with more ease.</p>
            <p>Each level is worth 30 ECTS credits.</p>
        </div>,
        maxLevel: 3,
        prices: [1, 1, 1],
        tuning: {
            amount: 0.08,
        }
    },
}

export const consumables = {
    water_bottle: {
        name: "Water Bottle",
        id: "water_bottle",
        description: <div>
            <p>A refreshing bottle of mineral water.</p>
            <p>Heals for 40% of your maximum health.</p>
        </div>,
        icon: images.weapons["placeholder.png"],
        maxStacks: 5,
        ooc: true,
        // skill: "consumable_skill_water_bottle",
        tuning: {
            heal: 0.4,
        },
    },
    towel: {
        name: "Disposable Towel",
        id: "towel",
        description: <div>
            <p>A single-use towel, perfect for wiping off the sweat after an intense soccer match.</p>
            <p>Removes 50 Sweat.</p>
        </div>,
        icon: images.weapons["placeholder.png"],
        maxStacks: 5,
        ooc: true,
        // skill: "consumable_skill_towel",
        tuning: {
            sweatHeal: 0.5,
        },
    },
    pepper_spray: {
        name: "Pepper Spray",
        id: "pepper_spray",
        description: <div>
            <p>A classic self-defense tool, made with home-grown peppers.</p>
            <p>100% base chance to stun an enemy.</p>
        </div>,
        icon: images.weapons["placeholder.png"],
        maxStacks: 5,
        ooc: false,
        skill: "consumable_skill_pepper_spray",
        tuning: {
            duration: 2,
            chance: 1,
        },
    },
    arena_ticket: {
        name: "Arena Ticket",
        id: "arena_ticket",
        description: <div>
            <p>A ticket to a firstest-row seat in the arena!</p>
            <p>Allows you to enter one arena match.</p>
        </div>,
        icon: images.weapons["placeholder.png"],
        maxStacks: 99,
        ooc: false,
        notUsable: true,
    },
    clarity_nut: {
        name: "Clarity Nut",
        id: "clarity_nut",
        description: <div>
            <p>Bust this bad boy open at anytime to gain a rush of inspiration and enlightenment.</p>
            <p>Gives 50 Willpower.</p>
        </div>,
        icon: images.weapons["placeholder.png"],
        maxStacks: 5,
        ooc: true,
        tuning: {
            amount: 0.5,
        }
    },
}

export const skills = {
    base_attack: {
        base: null,
        name: "Base Attack",
        id: "base_attack",
        description: "Description",
        behaviour: "attack",
        isWeaponSkill: false,
        isCharged: false,
        target: "enemy",
        dmg: {
            mult: 1,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "default",
        },
        statuses: [],
        log: {
            autoLogDmg: true,
            use: {msg: "{0} uses {1}!", params: ["user", "skill"]}
        },
        willpower: {
            empowerable: false,
            threshold: 0,
            drain: 0,
            gain: 0,
            dmgBonus: 0,
        },
        heal: {
            target: "self",
            flatAmount: 0,
            percentAmount: 0,
        }
    },
    base_no_dmg: {
        base: null,
        name: "Base No Dmg Skill",
        id: "base_no_dmg",
        description: "Description",
        behaviour: "attack",
        isWeaponSkill: false,
        isCharged: false,
        target: "self",
        dmg: {
            mult: 0,
            range: 0,
            acc: 1,
            dodgeable: false,
            type: "default",
        },
        statuses: [],
        log: {
            autoLogDmg: true,
            use: {msg: "{0} uses {1}!", params: ["user", "skill"]}
        },
        willpower: {
            empowerable: false,
            threshold: 0,
            drain: 0,
            gain: 0,
            dmgBonus: 0,
        },
        heal: {
            target: "self",
            flatAmount: 0,
            percentAmount: 0,
        }
    },
    test_attack: {
        base: "base_attack",
        name: "Test Attack",
        id: "test_attack",
        behaviour: "attack",
    },
    debug_kill: {
        base: "base_attack",
        name: "Debug Kill",
        id: "debug_kill",
        behaviour: "attack",
        dmg: {
            mult: 30,
            range: 0.1,
            acc: 1,
            dodgeable: false,
            type: "default",
        },
    },
    player_kick_ball: {
        base: "base_attack",
        name: "Kick Ball",
        id: "player_kick_ball",
        behaviour: "player_kick_ball",
        log: {
            autoLogDmg: false,
            use: {msg: "You kick your ball at {0}, dealing {1} damage!", params: ["target", "dmg"]}
        },
        willpower: {
            gain: 0.2,
            // dmgBonus: 0.3
        },
        special: {
            sweatGain: 0,
        }
    },
    breakdawner: {
        base: "base_attack",
        name: "Breakdawner",
        id: "breakdawner",
        behaviour: "player_breakdawner",
        isWeaponSkill: true,
        log: {
            autoLogDmg: false,
            use: {msg: "You slash {0} with The Breakdawner, dealing {1} damage and restoring {2} health!", params: ["target", "dmg", "heal"]}
        },
        dmg: {
            mult: 1.15,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "religious",
        },
        special: {
            baseLifeSteal: 0.1,
            bonusLifeSteal: 0.6, // multiplied by wp
        }
    },
    tinderbow: {
        base: "base_attack",
        name: "Tinderbow & Matchsticks",
        id: "tinderbow",
        behaviour: "player_tinderbow",
        isWeaponSkill: true,
        log: {
            autoLogDmg: false,
            use: {msg: "You fire a burning matchstick at {0}, dealing {1} damage!", params: ["target", "dmg"]}
        },
        statuses: [
            {id: "tinderbow_burn", chance: 0.95, duration: 3}
        ],
        dmg: {
            mult: 0.75,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            // dmgBonus: 0.4
        }
    },
    nerfing_gun: {
        base: "base_attack",
        name: "Nerfing Gun",
        id: "nerfing_gun",
        behaviour: "attack",
        isWeaponSkill: true,
        log: {
            autoLogDmg: false,
            use: {msg: "You fire a nerfing projectile at {0}, dealing {1} damage!", params: ["target", "dmg"]}
        },
        statuses: [
            {id: "nerfed", chance: 1, duration: 3}
        ],
        dmg: {
            mult: 0.8,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            // dmgBonus: 0.4
        }
    },
    sniper_rifle: {
        base: "base_attack",
        name: "Sniper Rifle",
        id: "sniper_rifle",
        behaviour: "attack",
        isWeaponSkill: true,
        log: {
            autoLogDmg: false,
            use: {msg: "You bash {0} with your rifle, dealing {1} damage!", params: ["target", "dmg"]}
        },
        dmg: {
            mult: 0.7,
            range: 0.1,
            acc: 1.5,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            // dmgBonus: 0.4
        }
    },
    shield: {
        base: "base_attack",
        name: "Shield of Resistance",
        id: "shield",
        behaviour: "self_buff_player",
        isWeaponSkill: true,
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "You prepare your shield!", params: []}
        },
        statuses: [
            {id: "player_shield", chance: 1, duration: 2},
            {id: "player_shield_empowered", chance: 1, duration: 2, empowered: true}
        ],
        willpower: {
            empowerable: true,
            threshold: 0.4,
            drain: 0.3,
        }
    },
    penalty_kick: {
        base: "base_attack",
        name: "Penalty Kick",
        id: "penalty_kick",
        behaviour: "soccerAttack",
        log: {
            autoLogDmg: false,
            use: {msg: "You make a penalty kick at {0}, piercing their defenses and dealing {1} damage!", params: ["target", "dmg"]}
        },
        statuses: [
            {id: "penalty_kick_status", chance: 0.7, duration: 3},
            {id: "penalty_kick_status_empowered", chance: 0.9, duration: 3, empowered: true},
        ],
        dmg: {
            mult: 0.9,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            empowerable: true,
            threshold: 0.4,
            drain: 0.2,
            dmgBonus: 0.3,
        },
        special: {
            sweatGain: 0.2,
            bonusDmgPerUpgradeLevel: 0.1, // +10% per level
        }
    },
    feign_injury: {
        base: "base_no_dmg",
        name: "Feign Injury",
        id: "feign_injury",
        behaviour: "feign_injury",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "You feign an injury!", params: []}
        },
        statuses: [
            {id: "feign_injury_status", chance: 0.6, duration: 2},
            {id: "feign_injury_status_empowered", chance: 1.1, duration: 2, empowered: true},
        ],
        willpower: {
            empowerable: true,
            threshold: 0.5,
            drain: 0.3,
        },
        special: {
            sweatGain: 0.7,
            bonusSuccessChancePerLevel: 0.1, // +10% success chance per upgrade level
            bonusSweatReductionPerLevel: 0.1,
            bonusExtraDurationTreshold: 3, // +turn duration at level 3
        }
    },
    self_reserve: {
        base: "base_no_dmg",
        name: "Self-Reserve",
        id: "self_reserve",
        behaviour: "self_buff_player",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "You self-reserve yourself and return to the bench!", params: []}
        },
        statuses: [
            {id: "self_reserve_status", chance: 9999, duration: 3},
            {id: "self_reserve_status_empowered", chance: 9999, duration: 3, empowered: true},
        ],
        willpower: {
            empowerable: true,
            threshold: 0.5,
            drain: 0.3,
        },
        special: {
            sweatGain: 0.4,
            healing: 0.15,
            healingPerLevel: 0.05,
            sweatRemoval: 0.25,
        }
    },
    consumable_skill_pepper_spray: {
        base: "base_no_dmg",
        name: "Pepper Spray",
        id: "consumable_skill_pepper_spray",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "You spray pepper spray on {0}!", params: ["target"]}
        },
        statuses: [
            {id: "pepper_spray_stun", chance: 0.7, duration: 2},
        ],
    },
    enemy_push: {
        base: "base_attack",
        name: "Push",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} shoves you away, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_bite: {
        base: "base_attack",
        name: "Bite",
        behaviour: "attack",
        dmg: {
            mult: 1.1,
            range: 0.15,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} bites you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_spit: {
        base: "base_attack",
        name: "Spit",
        behaviour: "attack",
        dmg: {
            range: 0.2,
            mult: 0.9,
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} spits at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_charged_punch: {
        base: "base_attack",
        name: "Charged Punch",
        behaviour: "attack",
        isChargedSkill: true,
        dmg: {
            range: 0.2,
            mult: 1.4,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} releases a charged punch at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        special: {
            chargeUpText: "{0} is preparing a strong punch!",
            chargeTime: 1,
        }
    },
    enemy_toughen_up: {
        base: "base_attack",
        name: "Toughen Up",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} toughens up!", params: ["user"]}
        },
        statuses: [
            {id: "increased_defenses", chance: 1, duration: 2},
        ],
    },
    enemy_smoke_blunt: {
        base: "base_no_dmg",
        name: "Smoke Blunt",
        behaviour: "attack",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} smokes a blunt and regains {1} health!", params: ["user", "heal"]}
        },
        heal: {
            percentAmount: 0.2,
        }
    },
    enemy_slash_knife: {
        base: "base_attack",
        name: "Slash Knife",
        behaviour: "attack",
        dmg: {
            range: 0.3,
            mult: 0.9,
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} slashes his fancy knife at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_act_edgy: {
        base: "base_attack",
        name: "Act Edgy",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} gives you an ominous look...", params: ["user"]}
        },
        statuses: [
            {id: "increased_damage", chance: 1, duration: 3},
        ],
    },
    enemy_throw_shelf_product: {
        base: "base_attack",
        name: "Throw Shelf Products",
        behaviour: "attack",
        dmg: {
            range: 0.3,
            dmgMult: 0.9,
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} throws a shelf product at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_purse_swing: {
        base: "base_attack",
        name: "Purse Swing",
        behaviour: "attack",
        dmg: {
            range: 0.3,
            dmgMult: 0.9,
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} swings their purse at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_call_manager: {
        base: "base_attack",
        name: "Call Manager",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} calls the store manager! Her anger grows!", params: ["user"]}
        },
        statuses: [
            {id: "increased_damage", chance: 1, duration: 3},
        ],
    },
    enemy_shopping_cart_bash: {
        base: "base_attack",
        name: "Shopping Cart Bash",
        behaviour: "attack",
        dmg: {
            range: 0.5,
            dmgMult: 1.5,
            acc: 1.1,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} bashes their shooping cart at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "stun", chance: 0.7, duration: 1},
        ],
    },
    enemy_eat_doughnut: {
        base: "base_no_dmg",
        name: "Eat Doughnut",
        behaviour: "attack",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} eats a doughnut and regains {1} health!", params: ["user", "heal"]}
        },
        heal: {
            percentAmount: 0.2,
        }
    },
    enemy_baton_bash: {
        base: "base_attack",
        name: "Push",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} bonks you with their baton, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_taze: {
        base: "base_attack",
        name: "Tazer Taze",
        behaviour: "attack",
        dmg: {
            range: 0.25,
            dmgMult: 0.6,
            acc: 1.1,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} tazes you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "stun", chance: 0.8, duration: 1},
        ],
    },
    enemy_look_menacing: {
        base: "base_no_dmg",
        name: "Menacing Look",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "The sight of {0} menaces you...", params: ["user"]}
        },
        statuses: [
            {id: "afraid", chance: 1, duration: 2},
        ],
    },
    enemy_fall_over: {
        base: "base_attack",
        name: "Fall Over",
        behaviour: "attack",
        target: "self",
        dmg: {
            range: 0.1,
            dmgMult: 0.5,
            acc: 9999,
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} falls over, taking {1} damage!", params: ["user", "dmg"]}
        },
    },
    enemy_sharp_edges: {
        base: "base_attack",
        name: "Sharp Edges",
        behaviour: "attack",
        dmg: {
            range: 0.2,
            dmgMult: 1.5,
            acc: 9999,
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "You touch {0}'s sharp edges and receive {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "bleeding", chance: 0.7, duration: 2},
        ],
    },
    phantom_slash: {
        base: "base_attack",
        name: "Phantom Slash",
        behaviour: "attack",
        dmg: {
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} slashes with his ethereal sword, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    weakening_scream: {
        base: "base_attack",
        name: "Weakening Scream",
        behaviour: "attack",
        dmg: {
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} shouts a weakening scream, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "weakened", chance: 0.9, duration: 2},
        ],
    },
    twohander_slash: {
        base: "base_attack",
        name: "2Hander Slash",
        behaviour: "attack",
        dmg: {
            range: 0.1,
            mult: 1.1,
            acc: 0.8,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} ruthlessly swings its 2hander into you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    twohander_power_slash: {
        base: "base_attack",
        name: "2Hander Power Slash",
        behaviour: "attack",
        isChargedSkill: true,
        dmg: {
            range: 0.2,
            mult: 1.4,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} does a power-slash, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "stun", chance: 0.7, duration: 1,}
        ],
        special: {
            chargeUpText: "{0} is charging up a power slash!",
            chargeTime: 1,
        }
    },
    ancient_shout: {
        base: "base_attack",
        name: "Ancient Shout",
        behaviour: "attack",
        dmg: {
            mult: 0.3,
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} shouts in an ancient language, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "disarmed", chance: 1, duration: 1,}
        ],
    },
    dragon_bite: {
        base: "base_attack",
        name: "Dragon Bite",
        behaviour: "attack",
        dmg: {
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} bites you for {1} damage!", params: ["user", "dmg"]}
        },
    },
    dragon_flamethrower: {
        base: "base_attack",
        name: "Dragon Flamethrower",
        behaviour: "attack",
        dmg: {
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} sprays fire at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "burning", chance: 0.9, duration: 3,}
        ],
    },
    dragon_fly: {
        base: "base_attack",
        name: "Dragon Flight",
        behaviour: "attack",
        target: "self",
        dmg: {
            range: 0.1,
            dmgMult: 0.4,
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} tries to take off, but hits the ceiling, taking {1} damage!", params: ["user", "dmg"]}
        },
    },
    mudcrab_pinch: {
        base: "base_attack",
        name: "Mudcrab Pinch",
        behaviour: "attack",
        dmg: {
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} pinches you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "demotivated", chance: 0.9, duration: 3,}
        ],
    },
    crab_dance: {
        base: "base_attack",
        name: "Crab Dance",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} dances around you!", params: ["user"]}
        },
        statuses: [
            {id: "increased_damage", chance: 1, duration: 3},
        ],
    },
    generic_dialogue: {
        base: "base_no_dmg",
        name: "Generic Dialogue",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} starts a generic dialogue about his quest's objective!", params: ["user"]}
        },
        statuses: [
            {id: "bored", chance: 1.2, duration: 2},
        ],
    },
    persuasion_check: {
        base: "base_no_dmg",
        name: "Persuasion Check",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} initiates a persuasion check!", params: ["user"]}
        },
        statuses: [
            {id: "persuasion_check", chance: 1.1, duration: 2},
        ],
    },
    sudden_hostility: {
        base: "base_attack",
        name: "Sudden Hostility",
        behaviour: "attack",
        dmg: {
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} suddenly becomes hostile and attacks, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    channel_frost: {
        base: "base_attack",
        name: "Channel Frost",
        behaviour: "attack",
        dmg: {
            dmgMult: 0.8,
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} channels a stream of frost into you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "chilled", chance: 0.9, duration: 2,}
        ],
    },
    charge_ice_shard: {
        base: "base_attack",
        name: "Charged Ice Shard",
        behaviour: "attack",
        isChargedSkill: true,
        dmg: {
            range: 0.5,
            mult: 2.7,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0}'s masterfully-crafted ice shard pierces deep into you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        special: {
            chargeUpText: "{0} is charging up his ice shard spell!",
            chargeTime: 1,
        }
    },
    ward: {
        base: "base_no_dmg",
        name: "Ward",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} conjures his ward!", params: ["user"]}
        },
        statuses: [
            {id: "increased_defenses", chance: 1, duration: 1},
        ],
    },
    slime_pounce: {
        base: "base_attack",
        name: "Slime Pounce",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} pounces on you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "slimed", chance: 1, duration: 3},
        ],
    },
    split_in_half: {
        base: "base_attack",
        name: "HUMANOID SPLITTER",
        behaviour: "attack",
        dmg: {
            dodgeable: false,
            mult: 2.7,
            range: 0.5,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} splits you in fucking half, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    slam: {
        base: "base_attack",
        name: "Slime Slam",
        behaviour: "attack",
        dmg: {
            mult: 1.5,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} slams onto you, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "slimed", chance: 1, duration: 3},
        ],
    },
    slash: {
        base: "base_attack",
        name: "Sword Slash",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} slashes at you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    bandit_strong_attack: {
        base: "base_attack",
        name: "Strong Attack",
        behaviour: "attack",
        isChargedSkill: true,
        dmg: {
            range: 0.2,
            mult: 1.4,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} does a powerful swing, dealing {1} damage!", params: ["user", "dmg"]}
        },
        statuses: [
            {id: "disarmed", chance: 1, duration: 1,}
        ],
        special: {
            chargeUpText: "{0} is charging up a heavy hit!",
            chargeTime: 1,
        }
    },
    insult: {
        base: "base_no_dmg",
        name: "Insult",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} insults you!", params: ["user"]}
        },
        statuses: [
            {id: "insulted", chance: 1.2, duration: 3},
        ],
        ooc: true,
    },
    maul: {
        base: "base_attack",
        name: "Maul",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} mauls you, dealing {1} damage!", params: ["user", "dmg"]}
        },
    },
    eat_honey: {
        base: "base_no_dmg",
        name: "Eat Honey",
        behaviour: "attack",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} eats some honey and regains {1} health!", params: ["user", "heal"]}
        },
        heal: {
            percentAmount: 0.2,
        }
    },
    confusing_interface: {
        base: "base_no_dmg",
        name: "Confusing Interface",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} brings up a confusing interface!", params: ["user"]}
        },
        statuses: [
            {id: "confused", chance: 1.3, duration: 2},
        ],
    },
    accidental_sell: {
        base: "base_no_dmg",
        name: "Accidental Sell",
        behaviour: "attack",
        target: "enemy",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} brings up a confusing interface!", params: ["user"]}
        },
        statuses: [
            {id: "accidentally_sold_weapon", chance: 1.2, duration: 2},
        ],
    },
    offensive_deal: {
        base: "base_attack",
        name: "Offensive Deal",
        behaviour: "attack",
        dmg: {
            dodgeable: false,
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0}'s deal offends you so much that you take {1} damage!", params: ["user", "dmg"]}
        },
    },
    drink_concoction: {
        base: "base_no_dmg",
        name: "Drink Concoction",
        behaviour: "attack",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} drinks some concoction and regains {1} health!", params: ["user", "heal"]}
        },
        heal: {
            percentAmount: 0.15,
        }
    },
    protective_sign: {
        base: "base_attack",
        name: "Protective Sign",
        behaviour: "self_buff",
        target: "self",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} places a protective sign upon himself!", params: ["user"]}
        },
        statuses: [
            {id: "increased_defenses", chance: 1, duration: 1},
        ],
    },
    dodge_spam: {
        base: "base_no_dmg",
        name: "Dodge Spam",
        behaviour: "attack",
        target: "self",
        dmg: {
            dodgeable: false, // is this needed?
        },
        log: {
            autoLogDmg: false,
            use: {msg: "{0} starts spamming dodges!", params: ["user"]}
        },
        statuses: [
            {id: "massive_evasion", chance: 1, duration: 1},
        ],
    },
    swift_attacks: {
        base: "base_attack",
        name: "Swift Slashes",
        behaviour: "attack",
        log: {
            autoLogDmg: false,
            use: {msg: "{0} performs a swift combo on you, dealing {0} damage!", params: ["user", "dmg"]}
        },
    },
}

export const statuses = {
    base: {
        name: "",
        id: "base",
        base: null,
        behaviour: "genericStatus",
        positive: false,
        manipulatable: true,
        isStun: false,
        soccerMove: null,
        isEmpowered: false,
        log: {
            enemy: {
                apply: {msg: "{0} is {1}!", params: ["target", "status"]},
                // failed: {msg: "{0} failed to apply", params: ["effect"]},
                failed: null,
                ticked: null,
                expired: null,
            },
            player: {
                apply: {msg: "You're {0}!", params: ["status"]},
                // failed: {msg: "{0} failed to apply", params: ["effect"]},
                failed: null,
                ticked: null,
                expired: null,
            }
        },
        statMods: _.cloneDeep(emptyStatSheet),
        // {
        //     definitionLevel: 0,
        //     baseHp: 0,
        //     hpMult: 0,
        //     baseDmg: 0,
        //     dmgMult: 0,
        //     baseAcc: 0,
        //     baseDodge: 0,
        //     baseBlock: 0,
        //     xpReward: 0,
        //     defense: 0,
        //     critChance: 0,
        //     critMult: 0,
        //     wpGen: 0,
        //     turnWp: 0,
        //     statusResistance: 0,
        // },
        ooc: false,
        freezeOOC: false,
        dot: null,
        stacking: {
            maxStacks: 1,
            refreshDurationOnStackLoss: false,
            refreshDurationOnStackGain: false,
            multiInstance: false,
        },
        flags: [],
    },
    tinderbow_burn: {
        name: "Tinderfire",
        id: "tinderbow_burn",
        base: "base",
        behaviour: "genericStatus",
        log: {
            enemy: {
                apply: {msg: "{0} is on fire!", params: ["target"]},
                failed: {msg: "Failed to set {0} on fire!", params: ["target"]},
                ticked: {msg: "{0} took {1} damage from fire!", params: ["target", "dmg"]}
            }
        },
        stacking: {
            maxStacks: 5,
        },
        dot: {
            mult: 0.15,
            range: 0.1,
            acc: 1,
            dodgeable: false,
            type: "default",
        }
    },
    nerfed: {
        name: "Nerfed",
        id: "nerfed",
        base: "base",
        behaviour: "genericStatus",
        log: {
            enemy: {
                apply: {msg: "{0} is nerfed!", params: ["target"]},
            }
        },
        statMods: {
            hpMult: -0.05,
            dmgMult: -0.1,
            baseAcc: -0.1,
            defense: -0.1,
        },
        stacking: {
            maxStacks: 9999,
            refreshDurationOnStackLoss: true,
        },
    },
    player_shield: {
        name: "Shielding",
        id: "player_shield",
        base: "base",
        behaviour: "genericStatus",
        positive: true,
        log: {
            player: {
                expired: {msg: "You're no longer shielding.", params: []},
            }
        },
        statMods: {
            defense: 0.45,
        },
        stacking: {
            maxStacks: 1,
        },
    },
    player_shield_empowered: {
        name: "Shielding (Empowered)",
        id: "player_shield_empowered",
        base: "base",
        behaviour: "genericStatus",
        positive: true,
        isEmpowered: true,
        log: {
            player: {
                expired: {msg: "You're no longer shielding.", params: []},
            }
        },
        statMods: {
            defense: 0.75,
        },
        stacking: {
            maxStacks: 1,
        },
    },
    penalty_kick_status: {
        name: "Shattered Defenses",
        id: "penalty_kick_status",
        base: "base",
        behaviour: "penaltyKickStatus",
        soccerMove: "penalty_kick",
        log: {
            enemy: {
                apply: {msg: "{0}'s defenses are shattered!", params: ["target"]},
            }
        },
        statMods: {
            defense: -0.5,
        },
        special: {
            bonusDefenseReductionPerLevel: -0.1,
            durationBonusAtLevel3: 1,
        }
    },
    penalty_kick_status_empowered: {
        name: "Empowered Shattered Defenses",
        id: "penalty_kick_status_empowered",
        base: "base",
        behaviour: "penaltyKickStatus",
        soccerMove: "penalty_kick",
        isEmpowered: true,
        log: {
            enemy: {
                apply: {msg: "{0}'s defenses are shattered!", params: ["target"]},
            }
        },
        statMods: {
            defense: -0.6,
        },
        special: {
            bonusDefenseReductionPerLevel: -0.1,
            durationBonusAtLevel3: 1,
        }
    },
    feign_injury_status: {
        name: "Red Card",
        id: "feign_injury_status",
        base: "base",
        behaviour: "feignInjuryStatus",
        soccerMove: "feign_injury",
        isStun: true,
        log: {
            enemy: {
                apply: {msg: "A judge appears and gives {0} a red card!", params: ["target"]},
                failed: {msg: "But nobody came.", params: []},
            }
        },
        special: {
            bonusSuccessChancePerLevel: 0.1, // +10% success chance per upgrade level
            bonusExtraDurationTreshold: 3, // +turn duration at level 3
        }
    },
    feign_injury_status_empowered: {
        name: "Redder Card",
        id: "feign_injury_status_empowered",
        base: "base",
        behaviour: "feignInjuryStatus",
        soccerMove: "feign_injury",
        isStun: true,
        isEmpowered: true,
        log: {
            enemy: {
                apply: {msg: "A judge appears and gives {0} a redder card!", params: ["target"]},
                failed: {msg: "But nobody came.", params: []},
            }
        },
        special: {
            bonusSuccessChancePerLevel: 0.1, // +10% success chance per upgrade level
            bonusExtraDurationTreshold: 3, // +turn duration at level 3
        }
    },
    self_reserve_status: {
        name: "Self-Reserving",
        id: "self_reserve_status",
        base: "base",
        behaviour: "self_reserve",
        soccerMove: "self_reserve",
        log: {
            player: {
                apply: {msg: "", params: []},
            }
        },
        statMods: {
            dmgMult: 0.2,
        },
        special: {
        }
    },
    self_reserve_status_empowered: {
        name: "Self-Reserving (Empowered)",
        id: "self_reserve_status_empowered",
        base: "base",
        behaviour: "self_reserve",
        soccerMove: "self_reserve",
        isEmpowered: true,
        log: {
            player: {apply: {msg: "", params: []},}
        },
        statMods: {
            defense: 0.2,
            dmgMult: 0.2,
        },
        special: {
        }
    },
    monocles_of_duality_status_positive: {
        name: "Positively Precise",
        id: "monocles_of_duality_status_positive",
        base: "base",
        behaviour: "genericStatus",
        positive: true,
        log: {
            player: {
                apply: {msg: "You're positively precise!", params: []},
            }
        },
        statMods: {
            baseAcc: 0.1,
        },
        stacking: {
            maxStacks: 5,
            refreshDurationOnStackGain: true,
        }
    },
    monocles_of_duality_status_negative: {
        name: "Negatively Precise",
        id: "monocles_of_duality_status_negative",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're negatively precise!", params: []},
            }
        },
        statMods: {
            baseAcc: -0.1,
        },
        stacking: {
            maxStacks: 5,
            refreshDurationOnStackGain: true,
        }
    },
    bottled_glass_status_positive: {
        name: "Bottled Glass Boost",
        id: "bottled_glass_status_positive",
        base: "base",
        behaviour: "bottled_glass_status",
        positive: true, // should this not count as positive? so it cannot be consumed
        log: {
            player: {
                apply: {msg: "You're feeling BERSERK-EY!", params: []},
            }
        },
        statMods: {
            dmgMult: +0.3,
        },
        stacking: {
            maxStacks: 9999,
            refreshDurationOnStackGain: true,
        },
        ooc: true,
    },
    bottled_glass_status_negative: {
        name: "Bottled Glass Penalty",
        id: "bottled_glass_status_negative",
        base: "base",
        behaviour: "genericStatus",
        manipulatable: false,
        log: {
            player: {
                apply: {msg: "Your health deteriorates...", params: []},
            }
        },
        statMods: {
            hpMult: -0.05,
        },
        stacking: {
            maxStacks: 9999,
            refreshDurationOnStackGain: true,
            refreshDurationOnStackLoss: true,
        },
        ooc: true,
    },
    pepper_spray_stun: {
        name: "Pepper Spray'd",
        id: "pepper_spray_stun",
        base: "base",
        behaviour: "genericStatus",
        isStun: true,
        log: {
            enemy: {
                apply: {msg: "{0} is stunned by the pepper spray!", params: ["target"]},
                failed: {msg: "But {0} closed their eyes in time!", params: ["target"]},
            }
        },
    },
    increased_defenses: {
        name: "Increased Defenses",
        id: "increased_defenses",
        base: "base",
        behaviour: "genericStatus",
        positive: true,
        log: {
            enemy: {
                apply: {msg: "{0}'s defenses are increased!", params: ["target"]},
            }
        },
        statMods: {
            defense: 0.4,
        },
    },
    increased_damage: {
        name: "Increased Damage",
        id: "increased_damage",
        base: "base",
        behaviour: "genericStatus",
        positive: true,
        log: {
            enemy: {
                apply: {msg: "{0}'s damage increases!", params: ["target"]},
            }
        },
        statMods: {
            dmgMult: 0.15,
        },
        stacking: {
            maxStacks: 5,
        }
    },
    afraid: {
        name: "Afraid",
        id: "afraid",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're afraid!", params: []}
            },
            enemy: {
                apply: {msg: "{0} is afraid!", params: ["target"]},
            }
        },
        statMods: {
            dmgMult: -0.3,
            defense: -0.5,
            baseDodge: -0.2,
        },
    },
    massive_evasion: {
        name: "Dodge Spamming",
        id: "massive_evasion",
        base: "base",
        behaviour: "genericStatus",
        log: {
        },
        statMods: {
            baseDodge: 0.6,
        },
    },
    bleeding: {
        name: "Bleeding",
        id: "bleeding",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're bleeding!", params: []},
                ticked: {msg: "You took {0} damage from bleeding!", params: ["dmg"]}
            },
            enemy: {
                apply: {msg: "{0} is bleeding!", params: ["target"]},
                ticked: {msg: "{0} took {1} damage from bleeding!", params: ["target", "dmg"]}
            }
        },
        stacking: {
            maxStacks: 5,
        },
        dot: {
            mult: 0.15,
            range: 0.1,
            acc: 1,
            dodgeable: false,
            type: "default",
        }
    },
    burning: {
        name: "Burning",
        id: "burning",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're on fire!", params: []},
                ticked: {msg: "You took {0} damage from burning!", params: ["dmg"]}
            },
            enemy: {
                apply: {msg: "{0} is on fire!", params: ["target"]},
                ticked: {msg: "{0} took {1} damage from burning!", params: ["target", "dmg"]}
            }
        },
        stacking: {
            maxStacks: 5,
        },
        dot: {
            mult: 0.15,
            range: 0.1,
            acc: 1,
            dodgeable: false,
            type: "default",
        }
    },
    chilled: {
        name: "Chilled",
        id: "chilled",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're chilled!", params: []}
            },
            enemy: {
                apply: {msg: "{0} is chilled!", params: ["target"]},
            }
        },
        statMods: {
            dmgMult: -0.2,
            defense: -0.1,
            baseDodge: -0.5,
        },
    },
    weakened: {
        name: "Weakened",
        id: "weakened",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're weakened!", params: []}
            },
            enemy: {
                apply: {msg: "{0} is weakened!", params: ["target"]},
            }
        },
        statMods: {
            dmgMult: -0.3,
            defense: -0.3,
            statusResistance: -0.2,
        },
    },
    disarmed: {
        name: "Disarmed",
        id: "disarmed",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're disarmed!", params: []}
            },
            enemy: {
                apply: {msg: "{0} is disarmed!", params: ["target"]},
            }
        },
        flags: ["disarmed"]
    },
    accidentally_sold_weapon: {
        name: "Weapon Accidentally Sold",
        id: "accidentally_sold_weapon",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You accidentally sold your weapon!", params: []},
                expired: {msg: "You managed to buy your weapon back!", params: []},
            },
        },
        flags: ["disarmed"]
    },
    persuasion_check: {
        name: "Persuasion Check Failed",
        id: "persuasion_check",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You failed the persuasion check!", params: []},
                failed: {msg: "You passed the persuasion check!", params: []}
            },
            enemy: {
                apply: {msg: "{0} failed the persuasion check!", params: ["target"]},
                failed: {msg: "{0} passed the persuasion check!", params: ["target"]}
            }
        },
        statMods: {
            dmgMult: -0.2,
            defense: -0.1,
            baseDodge: -0.1,
            baseAcc: -0.3,
            critChance: -9999,
            wpGen: -0.2,
            statusResistance: -0.1,
        },
    },
    confused: {
        name: "Confused",
        id: "confused",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're confused!", params: []},
                expired: {msg: "You're no longer confused!", params: []},
            },
        },
        statMods: {
            selfDmg: 0.4,
        },
    },
    bored: {
        name: "Bored",
        id: "bored",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're bored...", params: []}
            },
        },
        statMods: {
            wpGen: -0.7,
            turnWp: -0.15,
            statusResistance: -0.25,
        },
    },
    demotivated: {
        name: "Demotivated",
        id: "demotivated",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're demotivated...", params: []}
            },
        },
        statMods: {
            wpGen: -0.4,
            turnWp: -0.1,
            statusResistance: -0.1,
        },
    },
    stun: {
        name: "Stunned",
        id: "stun",
        base: "base",
        behaviour: "genericStatus",
        isStun: true,
        log: {
            enemy: {
                apply: {msg: "{0} is stunned!", params: []}
            },
            player: {
                apply: {msg: "You're stunned!", params: []}
            },
        },
        statMods: {
        },
    },
    slimed: {
        name: "Slimed",
        id: "slimed",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're slimy!", params: []}
            },
        },
        statMods: {
            wpGen: -0.1,
            turnWp: -0.1,
            statusResistance: -0.1,
            defense: -0.1,
        },
        stacking: {
            maxStacks: 5,
        }
    },
    insulted: {
        name: "Insulted",
        id: "insulted",
        base: "base",
        behaviour: "genericStatus",
        log: {
            player: {
                apply: {msg: "You're offended!", params: []}
            },
        },
        statMods: {
            dmgMult: 0.2,
            turnWp: -0.1,
            statusResistance: -0.1,
            defense: -0.1,
            baseAcc: -0.3,
        },
        stacking: {
            maxStacks: 5,
        }
    },
    mental_gymnastics: {
        name: "Mentally Outplayed",
        id: "mental_gymnastics",
        base: "base",
        behaviour: "mental_gymnastics",
        log: {
            enemy: {
                apply: {msg: "", params: []}
            },
        },
        statMods: {
        },
    },
}

export const dmg_dict = entityData.dmg_dict;
export const resist_dict = entityData.resist_dict;
export const entityBases = entityData.entityBases;
export const streetEntities = entityData.streetEntities;
export const marketEntities = entityData.marketEntities;
export const templeEntities = entityData.templeEntities;

export const entities = {
    player: {
        name: "Player",
        description: "It's you!",
        id: "player",
        skills: [

        ],
        baseStats: entityBases.stats.player,
        growth: entityBases.growth.player,
        drops: [],
    },
    testing_dummy: {
        name: "Testing Dummy",
        description: "It's not you!",
        id: "testing_dummy",
        skills: [
            {id: "test_attack", weight: 20}
        ],
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: drops.debug,
    },
    ...entityData.streetEntities,
    ...entityData.marketEntities,
    ...entityData.templeEntities,
    ...entityData.forestEntities,
}

export const shoes = {
    // "t1"
    cardboard: {
        name: "Cardboard Shoes",
        icon: images.shoes["cardboard.gif"],
        legProtection: 0.1,
        modifiers: [
            {id: "reinforced", quality: 0.2},
        ],
    },
    baguette: {
        name: "Baguette Shoes",
        icon: images.shoes["baguette.gif"],
        legProtection: 0.1,
        modifiers: [
            {id: "chunky", quality: 0.2},
        ],
    },
    plastic_bag: {
        name: "Plastic Bag Shoes",
        icon: images.shoes["plastic_bag.gif"],
        legProtection: 0.1,
        modifiers: [
            {id: "memorable", quality: 0.2},
        ],
    },
    // t2
    crocs: {
        name: "Crocs",
        icon: images.shoes["crocs.gif"],
        legProtection: 0.25,
        modifiers: [
            {id: "stealing", quality: 0.35},
        ],
    },
    tinfoil: {
        name: "Tinfoil Shoes",
        icon: images.shoes["tin_foil.gif"],
        legProtection: 0.25,
        modifiers: [
            {id: "defense", quality: 0.35},
        ],
    },
    fish_flops: {
        name: "Fish Flops",
        icon: images.shoes["fish_flops.gif"],
        legProtection: 0.25,
        modifiers: [
            {id: "motivational", quality: 0.35},
        ],
    },
    // t3
    espardanyes: {
        name: "Espardanyes",
        icon: images.shoes["espardanyes.gif"],
        legProtection: 0.40,
        modifiers: [
            {id: "accurate", quality: 0.50},
        ],
    },
    sandals: {
        name: "Sandals",
        icon: images.shoes["sandals.gif"],
        legProtection: 0.40,
        modifiers: [
            // {id: "motivational", quality: 0.50},
        ],
    },
    high_heels: { // should have a penalty, maybe dodge?
        name: "High Heels",
        icon: images.shoes["high_heels.gif"],
        legProtection: 0.40,
        modifiers: [
            {id: "spiked", quality: 0.50},
        ],
    },
    // t4
    sandals_with_socks: {
        name: "Sandals with Socks",
        icon: images.shoes["sandals_with_socks.gif"],
        legProtection: 0.55,
        modifiers: [
            {id: "evasion", quality: 0.65},
        ],
    },
    hard_rubber: {
        name: "Hard Rubber Shoes",
        icon: images.shoes["hard_rubber.gif"],
        legProtection: 0.55,
        modifiers: [
            {id: "sweatMult", quality: 0.65},
        ],
    },
    climbing: {
        name: "Climbing Shoes",
        icon: images.shoes["climbing.gif"],
        legProtection: 0.55,
        modifiers: [
            {id: "crit", quality: 0.65},
        ],
    },
}

export const modifiers = {
    // prefixes: {
        chunky: {
            name: "Chunky",
            prefix: "Chunky",
            suffix: "of Chungus",
            description: "Increases maximum health by {0}",
            statMods: {
                baseHp: {
                    min: 3,
                    max: 20,
                }
            }
        },
        evasion: {
            name: "Aerodynamic",
            prefix: "Aerodynamic",
            suffix: "of Aerodynamics",
            description: "Increases dodge chance by {0}%",
            statMods: {
                baseDodge: {
                    min: 0.03,
                    max: 0.15,
                    percentage: true,
                }
            }
        },
        accurate: {
            name: "Accurate",
            prefix: "Accurate",
            suffix: "of Accuracy",
            description: "Increases accuracy by {0}%",
            statMods: {
                baseDodge: {
                    min: 0.05,
                    max: 0.45,
                    percentage: true,
                }
            }
        },
        reinforced: {
            name: "Reinforced",
            prefix: "Reinforced",
            suffix: "of Reinforcement",
            description: "Increases defense by {0}%, and decreases damage by {1}%",
            statMods: {
                defense: {
                    min: 0.05,
                    max: 0.15,
                    percentage: true,
                },
                dmgMult: {
                    negative: true,
                    min: -0.15,
                    max: -0.05,
                    step: 0.05,
                    percentage: true,
                }
            }
        },
        memorable: {
            name: "Memorable",
            prefix: "Memorable",
            suffix: "of Memorabilia",
            description: "Increases Willpower Allowance by {0}",
            statMods: {
                turnWp: {
                    min: 0.05,
                    max: 0.20,
                    percentage: true,
                }
            },
        },
        motivational: {
            name: "Motivational",
            prefix: "Motivational",
            suffix: "of Motivation",
            description: "Increases Willpower Generation by {0}%",
            statMods: {
                wpGen: {
                    min: 0.05,
                    max: 0.30,
                    percentage: true,
                }
            }
        },
        stealing: {
            name: "Pilfer's",
            prefix: "Pilfer's",
            suffix: "of Pilfering",
            description: "Increases drop chances by {0}%",
            statMods: {
                magicFind: {
                    min: 0.03,
                    max: 0.35,
                    percentage: true,
                }
            }
        },
        defense: {
            name: "All-Terrain",
            prefix: "All-Terrain",
            suffix: "of All-Terrain",
            description: "Increases defense by {0}%",
            statMods: {
                defense: {
                    min: 0.02,
                    max: 0.20,
                    percentage: true,
                }
            }
        },
        spiked: {
            name: "Spiky",
            prefix: "Spiky",
            suffix: "of Sharp Edges",
            description: "Increases base damage by {0}",
            statMods: {
                baseDmg: {
                    min: 1,
                    max: 10,
                    step: 0.5,
                }
            }
        },
        crit: {
            name: "Successful",
            prefix: "Successful",
            suffix: "of Success",
            description: "Increases critical chance by {0}%",
            statMods: {
                baseDmg: {
                    min: 0.02,
                    max: 0.15,
                    percentage: true,
                }
            }
        },
        sweatMult: {
            name: "Insulated",
            prefix: "Insulated",
            suffix: "of Insulation",
            description: "Decreases Sweat gains by {0}%",
            statMods: {
                sweatMult: {
                    min: 0.05,
                    max: 0.15,
                    percentage: true,
                }
            }
        },
        // craft-only
        comfy: {
            name: "Comfy",
            prefix: "Comfy",
            suffix: "of Comfort",
            description: "Increases out-of-combat health restoration by {0}",
            statMods: {
                oocHealing: {
                    min: 1,
                    max: 15,
                },
            }
        },
        resilient: {
            name: "Resilient",
            prefix: "Resilient",
            suffix: "of Resilience",
            description: "Decreases manipulation by {0}%",
            statMods: {
                statusResistance: {
                    min: 0.05,
                    max: 0.40,
                    step: 0.05,
                    percentage: true,
                },
            }
        },
        faithful: {
            name: "Faithful",
            prefix: "Faithful",
            suffix: "of Faith",
            description: "Increases religious damage by {0}%",
            statMods: {
                dmg_religious: {
                    min: 0.15,
                    max: 0.75,
                    step: 0.05,
                    percentage: true,
                },
            }
        },
        consistency: {
            name: "Consistent",
            prefix: "Consistent",
            suffix: "of Consistency",
            description: "Decreases damage variance of your hits by 5% (additive). Not stackable.",
            statMods: {
            },
            flags: [
                "reducedDamageVariance"
            ]
        },
        insight: {
            name: "Insightful",
            prefix: "Insightful",
            suffix: "of Insight",
            description: "Gives 5 Willpower whenever you damage an enemy. Unaffected by Willpower Generation. Not stackable.",
            statMods: {
            },
            flags: [
                "willpowerOnHit"
            ]
        },
        torment: {
            name: "Tormentful",
            prefix: "Tormentful",
            suffix: "of Torment",
            description: "Increases damage by 20% when hitting enemies affected by any status. Not stackable.",
            statMods: {
            },
            flags: [
                "torment"
            ]
        },
    // },
    // suffixes: {
        // resilience: {
        //     name: "of Resilience",
        //     type: "suffix",
        //     description: "Decreases manipulation by {0}",
        //     statMods: {
        //         statusResistance: {
        //             min: 5,
        //             max: 40,
        //             step: 5,
        //         }
        //     }
        // },
    // }
}

export const recipes = {
    comfy: {
        id: "comfy",
        ingredients: [
            "chunky",
            "chunky",
        ]
    },
    resilient: {
        id: "resilient",
        ingredients: [
            "defense",
            "reinforced",
        ]
    },
    faithful: {
        id: "faithful",
        ingredients: [
            "defense",
            "reinforced",
        ]
    },
    consistency: {
        id: "consistency",
        ingredients: [
            "accurate",
            "evasion",
        ]
    },
    insight: {
        id: "insight",
        ingredients: [
            "motivational",
            "memorable",
        ]
    },
    torment: {
        id: "torment",
        ingredients: [
            "crit",
            "spiked"
        ]
    }
}

// add all shoes to debug drop table
for (let x in shoes) {
    drops.debug.push({
        type: "shoe",
        id: x,
        chance: 0.05,
    })
}