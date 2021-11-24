// Modules
const { app, BrowserWindow, Menu } = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Configuring application menu
let mainMenu = Menu.buildFromTemplate(require('./mainMenu'))

// Create a new BrowserWindow when `app` is ready
function createWindow() {
	// Window State manager
	let winState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800,
	})

	mainWindow = new BrowserWindow({
		height: winState.height,
		minHeight: 150,
		minWidth: 300,
		width: winState.width,
		x: winState.x,
		y: winState.y,
		webPreferences: {
			// --- !! IMPORTANT !! ---
			// Disable 'contextIsolation' to allow 'nodeIntegration'
			// 'contextIsolation' defaults to "true" as from Electron v12
			contextIsolation: false,
			nodeIntegration: true,
		},
	})

	// Load index.html into the new BrowserWindow
	mainWindow.loadFile('index.html')

	// Open DevTools - Remove for PRODUCTION!
	mainWindow.webContents.openDevTools()

	// Adding menu to application
	Menu.setApplicationMenu(mainMenu)

	// Tell winState which window to manage
	winState.manage(mainWindow)

	// Listen for window being closed
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
	if (mainWindow === null) createWindow()
})
