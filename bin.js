#!/usr/bin/env node

const path = require('path/posix')
const { performance } = require('perf_hooks')

// Util
const util = {
	requireUncached: (moduleName) => {
		delete require.cache[require.resolve(moduleName)]
		return require(moduleName)
	},
	starting: (taskName) => {
		console.log(`Starting '${taskName}'...`)
		return performance.now()
	},
	finished: (taskName, start) => {
		let elapsed = Math.round(performance.now() - start)
		elapsed = elapsed >= 1000 ? +(elapsed / 1000).toFixed(2) + ' s' : Math.round(elapsed) + ' ms'
		elapsed = elapsed.toString()
		console.log(`Finished '${taskName}' after ${elapsed}`)
	},
}

// Get data
const dataFile = path.resolve(process.argv[2])
const getData = () => util.requireUncached(dataFile)
let data = Object.entries(getData())

async function runner(src, dst) {
	const vfs = require('vinyl-fs')
	return new Promise((resolve) => {
		vfs.src(src, {buffer: false}).pipe(vfs.dest(dst)).on('finish', resolve)
	})
}

async function run() {
	const start = util.starting('globcopier')
	await Promise.all(data.map(([dst, src]) => runner(src, dst)))
	util.finished('globcopier', start)
}

function watcher() {
	require('chokidar')
		.watch(dataFile, { ignoreInitial: true })
		.on('change', () => {
			setTimeout(async () => {
				data = Object.entries(getData())
				await run()
			}, 200)
		})
		.on('ready', () => console.log('Ready for changes'))
}

void (async () => {
	console.clear()
	if (process.argv[3] === '--watch') {
		watcher()
	} else {
		await run()
	}
})()
