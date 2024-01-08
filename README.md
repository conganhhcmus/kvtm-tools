# Welcome to Auto Tools!
Hi! I'm Kai. Here are some images of my tools

- Desktop
![desktop view](https://github.com/conganhhcmus/auto-tools/blob/main/desktop.gif)

- Mobile
<img src="https://github.com/conganhhcmus/auto-tools/blob/main/mobile.gif" alt="mobile view" width="400"/>


## Notes:
- The device must be initialized with a length and width ratio of 16:9.
- The size of the device must be greater than 800x450.

## Usage

### Install
```sh
npm install
```
or
```sh
npm ci
```

### Build
```sh
npm run build
```
or
```sh
npm run release
```

### Run Auto Tools
Run the script below, then open your browser with the link http://localhost:8080
```sh
npm run app
```

## Utils
### Screenshot
```sh
adb exec-out screencap -p > {name}.png
```

### Host server
```sh
ngrok http --domain={domain} 8080
```
