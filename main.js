// Modules
const electron = require('electron')
const { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, screen, Tray } = electron
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

const askFruitDialog = async () => {
	let fruits = ['Apple', 'Orange', 'Grape']

	let choice = await dialog.showMessageBox({
		message: 'Pick a fruit',
		buttons: fruits,
	})

	return fruits[choice.response]
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {
	// Writing to clipboard on app ready as an example
	clipboard.writeText('Hello from the main process')

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

	// Crude method to reload crashed app.
	// Don't use in prod app, but good to remember so we can handle it.
	mainWindow.webContents.on('crashed', () => {
		setTimeout(() => {
			mainWindow.reload()
		}, 1000)
	})

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

	// Handle powerMonitor events from OS
	// Note that we need to use the destructered import pattern above in order to
	// use the powerMonitor module. Requiring it directly will cause an error.
	electron.powerMonitor.on('suspend', e => {
		console.log('Saving some data')
	})
	electron.powerMonitor.on('resume', e => {
		if (!mainWindow) {
			createWindow()
		}
	})

	console.log(mainWindow.isVisible())
}

// IPC Examples
ipcMain.on('channel1', (e, args) => {
	console.log(args)
	e.sender.send('channel1-response', 'Message recieved on channel 1. Thank you!')
})
ipcMain.handle('ask-fruit', e => {
	return askFruitDialog()
})
ipcMain.handle('app-path', () => {
	return app.getPath('desktop')
})
ipcMain.handle('notification', () => {
	if (!mainWindow.isVisible()) {
		mainWindow.show()
	}
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
