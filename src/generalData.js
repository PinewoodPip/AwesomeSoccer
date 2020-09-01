import * as utils from "./utilities.js"
import * as Game from "./BallGame.js"
const weaponIcons = utils.importAll(require.context('./Assets/Icons/Weapons', false, /\.(gif|jpe?g|svg|png)$/))

export const images = {
    balls: utils.importAll(require.context("./Assets/Balls", false, /\.(gif|jpe?g|svg|png)$/)),
    ui: utils.importAll(require.context("./Assets/UI", false, /\.(gif|jpe?g|svg|png)$/)),
    icons: utils.importAll(require.context("./Assets/Icons", false, /\.(gif|jpe?g|svg|png)$/)),
    artifacts: utils.importAll(require.context("./Assets/Icons/Artifacts", false, /\.(gif|jpe?g|svg|png)$/)),
    weapons: utils.importAll(require.context("./Assets/Icons/Weapons", false, /\.(gif|jpe?g|svg|png)$/)),
}

export const colors = {
    awesomeBlue: {
        name: "Awesome Blue",
        id: "awesomeBlue",
        color: "#add8e6",
        weight: 100,
    },
    calidAugust: {
        name: "Calid August",
        id: "calidAugust",
        color: "#ffffc5",
        weight: 100,
    },
    cardinalTropic: {
        name: "Cardinal Tropic",
        id: "cardinalTropic",
        color: "#7ecfc0",
        weight: 80,
    },
    refuge: {
        name: "Refuge",
        id: "refuge",
        color: "#7957c9",
        weight: 70,
    },
    smellOfMushroom: {
        name: "The Smell of Mushroom",
        id: "smellOfMushroom",
        color: "#ffba92",
        weight: 80,
    },
    distantMemory: {
        name: "Distant Memory",
        id: "distantMemory",
        color: "#d5a4cf",
        weight: 100,
    },
    dated: {
        name: "Dated",
        id: "dated",
        color: "#fffafa",
        weight: 100,
    },
    junglic: {
        name: "Junglic",
        id: "junglic",
        color: "#709078",
        weight: 100,
    },
    pineWoods: {
        name: "The Pine Woods",
        id: "pineWoods",
        color: "#40692e",
        weight: 30,
    },
}

export const balls = {
    classic: {
        name: "Classic Ball",
        id: "classic",
        img: images.balls["ball_future_proof.svg"],
        legBreakMsg: "You broke your leg. Try again.",
        weight: 0,
    },
    vball: {
        name: "Volleyball Ball",
        id: "vball",
        img: images.balls["vballball.gif"],
        legBreakMsg: "You broke your hand. Try again.",
        weight: 100,
    },
    basket: {
        name: "Basketball Ball",
        id: "basket",
        img: images.balls["basketball.gif"],
        legBreakMsg: "You broke your basket. Try again.",
        weight: 100,
    },
    meridia: {
        name: "Meridia's Beacon",
        id: "meridia",
        img: images.balls["meridia.gif"],
        legBreakMsg: "You broke your knee. Try again.",
        weight: 80,
    },
    melee: {
        name: "20XX Ball",
        id: "melee",
        img: images.balls["20XX.gif"],
        legBreakMsg: "You broke your controller. Try again.",
        weight: 80,
    },
    ultron: {
        name: "Ultron Ball",
        id: "ultron",
        img: images.balls["ultron.gif"],
        legBreakMsg: "You broke your pink theme. Try again.",
        weight: 70,
    },
    cookie: {
        name: "Cookie Ball",
        id: "cookie",
        img: images.balls["cookie.gif"],
        legBreakMsg: "You broke your add-on. Try again.",
        weight: 70,
    },
    disco: {
        name: "Disco Ball",
        img: images.balls["disco.gif"],
        legBreakMsg: "You broke your ears. Try again.",
        weight: 70,
    },
    signed: {
        name: "Signed Ball",
        id: "signed",
        img: images.balls["ball_signed.gif"],
        legBreakMsg: "You broke your signature. Try again.",
        weight: 70,
    },
    d20: {
        name: "D20 Ball",
        id: "d20",
        img: images.balls["d20.png"],
        legBreakMsg: "You broke your dice tower. Try again.",
        weight: 70,
    },
}

export const travelAreas = {
    testing: {
        name: "Debug Area",
        id: "testing",
        description: "Your local testing area.",
        levelRange: {
            min: 1,
            max: 50,
        },
        enemies: [
            {id: "testing_dummy", weight: 100},
        ]
    },
}

export const moves = {
    penalty_kick: {
        name: "Penalty Kick",
        id: "penalty_kick",
        description: "A strike which pierces enemy defenses and heavily reduces them for multiple turns.<br>Defense reduction is increased if empowered with Willpower.",
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
        description: "Feign an injury to get the attention of a judge, who may give your enemy a red card, stopping them from playing for a while.<br>Duration of effect is increased if empowered with Willpower.",
        scalingDescription: [
            "+10% success chance per level.",
            "-10% sweat gained per level on use.",
            "At level 3: 35% chance of +1 turn duration.",
        ],
        prices: [1, 1, 1]
    },
}

export const weapons = {
    breakdawner: {
        name: "The Breakdawner",
        id: "breakdawner",
        icon: images.weapons["breakdawner.png"],
        description: "Strikes from The Breakdawner fill you with determination, restoring health based on damage done, along with smiting undead foes harder.<br>Its lifesteal increases with Willpower, but does not consume it.",
        lore: "",
        skillName: "Breakdawner", // shown in combat button (?)
    },
    tinderbow: {
        name: "Tinderbow & Matchsticks",
        id: "tinderbow",
        icon: images.weapons["placeholder.png"],
        description: "The Tinderbow shoots lit matchsticks which ignite your enemy, dealing damage every turn.<br>The burning effect stacks up to 5 times, and all stacks are removed when the effect ends.<br>Deals less damage than your average weapon.",
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
        description: "The Nerfing Gun fires nerfing bolts which weaken targets. The debuff is stackable, but stacks expire after X turns.",
        lore: "",
        skillName: "Nerfing Gun",
    },
    sniper_rifle: {
        name: "Sniper Rifle",
        id: "sniper_rifle",
        icon: images.weapons["placeholder.png"],
        description: "The Sniper Rifle is exceptionally accurate and passively increases your accuracy. However, it's considerably weaker than other weapons.<i>Turns out it's hard to miss when you don't have ammo and opt to bash your enemy with the firearm itself.</i>",
        lore: "<i>Turns out it's hard to miss when you don't have ammo and opt to bash your enemy with the firearm itself.</i>",
        skillName: "Sniper Rifle",
    },
    shield: {
        name: "Shield of Resistance",
        id: "shield",
        icon: images.weapons["placeholder.png"],
        description: "The Shield of Resistance does not deal damage, but instead increases your defense during the next enemy turn by 45%, or 75% if empowered.<br>Additionally, it confers a passive 10% chance to block any attack.",
        lore: "<i>todooo</i>",
        skillName: "Shield of Resistance",
    },
}

export const artifacts = {
    engraved_ring: {
        name: "Engraved Ring of Healing", // Fargoth? more like Faggot LOL
        id: "engraved_ring",
        description: "Heals you when you spend Willpower or win a fight.<br>Increases healing when out of combat by +4% of your maximum HP per second.",
        icon: images.artifacts["temp_ring.png"],
        tuning: {
            victoryHealing: 0.2,
            OOCHealing: 4,
            healingPerWillpower: 0.8, // restore 80% health if you use 100% willpower at once. OP?
        },
    },
    monocles_of_duality: {
        name: "Monocles of Duality",
        id: "monocles_of_duality",
        description: "Increases your chance to deal a critical hit by 10%.<br>Decreases your accuracy by 15% (bad prescription), but your precision is increased by 10% per hit, helping you get more consistent outcomes.",
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
        description: "Your damage increases by X% for each fight completed, but your maximum health decreases by X% of your normal maximum health each turn. Both effects decay outside of combat.",
        icon: images.artifacts["placeholder.png"],
        tuning: {
            buff: "bottled_glass_status_positive",
            debuff: "bottled_glass_status_negative"
        },
    },
    cleansing_talisman: {
        name: "Cleansing Talisman",
        id: "cleansing_talisman",
        description: "When you attack with your weapon, the Cleansing Talisman removes one negative effect from your target to grant you 20% willpower.",
        icon: images.artifacts["placeholder.png"],
        tuning: {
            willpowerGain: 0.2,
        },
    },
    travelling_mug: {
        name: "Travelling Mug",
        id: "travelling_mug",
        description: "Your Willpower capacity is increased to 200%, but your Sweat increases at the start of your turns if your Willpower is below 100%.",
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
        description: "If you're at maximum willpower, your next weapon strike is performed twice in that turn and expends 50% of your maximum willpower.",
        icon: images.artifacts["placeholder.png"],
        tuning: {
            willpowerLoss: 0.5,
            threshold: 1,
        },
    },
}

export const popupButtons = {
    close: {
        text: "CLOSE",
        func: () => {},
    },
    cancel: {
        text: "CANCEL",
        func: () => {},
    },
    excitedClose: {
        text: "REPLACE THIS",
        func: () => {},
    }
}

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
        description: "Gain more Willpower during streaks.<br>+10% Willpower generation per win/loss in streaks of 2+ wins/losses, +5% per level.",
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
}

export const drops = {
    debug: [
        {
            type: "weapon",
            id: "breakdawner",
            chance: 0.05,
        },
        {
            type: "weapon",
            id: "tinderbow",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "engraved_ring",
            chance: 0.05,
        },
        {
            type: "weapon",
            id: "nerfing_gun",
            chance: 0.05,
        },
        {
            type: "weapon",
            id: "sniper_rifle",
            chance: 0.05,
        },
        {
            type: "weapon",
            id: "shield",
            chance: 0.05,
        },
    ]
}

export const skills = {
    base_attack: {
        base: null,
        name: "Base Attack",
        id: "base_attack",
        description: "Description",
        behaviour: "attack",
        isWeaponSkill: false,
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
        }
    },
    test_attack: {
        base: "base_attack",
        name: "Test Attack",
        id: "test_attack",
        behaviour: "attack",
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
            dmgBonus: 0.3
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
            type: "holy",
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
            mult: 0.6,
            range: 0.1,
            acc: 0.9,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            dmgBonus: 0.4
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
            dmgBonus: 0.4
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
            mult: 0.6,
            range: 0.1,
            acc: 1.5,
            dodgeable: true,
            type: "default",
        },
        willpower: {
            dmgBonus: 0.4
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
        base: "base_attack",
        name: "Feign Injury",
        id: "feign_injury",
        behaviour: "feign_injury",
        log: {
            autoLogDmg: false,
            use: {msg: "You feign an injury!", params: []}
        },
        statuses: [
            {id: "feign_injury_status", chance: 0.4, duration: 2},
            {id: "feign_injury_status_empowered", chance: 0.7, duration: 2, empowered: true},
        ],
        willpower: {
            empowerable: true,
            threshold: 0.5,
            drain: 0.3,
            dmgBonus: 1,
        },
        special: {
            sweatGain: 0.7,
            bonusSuccessChancePerLevel: 0.1, // +10% success chance per upgrade level
            bonusSweatReductionPerLevel: 0.1,
            bonusExtraDurationTreshold: 3, // +turn duration at level 3
        }
    },
}

export const statuses = {
    base: {
        name: "",
        id: "base",
        base: null,
        behaviour: "genericStatus",
        positive: false,
        isStun: false,
        soccerMove: null,
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
        statMods: {
            definitionLevel: 0,
            baseHp: 0,
            hpMult: 0,
            baseDmg: 0,
            dmgMult: 0,
            baseAcc: 0,
            baseDodge: 0,
            baseBlock: 0,
            xpReward: 0,
            defense: 0,
            critChance: 0,
            critMult: 0,
        },
        ooc: false,
        freezeOOC: false,
        dot: null,
        stacking: {
            maxStacks: 1,
            refreshDurationOnStackLoss: false,
            refreshDurationOnStackGain: false,
            multiInstance: false,
        }
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
                apply: {msg: "A judge appears and gives {0} as red card!", params: ["target"]},
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
        log: {
            enemy: {
                apply: {msg: "A judge appears and gives {0} as redder card!", params: ["target"]},
                failed: {msg: "But nobody came.", params: []},
            }
        },
        special: {
            bonusSuccessChancePerLevel: 0.1, // +10% success chance per upgrade level
            bonusExtraDurationTreshold: 3, // +turn duration at level 3
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
}

export const entityBases = {
    stats: {
        default: { // used by enemies
            definitionLevel: 1,
            baseHp: 10,
            hpMult: 1,
            baseDmg: 1.8,
            dmgMult: 1,
            baseAcc: 1,
            baseDodge: 0,
            baseBlock: 0,
            xpReward: 5,
            defense: 0,
            critChance: 0,
            critMult: 2,
        },
        player: { // used by player
            definitionLevel: 1,
            baseHp: 20,
            hpMult: 1,
            baseDmg: 2,
            dmgMult: 1,
            baseAcc: 1,
            baseDodge: 0,
            baseBlock: 0,
            xpReward: 0,
            defense: 0,
            critChance: 0,
            critMult: 2,
        },
    },
    growth: {
        enemy: {
            definitionLevel: 0,
            baseHp: 2.5,
            baseDmg: 0.5,
            defense: 0,
            dmgMult: 0,
            hpMult: 0,
            baseAcc: 0,
            baseDodge: 0,
            baseBlock: 0,
            xpReward: 2,
            critChance: 0,
            critMult: 0,
        },
        player: {
            definitionLevel: 0,
            baseHp: 2,
            baseDmg: 0.5,
            defense: 0,
            dmgMult: 0,
            hpMult: 0,
            baseAcc: 0,
            baseDodge: 0,
            baseBlock: 0,
            xpReward: 0,
            critChance: 0,
            critMult: 0,
        },
    }
}

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
}