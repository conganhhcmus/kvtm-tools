const Scripts = require('./base')

const OpenGame = (device) => {
    Scripts.OpenGame(device)
}

// Cao vai do
const ProduceAndSellItems_1 = (device, hasEventTree) => {
    const NUMBER_OF_MAKE_GOODS = 2 * 10

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 2)
        Scripts.MakeGoods(device, 0, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 0, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1) Scripts.Sleep(device, 12)
    }

    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
}

// Cao vai tim
const ProduceAndSellItems_2 = (device, hasEventTree) => {
    const NUMBER_OF_MAKE_GOODS = 2 * 10

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        if (hasEventTree) {
            Scripts.NextTrees(device, 1)
            Scripts.PlantTrees(device, 2)
        } else {
            Scripts.PlantTrees(device, 3)
        }
        Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        hasEventTree && Scripts.PrevTrees(device, 1)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 2, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1) Scripts.Sleep(device, 10)
    }

    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
}

// Cao vai do + nuoc tuyet
const ProduceAndSellItems_3 = (device, hasEventTree) => {
    const NUMBER_OF_MAKE_GOODS = 10

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1 & 2
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
        Scripts.MakeGoods(device, 0, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 0, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)

        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 2)
        Scripts.MakeGoods_2(device, 1, 3)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)

        if (k < NUMBER_OF_MAKE_GOODS - 1) Scripts.Sleep(device, 1)
    }

    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
    //Scripts.SellFullGoods(device, 1)
}

// Cao vai tim + nuoc tuyet
const ProduceAndSellItems_4 = (device, hasEventTree) => {
    const NUMBER_OF_MAKE_GOODS = 10

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        if (hasEventTree) {
            Scripts.NextTrees(device, 1)
            Scripts.PlantTrees(device, 2)
        } else {
            Scripts.PlantTrees(device, 3)
        }
        Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        hasEventTree && Scripts.PrevTrees(device, 1)
        Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
        Scripts.MakeGoods(device, 2, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)

        Scripts.GoUp(device)
        Scripts.MakeGoods_2(device, 1, 3)

        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 0)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)

        // if (k < NUMBER_OF_MAKE_GOODS - 1) Scripts.Sleep(device, 1)
    }

    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
    //Scripts.SellFullGoods(device, 1)
}

const PlantEventTree = (device) => {
    Scripts.GoUp(device)

    for (let j = 0; j < 4; j++) {
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 4)
        Scripts.GoUp(device, 2)
    }

    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 4)
    Scripts.GoDownLast(device)
}

const Execute = (device) => {
    Scripts.Execute(device)
}

module.exports = {
    OpenGame,
    ProduceAndSellItems_1,
    ProduceAndSellItems_2,
    ProduceAndSellItems_3,
    ProduceAndSellItems_4,
    PlantEventTree,
    Execute,
}
