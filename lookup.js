/*** Logger ***/

import Symbols from './symbols.js'

class LoggerLevel {
	static DEBUG = "DEBUG"

	static INFO = "INFO"
	
	static WARN = "WARNING"
	
	static ERR = "ERROR"
}

class Logger {

	get date() {
	    var now = new Date()
	    return now.toISOString()
	}

	strlog(msg, level=LoggerLevel.INFO) {
		var date = this.date
		return `${date}; [${level}]; ${msg}`
	}

	strdebug(msg) {
		var date = this.date
		return `${date}; [${LoggerLevel.DEBUG}]; ${msg}`
	}

	strinfo(msg) {
		var date = this.date
		return `${date}; [${LoggerLevel.INFO}]; ${msg}`
	}

	strwarn(msg) {
		var date = this.date
		return `${date}; [${LoggerLevel.WARN}]; ${msg}`
	}

	strerr(msg) {
		var date = this.date
		return `${date}; [${LoggerLevel.ERROR}]; ${msg}`
	}

}


class Lookup {

	symbols = new Symbols()
	logger = new Logger()

	hvs_otitle_name

	hvs_itextarea_name
	hvs_otextarea_name


	async find(root, selector, name) {

		this.log(`Looking for selector: ${selector} (name=${name})`)

		var element = await this.symbols.waitfor(root, selector)

		this.log(`Found element under selector: ${selector} (name=${name})`)

		var symbol = {
			name: name ? name : selector,
			selector: selector,
			element: element
		}


		if (name) {

			this.symbols.add(symbol)

			this.log(`Added symbol under selector ${selector} (name=${name}) to cache, index=${this.symbols._last}`)

		}

		return symbol

	}

	async ifnotexists(selector, name) {

		name ??= selector

		this.log(`Checking for selector: ${selector} (name=${name})`)

		var symbol = undefined

		if (this.symbols.exists( s => s.name == name)) {

			this.log(`Found cached symbol with selector: ${selector} (name=${name})`)

			symbol = this.symbols.byname(name)
		}
		
		else {

			symbol = await this.find(document, selector, name)

		}

		return symbol
	}

	keyboard(msg) {
		this.log(`Simulating keyboard for text '${msg}'`)
		//_typetext(msg)
	}


	log(msg) {

		var logmsg = this.logger.strinfo(msg)

		if (this.hvs_otextarea_name && this.symbols.exists( s => s.name == this.hvs_otextarea_name)
			&& this.hvs_itextarea_name && this.symbols.exists(s => s.name == this.hvs_itextarea_name)) {

			var hvs_itextarea_symbol = this.symbols.byname(this.hvs_itextarea_name)
			var hvs_otextarea_symbol = this.symbols.byname(this.hvs_otextarea_name)

			hvs_otextarea_symbol.element.innerHTML += logmsg
			hvs_itextarea_symbol.element.value += (logmsg + '\n\n')

		}
		else {
			console.log(logmsg)
		}
	}


	getid(length) {
    	var result = '';
    	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * characters.length));
	   	}
	   	return result;
	}

	async clickif(selector, name, func) {

		name ??= selector
		func ??= () => true

		this.log(`Click if: (selector=${selector} name=${name}, func='${func.toString()}')`)

		var symbol = await this.ifnotexists(selector, name)

		if (func(symbol)) {
			symbol.element.click()
			this.log(`Clicked: (selector=${selector} name=${name})`)
			symbol.element.classList.add("hyperview-red-blink");
		} else {
			this.log(`Skipped click: (selector=${selector} name=${name})`)
		}

		return symbol

	}


	async clickeventif(selector, name, func) {

		name ??= selector
		func ??= () => true

		this.log(`Click if: (selector=${selector} name=${name}, func='${func.toString()}')`)

		var symbol = await this.ifnotexists(selector, name)

		if (func(symbol)) {

			var cevent = new MouseEvent('mousedown', {
			  view: window,
			  bubbles: true,
			  cancelable: true
			});
			
			symbol.element.dispatchEvent(cevent);
			this.log(`Clicked: (selector=${selector} name=${name})`)
			symbol.element.classList.add("hyperview-red-blink");
		} else {
			this.log(`Skipped click: (selector=${selector} name=${name})`)
		}

		return symbol

	}

	async title(text) {

		/* 1. Open text notes and create new note */

		this.clickif('div[data-name="text_notes"]', 'text_notes', symbol => symbol.element.getAttribute("data-active").toLowerCase() !== 'true')

		this.clickif('div.new-note-btn', 'new-note-btn')

		/* 2. Create new innter title and replace input element */

		var hvs_id = this.getid(5)

		var ititle_name = 'hvs_ititle_' + hvs_id

		this.log(`Creating new inner title element (text='${text}', name='${ititle_name}')`)

		var ititle_input_symbol = await this.find(document, '.notes-desc-inner > .title-wrap > input')

		var ititle_elm = document.createElement('div')

		ititle_elm.id = ititle_name
		ititle_elm.classList.add('title')
		ititle_elm.innerHTML = text

		var ititle_symbol = {
			name: ititle_name,
			selector: `#${ititle_name}`,
			element: ititle_elm
		}

		ititle_input_symbol.element.replaceWith(ititle_elm)

		this.symbols.add(ititle_symbol)

		/* 3. Edit text on outer title */

		this.hvs_otitle_name  = 'hvs_otitle_' + hvs_id

		var otitle_symbol = await this.find(document, '#bottom-area div.note.active > div.note-header > div.title', this.hvs_otitle_name)

		otitle_symbol.element.innerHTML = text

		/* 5. Replace inner text area and cache for future use */

		var textarea_to_replace = await this.find(document,'#bottom-area div.notes-desc-inner > textarea')

		var itextarea_elm = document.createElement('textarea')

		this.hvs_itextarea_name = itextarea_elm.id = 'hvs_itextarea_' + hvs_id

		var itextarea_symbol = {
			name: itextarea_elm.id,
			selector: `#${itextarea_elm.id}`,
			element: itextarea_elm
		}

		textarea_to_replace.element.replaceWith(itextarea_elm)

		this.symbols.add(itextarea_symbol)


		/* 6. Lookup and cache outer textarea for future use */

		this.hvs_otextarea_name = 'hvs_otextarea_' + hvs_id

		await this.find(document, '#bottom-area div.note.active > div.note-desc', this.hvs_otextarea_name)

	}

	async params() {
		var srctitle_symbol = await this.clickeventif("body > div.js-rootresizer__contents div[data-name='legend-source-item'] div[data-name='legend-source-title']", 'sources-title')
		var srcsettigs_symbol = await this.find(srctitle_symbol.element.parentNode, "div[data-name='legend-settings-action'][title='Settings']", 'sources-settings')
	}
}

export { ConsoleLogger, Logger }