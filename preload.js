const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

window.writeToFile = async text => {
	let desktopPath = await ipcRenderer.invoke('app-path')
	console.log(`Writing file to ${desktopPath}...`)
	fs.writeFile(path.join(desktopPath, '/app.txt'), text, console.log)
}

window.versions = {
	node: process.versions.node,
	electron: process.versions.electron,
}
