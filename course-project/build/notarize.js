require('dotenv').config()
const { notarize } = require('electron-notarize')
const fs = require('fs')
const path = require('path')

exports.default = async function notarizing(context) {
	console.log('electron-builder hook: afterSign')
	const { electronPlatformName, appOutDir } = context

	if (electronPlatformName !== 'darwin') {
		console.log('Skipping notarization because this build is not MacOS...')
		return
	}

	const appBundleId = 'com.xenostar.readit' // Same as appId in package.json
	const appPath = path.join(appOutDir, `${context.packager.appInfo.productFilename}.app`)

	// Check if app exists
	if (!fs.existsSync(appPath)) {
		throw new Error(`Cannot find application at: ${appPath}`)
	}

	console.log(
		`Sending Apple the signed build, for them to notarize: ${appBundleId} found at ${appPath}`
	)

	// Attempt notarization
	try {
		await notarize({
			appBundleId,
			appPath,
			appleId: process.env.APPLE_ID,
			appleIdPassword: process.env.APPLE_ID_PASSWORD,
		})
		console.log('Received notarization ticket from Apple')
		console.log('Stapled ticket to the App')
	} catch (error) {
		console.log('App failed to notarize with error:')
		console.error(error)
	}

	console.log(`Done notarizing ${appBundleId}`)
}
