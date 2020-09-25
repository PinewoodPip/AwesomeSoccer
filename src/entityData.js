export const emptyStatSheet = {
    baseHp: 0,
    baseDmg: 0,
    defense: 0,
    dmgMult: 0,
    hpMult: 0,
    baseAcc: 0,
    baseDodge: 0,
    baseBlock: 0,
    xpReward: 0,
    wpGen: 0,
    turnWp: 0,
    sweatMult: 0,
    statusResistance: 0,
    magicFind: 0,
    oocHealing: 0,
    selfDmg: 0, // better keep derpy away from this one
    dmg_religious: 0,
    res_religious: 0,
    critChance: 0,
    critMult: 0,
};

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
        {
            type: "artifact",
            id: "engraved_ring",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "monocles_of_duality",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "bottled_glass",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "cleansing_talisman",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "travelling_mug",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "zeal",
            chance: 0.05,
        },
        {
            type: "consumable",
            id: "water_bottle",
            chance: 0.05,
        },
        {
            type: "consumable",
            id: "towel",
            chance: 0.05,
        },
        {
            type: "consumable",
            id: "pepper_spray",
            chance: 0.05,
        },
    ],
    street: [
        {
            type: "consumable",
            id: "water_bottle",
            chance: 0.05,
        },
        {
            type: "consumable",
            id: "pepper_spray",
            chance: 0.05,
        },
        {
            type: "weapon",
            id: "shield",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "engraved_ring",
            chance: 0.05,
        },
        {
            type: "artifact",
            id: "monocles_of_duality",
            chance: 0.03,
        },
        // t1 and t2 shoes
        {
            type: "shoe",
            id: "cardboard",
            chance: 0.05,
        },
        {
            type: "shoe",
            id: "baguette",
            chance: 0.05,
        },
        {
            type: "shoe",
            id: "plastic_bag",
            chance: 0.05,
        },
        {
            type: "shoe",
            id: "crocs",
            chance: 0.03,
        },
        {
            type: "shoe",
            id: "tinfoil",
            chance: 0.03,
        },
        {
            type: "shoe",
            id: "fish_flops",
            chance: 0.03,
        },
        {type: "weapon", id: "tinderbow", chance: 0.05,},
    ],
    market: [ // also uses street drops
        {
            type: "shoe",
            id: "espardanyes",
            chance: 0.05,
        },
        {
            type: "shoe",
            id: "sandals",
            chance: 0.05,
        },
        {
            type: "shoe",
            id: "high_heels",
            chance: 0.05,
        },
        {type: "weapon", id: "nerfing_gun", chance: 0.05,},
        {type: "weapon", id: "sniper_rifle", chance: 0.05,},
        {type: "artifact", id: "bottled_glass", chance: 0.05,},
        {type: "artifact", id: "realitious_virtuality_binocles", chance: 0.05,},
        {type: "artifact", id: "clipboard", chance: 0.05,},
        {type: "artifact", id: "racing_chair", chance: 0.05,},
    ],
    forest: [
        {type: "shoe", id: "sandals", chance: 0.05,},
        {type: "shoe", id: "sandals_with_socks", chance: 0.05,},
        {type: "shoe", id: "hard_rubber", chance: 0.05,},
        {type: "shoe", id: "climbing", chance: 0.05,},
        {type: "consumable", id: "clarity_nut", chance: 0.05,},
        {type: "artifact", id: "cleansing_talisman", chance: 0.05,},
        {type: "artifact", id: "travelling_mug", chance: 0.05,},
        {type: "artifact", id: "zeal", chance: 0.05,},
        {type: "artifact", id: "chronicle", chance: 0.05,},
    ],
    breakdawner: [
        {type: "weapon", id: "breakdawner", chance: 999,},
    ],
    temple: [
        {type: "shoe", id: "sandals", chance: 0.05,},
        {type: "shoe", id: "sandals_with_socks", chance: 0.05,},
        {type: "shoe", id: "hard_rubber", chance: 0.05,},
        {type: "shoe", id: "climbing", chance: 0.05,},
        {type: "consumable", id: "clarity_nut", chance: 0.05,},
    ]
}

export const dmg_dict = {
    "religious": "dmg_religious"
}

export const resist_dict = {
    "religious": "res_religious"
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
            turnWp: 0,
            wpGen: 0, // willpower gain multiplier
            selfDmg: 0,
            sweatMult: 0,
            statusResistance: 0, // lowers chance of getting a negative status
            magicFind: 0,
            oocHealing: 0,
            dmg_religious: 0,
            res_religious: 0,
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
            turnWp: 0,
            wpGen: 0,
            selfDmg: 0,
            sweatMult: 0,
            statusResistance: 0,
            magicFind: 0,
            oocHealing: 1,
            dmg_religious: 0,
            res_religious: 0,
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
            turnWp: 0,
            wpGen: 0,
            selfDmg: 0,
            sweatMult: 0,
            statusResistance: 0,
            magicFind: 0,
            oocHealing: 0,
            dmg_religious: 0,
            res_religious: 0,
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
            turnWp: 0,
            wpGen: 0,
            selfDmg: 0,
            sweatMult: 0,
            statusResistance: 0,
            magicFind: 0,
            oocHealing: 0,
            dmg_religious: 0,
            res_religious: 0,
        },
    }
}

export const streetEntities = {
    random_dude: {
        name: "Random Dude",
        description: "Some random dude.",
        skills: [
            {id: "enemy_push"},
            {id: "enemy_charged_punch"},
            {id: "enemy_toughen_up", weight: 10},
        ],
        deltaOverride: {
            baseDmg: -0.7,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    random_dog: {
        name: "Random Dog",
        description: "Some random dog.",
        skills: [
            {id: "enemy_bite"},
            {id: "enemy_spit"},
        ],
        deltaOverride: {
            baseDmg: -0.8,
            baseHp: -3,
            baseAcc: -0.1,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    random_dawg: {
        name: "Random Dawg",
        description: "Some random dawg.",
        skills: [
            {id: "enemy_push"},
            {id: "enemy_charged_punch"},
            {id: "enemy_toughen_up", weight: 10},
            {id: "enemy_smoke_blunt"}
        ],
        deltaOverride: {
            xpReward: 2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    emo_kid: {
        name: "Emo Kid",
        description: "The street's edgelord.",
        boss: true,
        skills: [
            {id: "enemy_act_edgy", weight: 15},
            {id: "enemy_slash_knife"},
            {id: "enemy_smoke_blunt", weight: 10}
        ],
        deltaOverride: {
            xpReward: 60,
            baseHp: 60,
            dmgMult: 0.5,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
}

export const marketEntities = {
    random_customer: {
        name: "Random Customer",
        description: "A random customer.",
        skills: [
            {id: "enemy_throw_shelf_product"},
            {id: "enemy_shopping_cart_bash"},
        ],
        deltaOverride: {
            baseAcc: -0.1,
            baseDodge: 0.2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    market_cop: {
        name: "Random Cop",
        description: "A random cop.",
        skills: [
            {id: "enemy_taze", weight: 10},
            {id: "enemy_eat_doughnut", weight: 15},
            {id: "enemy_baton_bash"},
        ],
        deltaOverride: {
            baseAcc: -0.1,
            baseDodge: 0.2,
            dmgMult: 0.4,
            xpReward: 10,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    cardboard_standee: {
        name: "Cardboard Standee",
        description: "A random cardboard standee.",
        skills: [
            {id: "enemy_look_menacing", weight: 15},
            {id: "enemy_fall_over", weight: 10},
            {id: "enemy_sharp_edges"},
        ],
        deltaOverride: {
            dmgMult: -0.4,
            xpReward: -2,
            hpMult: -0.2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    karen: {
        name: "Random Karen",
        description: "A random embodiment of the antichrist.",
        boss: true,
        skills: [
            {id: "enemy_throw_shelf_product", weight: 15},
            {id: "enemy_call_manager", weight: 10},
            {id: "enemy_purse_swing"}
        ],
        deltaOverride: {
            baseHp: 70,
            baseAcc: -0.1,
            baseDodge: 0.1,
            baseBlock: 0.1,
            dmgMult: 0.4,
            xpReward: 70,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
}

export const templeEntities = {
    corrupted_shade: {
        name: "Corrupted Shade",
        description: "Skeletons of a ghostly quality.",
        skills: [
            {id: "phantom_slash"},
            {id: "weakening_scream", weight: 7},
        ],
        deltaOverride: {
            baseAcc: -0.1,
            dmgMult: 0.2,
            baseDodge: 0.4,
            hpMult: -0.4,
            res_religious: -0.3,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    droughted_skeleton: {
        name: "Droughted Skeleton",
        description: "An ancient northern warrior whose sleep was disturbed by your dungeoneering.",
        skills: [
            {id: "twohander_slash"},
            {id: "twohander_power_slash", weight: 12},
            {id: "ancient_shout", weight: 10},
        ],
        deltaOverride: {
            defense: 0.3,
            hpMult: 0.4,
            res_religious: -0.5,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    dragon: {
        name: "Random Dragon",
        description: "TODO",
        skills: [
            {id: "dragon_bite"},
            {id: "dragon_flamethrower", weight: 15},
            {id: "dragon_fly", weight: 10},
        ],
        deltaOverride: {
            defense: 0.3,
            hpMult: 0.7,
            res_religious: -0.3,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    muddy_crab: {
        name: "Muddy Crab",
        description: "You saw one of these the other day. Vile creatures.",
        skills: [
            {id: "mudcrab_pinch"},
            {id: "crab_dance", weight: 12},
        ],
        deltaOverride: {
            defense: 0.4,
            hpMult: 0.1,
            res_religious: -0.3,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    radiant_quest_giver: {
        name: "Radiant Quest Giver",
        description: "Unlike the others, this quest giver radiates genericness and unnoteworthyness. From his voice and his name, it is clear he simply has no experience of value to offer.",
        skills: [
            {id: "generic_dialogue", weight: 14},
            {id: "persuasion_check", weight: 12},
            {id: "sudden_hostility"},
        ],
        deltaOverride: {
            defense: 0.1,
            hpMult: 0.1,
            baseDodge: 0.3,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    malkoran: {
        name: "Malkoran",
        description: "TODO",
        boss: true,
        skills: [
            {id: "charge_ice_shard", weight: 13},
            {id: "ward", weight: 15},
            {id: "channel_frost"},
        ],
        deltaOverride: {
            defense: 0.3,
            hpMult: 1,
            baseDodge: 0.1,
            dmgMult: 0.4,
            res_religious: -0.3,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: drops.breakdawner,
    },
}

export const forestEntities = {
    slime: {
        name: "Slime",
        description: "TODO",
        skills: [
            {id: "slime_pounce"},
            {id: "split_in_half", weight: 7},
            {id: "slam", weight: 15},
        ],
        deltaOverride: {
            hpMult: -0.3,
            baseDodge: 0.1,
            dmgMult: -0.2,
            res_religious: -0.15,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    bandit: {
        name: "Bandit",
        description: "TODO",
        skills: [
            {id: "slash"},
            {id: "insult", weight: 10},
            {id: "bandit_strong_attack", weight: 15},
        ],
        deltaOverride: {
            hpMult: 0.1,
            baseDodge: 0.5,
            dmgMult: -0.1,
            res_religious: -0.15,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    bear: {
        name: "Forest Bear",
        description: "TODO",
        skills: [
            {id: "maul"},
            {id: "eat_honey", weight: 10},
        ],
        deltaOverride: {
            hpMult: 0.8,
            baseDodge: -0.1,
            defense: 0.6,
            dmgMult: 0.2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    travelling_merchant: {
        name: "Travelling Merchant",
        description: "He wants you to see his wares, whatever that means.",
        skills: [
            {id: "offensive_deal"},
            {id: "confusing_interface"},
            {id: "accidental_sell", weight: 10},
        ],
        deltaOverride: {
            hpMult: -0.1,
            baseDodge: 0.4,
            defense: 0.2,
            dmgMult: 0.2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    quest_giver: {
        name: "Quest Giver",
        description: "TODO",
        skills: [
            // {id: "offensive_deal"},
            // {id: "confusing_interface"},
            // {id: "accidental_sell", weight: 10},
        ],
        deltaOverride: {
            hpMult: -0.1,
            baseDodge: 0.4,
            defense: 0.2,
            dmgMult: 0.2,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
    hexer: {
        name: "Hexer",
        description: "TODO",
        boss: true,
        skills: [
            {id: "drink_concoction", weight: 10},
            {id: "protective_sign", weight: 10},
            {id: "dodge_spam", weight: 10},
            {id: "bandit_strong_attack"},
            {id: "swift_attacks", weight: 10},
        ],
        deltaOverride: {
            hpMult: 0.7,
            baseDodge: 0.6,
            defense: 0.4,
            dmgMult: 0.5,
        },
        baseStats: entityBases.stats.default,
        growth: entityBases.growth.enemy,
        drops: [],
    },
}