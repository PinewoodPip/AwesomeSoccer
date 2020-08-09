import * as utils from "./utilities.js"
import * as Game from "./BallGame.js"
const weaponIcons = utils.importAll(require.context('./Assets/Icons/Weapons', false, /\.(gif|jpe?g|svg|png)$/))

export const images = {
    balls: utils.importAll(require.context("./Assets/Balls", false, /\.(gif|jpe?g|svg|png)$/)),
    ui: utils.importAll(require.context("./Assets/UI", false, /\.(gif|jpe?g|svg|png)$/)),
    icons: utils.importAll(require.context("./Assets/Icons", false, /\.(gif|jpe?g|svg|png)$/)),
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

export const weapons = {
    breakdawner: {
        name: "The Breakdawner",
        id: "breakdawner",
        icon: weaponIcons["breakdawner.png"],
        description: "Strikes from The Breakdawner fill you with determination, restoring health based on damage done, along with smiting undead foes harder.<br>Its lifesteal increases with Willpower, but does not consume it.",
        lore: "",
        skillName: "Breakdawner", // shown in combat button (?)
    },
    tinderbow: {
        name: "Tinderbow & Matchsticks",
        id: "tinderbow",
        icon: weaponIcons["placeholder.png"],
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
        icon: weaponIcons["placeholder.png"],
        description: "The Nerfing Gun fires nerfing bolts which weaken targets. The debuff is stackable, but stacks expire after X turns.",
        lore: "",
        skillName: "Nerfing Gun",
    },
    sniper_rifle: {
        name: "Sniper Rifle",
        id: "sniper_rifle",
        icon: weaponIcons["placeholder.png"],
        description: "The Sniper Rifle is exceptionally accurate and passively increases your accuracy. However, it's considerably weaker than other weapons.<i>Turns out it's hard to miss when you don't have ammo and opt to bash your enemy with the firearm itself.</i>",
        lore: "<i>Turns out it's hard to miss when you don't have ammo and opt to bash your enemy with the firearm itself.</i>",
        skillName: "Sniper Rifle",
    },
    shield: {
        name: "Shield of Resistance",
        id: "shield",
        icon: weaponIcons["placeholder.png"],
        description: "The Shield of Resistance does not deal damage, but instead increases your defense during the next enemy turn by 45%, or 75% if empowered.<br>Additionally, it confers a passive 10% chance to block any attack.",
        lore: "<i>todooo</i>",
        skillName: "Shield of Resistance",
    },
}

export const artifacts = {
    engraved_ring: {
        name: "Engraved Ring of Healing", // Fargoth? more like Faggot LOL
        id: "engraved_ring",
        desc: "Heals you when you spend Willpower or win a fight.<br>Increases healing when out of combat by +4% of your maximum HP per second.",
        icon: "temp_ring.png",
        tuning: {
            victoryHealing: 0.2,
            OOCHealing: 4,
            healingPerWillpower: 0.8, // restore 80% health if you use 100% willpower at once. OP?
        },
    },
}

export const popupButtons = {
    close: {
        text: "CLOSE",
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
        prices: [1, 1, 1, 1],
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
        prices: [1, 1, 1],
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
        }
    },
    breakdawner: {
        base: "base_attack",
        name: "Breakdawner",
        id: "breakdawner",
        behaviour: "player_breakdawner",
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
}

export const statuses = {
    base: {
        name: "",
        id: "base",
        base: null,
        behaviour: "genericStatus",
        positive: false,
        isStun: false,
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
        },
        ooc: false,
        dot: null,
        stacking: {
            maxStacks: 1,
            refreshDurationOnStackLoss: false,
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