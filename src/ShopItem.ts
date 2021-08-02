/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Config from "./Config";

export default { getItemPrice };

// base value, hot value, cold value
const items = [
    [14, 14, 14,], // Balloon
    [30, 30, 30,], // Toy
    [7, 7, 8,],    // Map
    [30, 30, 30,], // Photo
    [35, 25, 50,], // Umbrella
    [12, 20, 10,], // Drink
    [19, 19, 22,], // Burger
    [16, 16, 18,], // Chips
    [10, 15, 6,],  // IceCream
    [9, 9, 6,],    // Candyfloss
    [0, 0, 0,],    // EmptyCan
    [0, 0, 0,],    // Rubbish
    [0, 0, 0,],    // EmptyBurgerBox
    [21, 21, 25,], // Pizza
    [0, 0, 0,],    // Voucher
    [13, 13, 11,], // Popcorn
    [17, 17, 20,], // HotDog
    [22, 20, 18,], // Tentacle
    [27, 32, 24,], // Hat
    [10, 10, 10,], // ToffeeApple
    [37, 37, 37,], // TShirt
    [8, 7, 10,],   // Doughnut
    [11, 15, 20,], // Coffee
    [0, 0, 0,],    // EmptyCup
    [19, 19, 22,], // Chicken
    [11, 21, 10,], // Lemonade
    [0, 0, 0,],    // EmptyBox
    [0, 0, 0,],    // EmptyBottle
    [0, 0, 0,],    // 28
    [0, 0, 0,],    // 29
    [0, 0, 0,],    // 30
    [0, 0, 0,],    // Admission
    [30, 30, 30,], // Photo2
    [30, 30, 30,], // Photo3
    [30, 30, 30,], // Photo4
    [11, 11, 11,], // Pretzel
    [13, 13, 20,], // Chocolate
    [10, 20, 10,], // IcedTea
    [13, 11, 14,], // FunnelCake
    [15, 20, 12,], // Sunglasses
    [17, 17, 20,], // BeefNoodles
    [17, 17, 20,], // FriedRiceNoodles
    [13, 13, 15,], // WontonSoup
    [14, 14, 16,], // MeatballSoup
    [11, 19, 11,], // FruitJuice
    [10, 14, 10,], // SoybeanMilk
    [11, 14, 11,], // Sujeonggwa
    [19, 19, 17,], // SubSandwich
    [8, 8, 8,],    // Cookie
    [0, 0, 0,],    // EmptyBowlRed
    [0, 0, 0,],    // EmptyDrinkCarton
    [0, 0, 0,],    // EmptyJuiceCup
    [16, 16, 20,], // RoastSausage
    [0, 0, 0,],    // EmptyBowlBlue
];
items[255] = items[3]; // ride photo

function getItemPrice(item: number) {
    // umbrellas
    if (item === 4) {
        switch (Config.overchargeUmbrellasPolicy.get()) {
            case "when it rains":
                if (!isRaining())
                    break;
            case "always":
                return 200;
        }
    }

    // regular items
    if (climate.current.temperature >= 21)
        return items[item][1];
    if (climate.current.temperature <= 11)
        return items[item][2];
    return items[item][0];
}

function isRaining(): boolean {
    switch (climate.current.weather) {
        case "rain":
        case "heavyRain":
        case "thunder":
            return true;
        default:
            return false;
    }
}
