// Modules
const electron = require('electron')
const { app, BrowserWindow, ipcMain, Menu, screen, Tray } = electron
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

// Configuring application menus
let mainMenu = Menu.buildFromTemplate(require('./mainMenu'))
let contextMenu = Menu.buildFromTemplate(require('./contextMenu'))
let trayMenu = Menu.buildFromTemplate(require('./trayMenu'))

const createTray = () => {
	tray = new Tray('trayTemplate@2x.png')
	tray.setToolTip('Tray Details')

	// tray.on('click', e => {
	// 	if (e.shiftKey) {
	// 		app.quit()
	// 	} else {
	// 		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
	// 	}
	// })

	tray.setContextMenu(trayMenu)
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {
	// Primary display information
	let primaryDisplay = screen.getPrimaryDisplay()

	// Creating the tray menu
	createTray()

	// Configuring window State manager
	let mainWindowState = windowStateKeeper({
		defaultWidth: primaryDisplay.bounds.width / 2,
		defaultHeight: primaryDisplay.bounds.height,
	})

	// Configure mainWindow
	mainWindow = new BrowserWindow({
		height: mainWindowState.height,
		width: mainWindowState.width,
		minHeight: 150,
		minWidth: 300,
		x: mainWindowState.x || primaryDisplay.bounds.x,
		y: mainWindowState.y || primaryDisplay.bounds.y,
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

	// Adding context menu to application
	mainWindow.webContents.on('context-menu', e => {
		contextMenu.popup(mainWindow)
	})

	// Tell winState which window to manage
	mainWindowState.manage(mainWindow)

	// Listen for window being closed
	mainWindow.on('closed', () => {
		mainWindow = null
	})

	// Sending information to renderer process
	mainWindow.webContents.on('did-finish-load', e => {
		mainWindow.webContents.send('mailbox', {
			from: 'Bryan',
			email: 'bryan@gmail.com',
			priority: 1,
		})
	})

	// Handle power events from OS
	electron.powerMonitor.on('suspend', e => {
		console.log('Saving some data')
	})

	electron.powerMonitor.on('resume', e => {
		if (!mainWindow) {
			createWindow()
		}
	})
}

ipcMain.on('channel1', (e, args) => {
	console.log(args)
	e.sender.send('channel1-response', 'Message recieved on channel 1. Thank you!')
})

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
