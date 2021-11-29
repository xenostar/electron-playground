const { notarize } = require('electron-notarize')

console.log('Notarizing app')

// Default module export
exports.default = async function (context) {
	// Skip notarize if not MacOS
	if (process.platform !== 'darwin') {
		return
	}

	// Get some context vars
	let appName = context.packager.appInfo.productFilename
	let appDir = context.appOutDir

	// Run Notarize
	return await notarize({
		// Must match appId in package.json. Can also include package.json and read it here
		appBundleId: 'com.xenostar.readit',
		appPath: `${appDir}/${appName}.app`,
		appleId: process.env.APPLE_ID,
		appleIdPassword: process.env.APPLE_ID_PASSWORD,
	})
}
