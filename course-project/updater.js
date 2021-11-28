const { autoUpdater } = require('electron-updater')

// Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

// Check for and apply any available updates.
module.exports = () => {
	//Check for update (Github Releases)
	autoUpdater.checkForUpdates()
}
