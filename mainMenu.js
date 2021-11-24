module.exports = [
	{
		label: 'Electron',
		submenu: [
			{
				label: 'Item 1',
			},
			{
				label: 'Item 2',
				submenu: [
					{
						label: 'Sub Item 1',
					},
				],
			},
			{
				label: 'Item 3',
			},
			{ label: 'Quit App', role: 'quit' },
		],
	},
	// { role: 'appMenu' },
	// { role: 'fileMenu' },
	{ role: 'editMenu' },
	{ role: 'viewMenu' },
	{ role: 'windowMenu' },
	// {
	// 	label: 'Actions',
	// 	submenu: [
	// 		{ label: 'DevTools', role: 'toggledevtools' },
	// 		{ role: 'togglefullscreen' },
	// 		{ label: 'Action 2', enabled: false },
	// 		{
	// 			label: 'Greet',
	// 			click: () => {
	// 				console.log('Hello from Main Menu')
	// 			},
	// 			accelerator: 'Shift+Alt+G',
	// 		},
	// 	],
	// },
]
