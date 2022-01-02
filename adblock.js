/* Listen for modal adverts and autoclose them */


/* Not used - css implementation used instead */

/* function __adblock(root, selector) {
	var selector = "div[class^='container'] > div[class^='modal'] > div[data-dialog-name='gopro'][class^='dialog'] > button[class^='close']"

    const observer = new MutationObserver(mutations => {
    	var button = root.querySelector(selector)
        if (button) {
            button.click();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
} */


/* export { adblock } */


