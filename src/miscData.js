// import {images} from "./generalData.js"
import React from 'react';
import * as utils from "./utilities.js"

export const images = {
    balls: utils.importAll(require.context("./Assets/Balls", false, /\.(gif|jpe?g|svg|png)$/)),
    ui: utils.importAll(require.context("./Assets/UI", false, /\.(gif|jpe?g|svg|png)$/)),
    icons: utils.importAll(require.context("./Assets/Icons", false, /\.(gif|jpe?g|svg|png)$/)),
    artifacts: utils.importAll(require.context("./Assets/Icons/Artifacts", false, /\.(gif|jpe?g|svg|png)$/)),
    weapons: utils.importAll(require.context("./Assets/Icons/Weapons", false, /\.(gif|jpe?g|svg|png)$/)),
    stats: utils.importAll(require.context("./Assets/Icons/Stats", false, /\.(gif|jpe?g|svg|png)$/)),
    shoes: utils.importAll(require.context("./Assets/Shoes", false, /\.(gif|jpe?g|svg|png)$/)),
}

export const colors = {
    awesomeBlue: {
        name: "Awesome Blue",
        id: "awesomeBlue",
        color: "#add8e6",
        weight: 0,
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
        description: "The classic, timeless soccer ball.",
        icon: images.balls["ball_future_proof.svg"],
        legBreakMsg: "You broke your leg. Try again.",
        weight: 0,
    },
    vball: {
        name: "Volleyball Ball",
        id: "vball",
        description: "The one that gets all the ladies movin' at the beach.",
        icon: images.balls["vballball.gif"],
        legBreakMsg: "You broke your hand. Try again.",
        weight: 100,
    },
    basket: {
        name: "Basketball Ball",
        id: "basket",
        description: "Not recommended for soccer use, but not forbidden.",
        icon: images.balls["basketball.gif"],
        legBreakMsg: "You broke your basket. Try again.",
        weight: 100,
    },
    meridia: {
        name: "Meridia's Beacon",
        id: "meridia",
        description: "The Goddess of Life Energy's mouthpiece, which lied within the ball lootbox for years, waiting for a worthy hero to restore light to her temple.",
        icon: images.balls["meridia.gif"],
        legBreakMsg: "You broke your knee. Try again.",
        weight: 80,
    },
    melee: {
        name: "20XX Ball",
        id: "melee",
        description: "Elegant & elitist, this reflective device represents the prophecies of completely uninvolved people.",
        icon: images.balls["20XX.gif"],
        legBreakMsg: "You broke your controller. Try again.",
        weight: 80,
    },
    ultron: {
        name: "Ultron Ball",
        id: "ultron",
        description: "TODO",
        icon: images.balls["ultron.gif"],
        legBreakMsg: "You broke your pink theme. Try again.",
        weight: 70,
    },
    cookie: {
        name: "Cookie Ball",
        id: "cookie",
        description: "TODO",
        icon: images.balls["cookie.gif"],
        legBreakMsg: "You broke your add-on. Try again.",
        weight: 70,
    },
    disco: {
        name: "Disco Ball",
        id: "disco",
        description: "TODO",
        icon: images.balls["disco.gif"],
        legBreakMsg: "You broke your ears. Try again.",
        weight: 70,
    },
    signed: {
        name: "Signed Ball",
        id: "signed",
        description: "TODO",
        icon: images.balls["ball_signed.gif"],
        legBreakMsg: "You broke your signature. Try again.",
        weight: 70,
    },
    d20: {
        name: "D20 Ball",
        id: "d20",
        description: "TODO",
        icon: images.balls["d20.png"],
        legBreakMsg: "You broke your dice tower. Try again.",
        weight: 70,
    },
}

export const strings = {
    DEFEAT_DESC: [
        "Fate has betrayed you, traveller. But only you can see beyond failure and charge into battle once again.",
        <div>
            <p>'Disconnect with what is and connect with what can be'</p>
            <p>- <i>Shane, The Blacksmith</i></p>
        </div>,
        "It's time to ignore the short-term failures and focus on the long-term goal of glory.",
    ],
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
    tos: {
        text: "I haven't read the ToS but I accept them",
        func: () => {},
    },
    excitedClose: {
        text: [
            "NUTS",
            "EPIC",
            "THAT'S RAD",
            "OK",
            "GOOD",
            "AWESOME",
            "COOL",
        ],
        func: () => {},
    },
    sadClose: {
        text: [
            "DARN",
            "LAME",
            "OH WELL",
            "TOO BAD",
            ":("
        ],
        func: () => {},
    },
    gameOver: {
        text: [
            "DARN",
            "DEFEAT IS BUT A TEMPORARY INCONVENIENCE",
            "I'LL GET EM NEXT TIME",
            "TRIUMPH IS INEVITABLE",
            "GREATNESS AWAITS IN 12th PLACE",
            "NEVER GIVE UP",
        ],
        func: () => {},
    }
}

export const tutorials = {
    combat_intro: {
        title: "SOCCER OFFENSE 101: THE BASICS OF HURTING",
        short_title: "SOCCER OFFENSE 101",
        description: <div>
            <p>Offense is a key part in every soccer player's skillset. Should anyone ever pick on you, know that it's only fair to retaliate in self-defense by kicking your ball at them.</p>
            <p>To really get your point across, be sure to also get a souvenir or two out of their pockets post-combat and use it to make future conflicts easier.</p>
        </div>
    },
    equipment_drop: {
        title: "EQUIPMENT PRIMER",
        short_title: "EQUIPMENT",
        description: <div>
            <p>You obtained a piece of equipment from an enemy. You can equip it from the wardrobe menu.</p>
            <p>Weapons provide you with a secondary form of attack, while Artifacts provide unique conditional powers not found anywhere else. Shoes provide handy bonuses and protect your legs from breaking.</p>
            <p>Keep mugging random people to find more equipment.</p>
        </div>
    },
    soccer_moves: {
        title: "SOCCER OFFENSE 101: THE WILL TO REMAIN",
        short_title: "EQUIPMENT",
        description: <div>
            <p>You just acquired a Soccer Move! Soccer Moves are special situational techniques that let you get an upper hand over the enemy. Each of them has a different effect and induce Sweat when used. If you're too sweaty, you can't use them further.</p>
            <p>Soccer Moves can be empowered with Willpower to drastically increase their effect. Find efficient ways of generating Willpower to make the most out of your Soccer Moves.</p>
        </div>
    },
    shoeforging: {
        title: "SHOEFORGING HELP",
        short_title: "SHOEFORGING",
        description: <div>
            <p>Welcome to the Shoeforge!</p>
            <p>This public facility allows you to create the shoes of your dreams by combining 2 shoes together at a time.</p>
            <p>The second shoe will be sacrificed to imbue the first one with its properties, upgrading them if the base shoe already had them.</p>
            <p>Specific combinations of shoe properties may bestow new unique powers onto the base shoe that cannot be acquired in other ways. Experiment often!</p>
        </div>,
    }
}