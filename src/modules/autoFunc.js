const Scripts = require('./scripts')

const OpenGame = (device) => {
    Scripts.OpenGame(device)
}

const ProduceAndSellItems = (device, hasEventTrees) => {
    const NUMBER_OF_MAKE_GOODS = 2 * 10

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        if (hasEventTrees) {
            Scripts.NextTrees(device, 1)
            Scripts.PlantTrees(device, 2)
        } else {
            Scripts.PlantTrees(device, 3)
        }
        Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        hasEventTrees && Scripts.PrevTrees(device, 1)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 2, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)
        Scripts.Sleep(device, 10)
    }

    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
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
    ProduceAndSellItems,
    PlantEventTree,
    Execute,
}
