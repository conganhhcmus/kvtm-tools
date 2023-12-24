# Welcome to KVTM Tools!
Hi!

## Install
```sh
npm install
```

## Usage

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

### Screenshot
```sh
adb exec-out screencap -p > assets/{name}.png
```
