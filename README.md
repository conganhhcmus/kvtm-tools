# Welcome to KVTM Tools!
Hi!

## Install
```sh
npm install
```

## Usage

### Notes:
- The device must be initialized with a length and width ratio of 16:9.
- The size of device must greater than 800x450.

### Start KVTM Tools
```sh
npm run auto
```

### Exclude Devices
Update the **excludeDevices** variable which has list of device IDs in *index.js* to prevent devices from running
```js
const excludeDevices = ['emulator-5554', 'emulator-5556'];
```

### Change Iterations
Update the **frequency** variable in *index.js* to update the number of iterations
```js
const frequency = 1;
```

### Change GameOptions
For detail: 
- **hasEventTrees**: is true if having event trees that can plant
- **resetAfterLoops**: is a number that is used for setup the script runs n times before resetting

```js
const gameOptions = {
    hasEventTrees: true,
    resetAfterLoops: 2,
}
```

### Screenshot
```sh
adb exec-out screencap -p > tmp/{name}.png
```
