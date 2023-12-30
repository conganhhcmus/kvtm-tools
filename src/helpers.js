const Jimp = require('jimp');
const { cv, cvTranslateError } = require('opencv-wasm');
const { DefaultSize } = require("./constants");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

const getCoordinatesItem = async (deviceId) => {
    try {
        await exec(`adb -s ${deviceId} exec-out screencap -p > ../assets/${deviceId}.png`);
        const imageTemplate = await Jimp.read(__dirname + '/../assets/item.png');
        const imageSource = await Jimp.read(__dirname + `/../assets/${deviceId}.png`);

        let src = cv.matFromImageData(imageSource.bitmap);
        let templ = cv.matFromImageData(imageTemplate.bitmap);
        let processedImage = new cv.Mat();
        let mask = new cv.Mat();

        cv.matchTemplate(src, templ, processedImage, cv.TM_CCOEFF_NORMED, mask);
        cv.threshold(processedImage, processedImage, 0.90, 1, cv.THRESH_BINARY);
        processedImage.convertTo(processedImage, cv.CV_8UC1);

        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        cv.findContours(processedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        if (contours.size() > 0) {
            let countour = contours.get(0).data32S; // Contains the points
            let x = countour[0];
            let y = countour[1];

            let pointA = new cv.Point(x, y);
            let pointB = new cv.Point(x + templ.cols, y + templ.rows);

            return [Math.floor((pointA.x + pointB.x) / 2), Math.floor((pointA.y + pointB.y) / 2)];
        }

        return [70, 130];

    } catch (err) {
        console.log(cvTranslateError(cv, err));
        return [70, 130];
    }
};


module.exports = {
    calc_X,
    calc_Y,
    getSize,
    getCoordinatesItem,
}