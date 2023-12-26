const { DefaultSize } = require("./constants");

const calc_X = (x, size) => {
    if (size[0] <= DefaultSize[0]) {
        return x;
    }
    return Math.floor(x * (size[0] / DefaultSize[0]));
}

const calc_Y = (y, size) => {
    if (size[1] <= DefaultSize[0]) {
        return y;
    }
    return Math.floor(y * (size[1] / DefaultSize[1]));
}

const getSize = (sizeText) => {
    if (sizeText.includes("Physical size:")) {
        return sizeText.replace(/[^\d.^x]/g, "").split("x").map(x => parseInt(x));
    }
    return [800, 450];
}

module.exports = {
    calc_X,
    calc_Y,
    getSize,
}