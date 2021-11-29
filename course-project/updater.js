const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

// Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info' // error, warn, info, verbose, debug, silly

// Disable auto downloading of updates
autoUpdater.autoDownload = false

// Check for and apply any available updates.
module.exports = () => {
	//Check for update from Github Releases
	autoUpdater.checkForUpdates()

	// Listen for update found event
	autoUpdater.on('update-available', () => {
		// Prompt user to start download
		dialog
			.showMessageBox({
				type: 'info',
				title: 'Update available',
				message: 'A new version of Readit is available. Do you want to update now?',
				buttons: ['Update', 'No'],
			})
			.then(result => {
				let buttonIndex = result.response

				// If button 0 (Update), start download
				if (buttonIndex === 0) {
					autoUpdater.downloadUpdate()
				}
			})
	})

	// Listen for update downloade
	autoUpdater.on('update-downloaded', () => {
		// Propt user to install the update
		dialog
			.showMessageBox({
				type: 'info',
				title: 'Update ready',
				message: 'Install and restart now?',
				buttons: ['Yes', 'Later'],
			})
			.then(result => {
				let buttonIndex = result.response

				// If button 0 (Yes), install & restart
				if (buttonIndex === 0) {
					autoUpdater.quitAndInstall(false, true)
				}
			})
	})
}
