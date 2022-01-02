/*** Content ***/
window.addEventListener('load', function() {

	setTimeout(async function() {

		const lookupjsSrc = chrome.runtime.getURL("./lookup.js")
	  	const Lookup = (await import(lookupjsSrc)).Lookup

	  	const paramsSrc = chrome.runtime.getURL("./params.js")
	  	const params = (await import(paramsSrc)).params

	  	var url = window.location.href
		var lookup = new Lookup()

		/*** Create title **/

		await lookup.title(`HVS; v=0.1; strategy='${params.name}';`)

		await lookup.params()

	}, 3000)
})