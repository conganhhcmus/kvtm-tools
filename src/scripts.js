const { SellSlotList, PlantSlotList, MakeSlotList } = require("./constants");

//#region private function
const _sellBySlot = (client, slots = []) => {
    slots.forEach((slot) => {
        const { x, y } = SellSlotList[slot];
        client
            .tap(x, y)
            .sleep(500)
            .tap(x, y)
            .sleep(500)
            .tap(456, 183)
            .sleep(500)
            .tap(75, 155)
            .sleep(500)
            .tap(617, 440)
            .sleep(500)
            .tap(418, 444)
            .sleep(500)
            .tap(523, 75)
            .sleep(500);
    });
};

const _plantBySlot = (client, slot) => {
    const { x, y } = PlantSlotList[slot];
    const distance_x = (309 - x) / 5;
    const distance_y = (398 - y) / 5;

    client
        .touchDown(x, y)
        .sleep(5)
        .touchMove(x + distance_x, y + distance_y)
        .sleep(5)
        .touchMove(x + 2 * distance_x, y + 2 * distance_y)
        .sleep(5)
        .touchMove(x + 3 * distance_x, y + 3 * distance_y)
        .sleep(5)
        .touchMove(x + 4 * distance_x, y + 4 * distance_y)
        .sleep(5)
        // floor 1
        .touchMove(309, 398)
        .sleep(5)
        .touchMove(329, 398)
        .sleep(5)
        .touchMove(349, 398)
        .sleep(5)
        .touchMove(369, 398)
        .sleep(5)
        .touchMove(383, 398)
        .sleep(5)
        .touchMove(403, 398)
        .sleep(5)
        .touchMove(423, 398)
        .sleep(5)
        .touchMove(443, 398)
        .sleep(5)
        .touchMove(451, 398)
        .sleep(5)
        .touchMove(471, 398)
        .sleep(5)
        .touchMove(491, 398)
        .sleep(5)
        .touchMove(511, 398)
        .sleep(5)
        .touchMove(534, 398)
        .sleep(5)
        .touchMove(554, 398)
        .sleep(5)
        .touchMove(574, 398)
        .sleep(5)
        .touchMove(594, 398)
        .sleep(5)
        .touchMove(601, 398)
        .sleep(5)
        .touchMove(621, 398)
        .sleep(5)
        .touchMove(641, 398)
        .sleep(5)
        .touchMove(661, 398)
        .sleep(5)
        .touchMove(681, 398)
        .sleep(5)
        .touchMove(701, 398)
        .sleep(5)
        .touchMove(721, 398)
        .sleep(5)
        // floor 2
        .touchMove(721, 380)
        .sleep(5)
        .touchMove(721, 360)
        .sleep(5)
        .touchMove(721, 340)
        .sleep(5)
        .touchMove(721, 320)
        .sleep(5)
        .touchMove(721, 300)
        .sleep(5)
        .touchMove(721, 280)
        .sleep(5)
        .touchMove(721, 260)
        .sleep(5)
        .touchMove(721, 240)
        .sleep(5)
        .touchMove(721, 220)
        .sleep(5)
        .touchMove(721, 200)
        .sleep(5)
        .touchMove(700, 200)
        .sleep(5)
        .touchMove(680, 200)
        .sleep(5)
        .touchMove(660, 200)
        .sleep(5)
        .touchMove(640, 200)
        .sleep(5)
        .touchMove(620, 200)
        .sleep(5)
        .touchMove(600, 200)
        .sleep(5)
        .touchMove(580, 200)
        .sleep(5)
        .touchMove(560, 200)
        .sleep(5)
        .touchMove(540, 200)
        .sleep(5)
        .touchMove(520, 200)
        .sleep(5)
        .touchMove(500, 200)
        .sleep(5)
        .touchMove(480, 200)
        .sleep(5)
        .touchMove(460, 200)
        .sleep(5)
        .touchMove(440, 200)
        .sleep(5)
        .touchMove(420, 200)
        .sleep(5)
        .touchMove(400, 200)
        .sleep(5)
        .touchMove(380, 200)
        .sleep(5)
        .touchMove(360, 200)
        .sleep(5)
        .touchMove(340, 200)
        .sleep(5)
        .touchMove(320, 200)
        .sleep(5)
        .touchMove(309, 200)
        .sleep(5)
        .touchUp(309, 200)
        .sleep(500);
};

const _makeGoodsBySlot = (client, slot = 0, number = 1) => {
    for (let i = 0; i < number; i++) {
        const { x, y } = MakeSlotList[slot];
        const distance_x = (x - 320) / 6;
        const distance_y = (219 - y) / 6;

        client
            .touchDown(x, y)
            .sleep(5)
            .touchMove(x - distance_x, y + distance_y)
            .sleep(5)
            .touchMove(x - 2 * distance_x, y + 2 * distance_y)
            .sleep(5)
            .touchMove(x - 3 * distance_x, y + 3 * distance_y)
            .sleep(5)
            .touchMove(x - 4 * distance_x, y + 4 * distance_y)
            .sleep(5)
            .touchMove(x - 5 * distance_x, y + 5 * distance_y)
            .sleep(5)
            .touchMove(x - 6 * distance_x, y + 6 * distance_y)
            .sleep(5)
            .touchMove(320, 219)
            .sleep(5)
            .touchUp(320, 219)
            .sleep(500);
    }
};
//#endregion

const Sleep = (client, sec = 1, callback = null) => {
    client.sleep(sec * 1000, () => {
        callback && callback();
    });
};

const GoDownLast = (client, callback = null) => {
    GoUp(client);
    client
        .multi()
        .tap(420, 490)
        .sleep(1 * 1000)
        .execute((err) => {
            callback && callback();
        });
}

const GoDown = (client, number = 1, callback = null) => {
    for (let i = 0; i < number; i++) {
        client
            .multi()
            .touchDown(730, 400)
            .sleep(5)
            .touchMove(730, 380)
            .sleep(5)
            .touchMove(730, 360)
            .sleep(5)
            .touchMove(730, 340)
            .sleep(5)
            .touchMove(730, 320)
            .sleep(5)
            .touchMove(730, 300)
            .sleep(5)
            .touchMove(730, 280)
            .sleep(5)
            .touchMove(730, 260)
            .sleep(5)
            .touchMove(730, 240)
            .sleep(5)
            .touchMove(730, 220)
            .sleep(5)
            .touchMove(730, 200)
            .sleep(5)
            .touchMove(730, 180)
            .sleep(5)
            .touchMove(730, 160)
            .sleep(5)
            .touchMove(730, 140)
            .sleep(5)
            .touchMove(730, 120)
            .sleep(5)
            .touchMove(730, 100)
            .sleep(5)
            .touchUp(730, 100)
            .sleep(500)
            .execute((err) => {
                callback && callback();
            });
    }
};

const GoUp = (client, number = 1, callback = null) => {
    for (let i = 0; i < number; i++) {
        client
            .multi()
            .touchDown(730, 100)
            .sleep(5)
            .touchMove(730, 120)
            .sleep(5)
            .touchMove(730, 140)
            .sleep(5)
            .touchMove(730, 160)
            .sleep(5)
            .touchMove(730, 180)
            .sleep(5)
            .touchMove(730, 200)
            .sleep(5)
            .touchMove(730, 220)
            .sleep(5)
            .touchMove(730, 240)
            .sleep(5)
            .touchMove(730, 260)
            .sleep(5)
            .touchMove(730, 280)
            .sleep(5)
            .touchMove(730, 300)
            .sleep(5)
            .touchMove(730, 320)
            .sleep(5)
            .touchMove(730, 340)
            .sleep(5)
            .touchMove(730, 360)
            .sleep(5)
            .touchMove(730, 380)
            .sleep(5)
            .touchMove(730, 400)
            .sleep(5)
            .touchUp(730, 400)
            .sleep(500)
            .execute((err) => {
                callback && callback();
            });
    }
};

const OpenGame = (client, callback = null) => {
    client
        .multi()
        .press("KEYCODE_APP_SWITCH")
        .sleep(500)
        // swipe
        .touchDown(450, 360)
        .sleep(5)
        .touchMove(450, 310)
        .sleep(5)
        .touchMove(450, 260)
        .sleep(5)
        .touchMove(450, 210)
        .sleep(5)
        .touchMove(450, 160)
        .sleep(5)
        .touchMove(450, 110)
        .sleep(5)
        .touchMove(450, 60)
        .sleep(5)
        .touchUp(450, 60)
        .sleep(500)
        // swipe
        .touchDown(450, 360)
        .sleep(5)
        .touchMove(450, 310)
        .sleep(5)
        .touchMove(450, 260)
        .sleep(5)
        .touchMove(450, 210)
        .sleep(5)
        .touchMove(450, 160)
        .sleep(5)
        .touchMove(450, 110)
        .sleep(5)
        .touchMove(450, 60)
        .sleep(5)
        .touchUp(450, 60)
        .sleep(500)
        // open game
        .press("KEYCODE_HOME")
        .sleep(1 * 1000)
        .tap(781, 350)
        .sleep(15 * 1000)
        .tap(160, 550)
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
        .tap(500, 350)
        .sleep(2 * 1000)
        .execute((err) => {
            callback && callback();
        });
};

const HarvestTrees = (client, callback = null) => {
    client
        .multi()
        .tap(311, 410)
        .sleep(1.5 * 1000)
        // floor 1
        .touchDown(227, 290)
        .sleep(5)
        .touchMove(240, 324)
        .sleep(5)
        .touchMove(255, 348)
        .sleep(5)
        .touchMove(270, 361)
        .sleep(5)
        .touchMove(284, 382)
        .sleep(5)
        .touchMove(309, 398)
        .sleep(5)
        .touchMove(329, 398)
        .sleep(5)
        .touchMove(349, 398)
        .sleep(5)
        .touchMove(369, 398)
        .sleep(5)
        .touchMove(383, 398)
        .sleep(5)
        .touchMove(403, 398)
        .sleep(5)
        .touchMove(423, 398)
        .sleep(5)
        .touchMove(443, 398)
        .sleep(5)
        .touchMove(451, 398)
        .sleep(5)
        .touchMove(471, 398)
        .sleep(5)
        .touchMove(491, 398)
        .sleep(5)
        .touchMove(511, 398)
        .sleep(5)
        .touchMove(534, 398)
        .sleep(5)
        .touchMove(554, 398)
        .sleep(5)
        .touchMove(574, 398)
        .sleep(5)
        .touchMove(594, 398)
        .sleep(5)
        .touchMove(601, 398)
        .sleep(5)
        .touchMove(621, 398)
        .sleep(5)
        .touchMove(641, 398)
        .sleep(5)
        .touchMove(661, 398)
        .sleep(5)
        .touchMove(681, 398)
        .sleep(5)
        .touchMove(701, 398)
        .sleep(5)
        .touchMove(721, 398)
        .sleep(5)
        // floor 2
        .touchMove(721, 380)
        .sleep(5)
        .touchMove(721, 360)
        .sleep(5)
        .touchMove(721, 340)
        .sleep(5)
        .touchMove(721, 320)
        .sleep(5)
        .touchMove(721, 300)
        .sleep(5)
        .touchMove(721, 280)
        .sleep(5)
        .touchMove(721, 260)
        .sleep(5)
        .touchMove(721, 240)
        .sleep(5)
        .touchMove(721, 220)
        .sleep(5)
        .touchMove(721, 200)
        .sleep(5)
        .touchMove(700, 200)
        .sleep(5)
        .touchMove(680, 200)
        .sleep(5)
        .touchMove(660, 200)
        .sleep(5)
        .touchMove(640, 200)
        .sleep(5)
        .touchMove(620, 200)
        .sleep(5)
        .touchMove(600, 200)
        .sleep(5)
        .touchMove(580, 200)
        .sleep(5)
        .touchMove(560, 200)
        .sleep(5)
        .touchMove(540, 200)
        .sleep(5)
        .touchMove(520, 200)
        .sleep(5)
        .touchMove(500, 200)
        .sleep(5)
        .touchMove(480, 200)
        .sleep(5)
        .touchMove(460, 200)
        .sleep(5)
        .touchMove(440, 200)
        .sleep(5)
        .touchMove(420, 200)
        .sleep(5)
        .touchMove(400, 200)
        .sleep(5)
        .touchMove(380, 200)
        .sleep(5)
        .touchMove(360, 200)
        .sleep(5)
        .touchMove(340, 200)
        .sleep(5)
        .touchMove(320, 200)
        .sleep(5)
        .touchMove(309, 200)
        .sleep(5)
        .touchUp(309, 200)
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
};

const BackToGame = (client, callback = null) => {
    client
        .multi()
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .press("KEYCODE_BACK")
        .sleep(100)
        .tap(500, 350)
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
};

const PlantTrees = (client, slot = 1, callback = null) => {
    var tmp_client = client.multi();
    // open
    tmp_client.tap(310, 430).sleep(1.5 * 1000);

    _plantBySlot(tmp_client, slot);

    // close
    tmp_client.execute((err) => {
        callback && callback();
    });
};

const MakeGoods = (client, slot = 0, number = 1, callback = null) => {
    var tmp_client = client.multi();

    // open
    tmp_client
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(200)
        .tap(178, 427)
        .sleep(1.5 * 1000);

    // make goods
    _makeGoodsBySlot(tmp_client, slot, number);

    // fix & close
    tmp_client
        .tap(81, 360)
        .sleep(500)
        .tap(654, 342)
        .sleep(500)
        .press("KEYCODE_BACK")
        .sleep(1 * 1000)
        .execute((err) => {
            callback && callback();
        });
};

const SellGoods = (client, slots = [], callback = null) => {
    var tmp_client = client.multi();

    // open
    tmp_client.tap(555, 340).sleep(1.5 * 1000);

    //sell slot 1,2,5,6
    _sellBySlot(tmp_client, slots);

    // close
    tmp_client
        .press("KEYCODE_BACK")
        .sleep(500)
        .press("KEYCODE_BACK")
        .sleep(500)
        .press("KEYCODE_BACK")
        .sleep(500)
        .tap(500, 350)
        .sleep(500)
        .execute((err) => {
            callback && callback();
        });
};

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
};

// 832x472 (832x520)
