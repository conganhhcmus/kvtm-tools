const { SellSlotList, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require("./constants");
const { calc_Y } = require("./helpers");

//#region private function
const _Move = (client, pointA, pointB, steps = 1) => {
    const distance_x = Math.abs(pointA.x - pointB.x) / steps;
    const distance_y = Math.abs(pointA.y - pointB.y) / steps;

    client.touchMove(pointA.x, pointA.y);
    client.sleep(5);
    for (let i = 0; i < steps; i++) {
        if (pointA.x <= pointB.x && pointA.y <= pointB.y) {
            client.touchMove(pointA.x + i * distance_x, pointA.y + i * distance_y).sleep(5);
        } else if (pointA.x >= pointB.x && pointA.y <= pointB.y) {
            client.touchMove(pointA.x - i * distance_x, pointA.y + i * distance_y).sleep(5);
        } else if (pointA.x <= pointB.x && pointA.y >= pointB.y) {
            client.touchMove(pointA.x + i * distance_x, pointA.y - i * distance_y).sleep(5);
        } else {
            client.touchMove(pointA.x - i * distance_x, pointA.y - i * distance_y).sleep(5);
        }
    }
};

const _sellBySlot = (client, calc, slots = [], option = 1) => {
    const [calc_X, calc_Y] = calc;
    const { x: option_x, y: option_y } = SellOptions[option];

    slots.forEach((slot) => {
        const { x, y } = SellSlotList[slot];
        client
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(option_x), calc_Y(option_y))
            .sleep(500)
            .tap(calc_X(70), calc_Y(130))
            .sleep(500)
            .tap(calc_X(660), calc_Y(270))
            .sleep(500)
            .tap(calc_X(590), calc_Y(410))
            .sleep(500)
            .tap(calc_X(400), calc_Y(420))
            .sleep(500)
            .tap(calc_X(500), calc_Y(35))
            .sleep(500);
    });
};

const _plantBySlot = (client, calc, slot) => {
    const [calc_X, calc_Y] = calc;
    const { x, y } = PlantSlotList[slot];

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5)

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5);

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _Move(client, { x: calc_X(FirstRowSlotList[i].x), y: calc_Y(FirstRowSlotList[i].y) }, { x: calc_X(FirstRowSlotList[i + 1].x), y: calc_Y(FirstRowSlotList[i + 1].y) }, 5);
    }

    _Move(client, { x: calc_X(FirstRowSlotList.slice(-1).x), y: calc_Y(FirstRowSlotList.slice(-1).y) }, { x: calc_X(SecondRowSlotList[0].x), y: calc_Y(SecondRowSlotList[0].y) }, 5);

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
        _Move(client, { x: calc_X(SecondRowSlotList[i].x), y: calc_Y(SecondRowSlotList[i].y) }, { x: calc_X(SecondRowSlotList[i + 1].x), y: calc_Y(SecondRowSlotList[i + 1].y) }, 5);
    }

    client.touchUp(calc_X(SecondRowSlotList[SecondRowSlotList.length - 1].x), calc_Y(SecondRowSlotList[SecondRowSlotList.length - 1].y)).sleep(500);
};

const _makeGoodsBySlot = (client, calc, slot = 0, number = 1) => {
    const [calc_X, calc_Y] = calc;
    const { x, y } = MakeSlotList[slot];
    const [produce_x, produce_y] = DefaultProduct;

    for (let i = 0; i < number; i++) {
        client.touchDown(x, y).sleep(5);
        _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(produce_x), y: calc_Y(produce_y) }, 5);
        client.touchUp(produce_x, produce_y).sleep(500);
    }
};
//#endregion

const Sleep = (device, sec = 1, callback = null) => {
    device.client.sleep(sec * 1000, () => {
        callback && callback();
    });
};

const GoDownLast = (device, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();

    GoUp(device);
    device.client
        .multi()
        .tap(calc_X(405), calc_Y(430))
        .sleep(1 * 1000)
        .execute((err) => {
            callback && callback();
        });
}

const GoDown = (device, number = 1, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();

    for (let i = 0; i < number; i++) {
        device.client
            .multi()
            .touchDown(calc_X(730), calc_Y(300))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(280))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(260))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(240))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(220))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(200))
            .sleep(5)
            .touchUp(calc_X(730), calc_Y(200))
            .sleep(500)
            .execute((err) => {
                callback && callback();
            });
    }
};

const GoUp = (device, number = 1, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();

    for (let i = 0; i < number; i++) {
        device.client
            .multi()
            .touchDown(calc_X(730), calc_Y(200))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(220))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(240))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(260))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(280))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(300))
            .sleep(5)
            .touchUp(calc_X(730), calc_Y(300))
            .sleep(500)
            .execute((err) => {
                callback && callback();
            });
    }
};

const OpenGame = (device, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();
    var client = device.client.multi();

    client
        .press("KEYCODE_APP_SWITCH")
        .sleep(500)
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5);
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10);
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500);
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5);
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10);
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500);
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5);
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10);
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500);

    // open game
    client.press("KEYCODE_HOME")
        .sleep(1 * 1000)
        .tap(calc_X(750), calc_Y(288))
        .sleep(15 * 1000)
        .tap(calc_X(80), calc_Y(510))
        .sleep(15 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .tap(calc_X(470), calc_Y(325))
        .sleep(2 * 1000)
        .execute((err) => {
            callback && callback();
        });
};

const HarvestTrees = (device, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();
    const [x, y] = DefaultBasket;

    var client = device.client.multi();

    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000);

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5);

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5);

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _Move(client, { x: calc_X(FirstRowSlotList[i].x), y: calc_Y(FirstRowSlotList[i].y) }, { x: calc_X(FirstRowSlotList[i + 1].x), y: calc_Y(FirstRowSlotList[i + 1].y) }, 5);
    }

    _Move(client, { x: calc_X(FirstRowSlotList.slice(-1).x), y: calc_Y(FirstRowSlotList.slice(-1).y) }, { x: calc_X(SecondRowSlotList[0].x), y: calc_Y(SecondRowSlotList[0].y) }, 5);

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
        _Move(client, { x: calc_X(SecondRowSlotList[i].x), y: calc_Y(SecondRowSlotList[i].y) }, { x: calc_X(SecondRowSlotList[i + 1].x), y: calc_Y(SecondRowSlotList[i + 1].y) }, 5);
    }

    client.touchUp(calc_X(SecondRowSlotList[SecondRowSlotList.length - 1].x), calc_Y(SecondRowSlotList[SecondRowSlotList.length - 1].y)).sleep(500);

    client.execute((err) => {
        callback && callback();
    });
};

const BackToGame = (device, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();

    device.client
        .multi()
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .tap(calc_X(470), calc_Y(325))
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
};

const PlantTrees = (device, slot = 0, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();

    var client = device.client.multi();
    // open
    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000);

    _plantBySlot(client, [calc_X, calc_Y], slot);

    // close
    client.execute((err) => {
        callback && callback();
    });
};

const MakeGoods = (device, slot = 0, number = 1, callback = null) => {
    var client = device.client.multi();
    const [calc_X, calc_Y] = device.Calculator();

    // open
    for (let i = 0; i < 10; i++) {
        client.tap(calc_X(175), calc_Y(410)).sleep(200);
    }

    client.sleep(1.5 * 1000);

    // make goods
    _makeGoodsBySlot(client, [calc_X, calc_Y], slot, number);

    // fix & close
    client
        .tap(calc_X(80), calc_Y(313))
        .sleep(500)
        .tap(calc_X(630), calc_Y(320))
        .sleep(500)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .execute((err) => {
            callback && callback();
        });
};

const SellGoods = (device, slots = [], option = 1, callback = null) => {
    const [calc_X, calc_Y] = device.Calculator();
    var client = device.client.multi();

    // open
    client.tap(555, 340).sleep(1.5 * 1000);

    //sell by slots
    _sellBySlot(client, [calc_X, calc_Y], slots, option);

    // close
    client
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .tap(calc_X(470), calc_Y(325))
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
};

const NextTrees = (device, number = 1, callback = null) => {
    var client = device.client.multi();
    const [calc_X, calc_Y] = device.Calculator();

    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000);

    for (let i = 0; i < number; i++) {
        client.tap(calc_X(325), calc_Y(305)).sleep(500);
    }

    client
        .press("KEYCODE_BACK")
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
}

const PrevTrees = (device, number = 1, callback = null) => {
    var client = device.client.multi();
    const [calc_X, calc_Y] = device.Calculator();

    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000);

    for (let i = 0; i < number; i++) {
        client.tap(calc_X(80), calc_Y(305)).sleep(500);
    }

    client
        .press("KEYCODE_BACK")
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
}

module.exports = {
    Sleep,
    OpenGame,
    MakeGoods,
    SellGoods,
    PlantTrees,
    HarvestTrees,
    GoDown,
    GoUp,
    BackToGame,
    GoDownLast,
    NextTrees,
    PrevTrees,
};
