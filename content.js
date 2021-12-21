/*** Content ***/
window.addEventListener('load', function() {

	setTimeout(async function() {

		const loggerjsSrc = chrome.runtime.getURL("./lookup.js")
	  	const Lookup = (await import(loggerjsSrc)).Lookup

	  	var url = window.location.href
		var lookup = new Lookup()
		var msg = lookup.strinfo(`Starting at ${url}`)


		/*** Config ***/

		var file = "strategy.pine"

		/*** Create title **/

		await lookup.title(`HVS; v=0.1; strategy=${file};`)

		await lookup.params()

	}, 3000)
})