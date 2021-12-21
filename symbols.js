
class Symbols {

	_symbols = [
		{
			name: "window",			
			time: Date.now(),
			selector: "window",
			element: window,

		}
	]

	_last = 0

	get last() {
		return this._symbols[this._last]
	}


	byname(name) {
		for (var symbol of this._symbols) {
			if (symbol.name === name) {
				symbol.time = Date.now()
				return symbol
			}
		}
		throw new Error(`Cannot find symbol matching: '${name}'`)
	}

	exists(func) {
		return this._symbols.some(func)
	}

	add(symbol) {
		symbol.time = Date.now()
		var len  = this._symbols.length + 1
		this._symbols.push(symbol)
		this._last = len
	}

	waitfor(root, selector) {
	    return new Promise(resolve => {
	        if (root.querySelector(selector)) {
	            return resolve(root.querySelector(selector));
	        }

	        const observer = new MutationObserver(mutations => {
	            if (root.querySelector(selector)) {
	                resolve(root.querySelector(selector));
	                observer.disconnect();
	            }
	        });

	        observer.observe(document.body, {
	            childList: true,
	            subtree: true
	        });
	    });
	}

}

export default Symbols