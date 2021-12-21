/*** Simulate keyboard events ***/


export default function typetext(txt) {

    function _createKeyboardEvent(charcode) {
        var keyboardEvent = document.createEvent('KeyboardEvent');
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

        return keyboardEvent[initMethod](
          'keydown', // event type: keydown, keyup, keypress
          true, // bubbles
          true, // cancelable
          window, // view: should be window
          false, // ctrlKey
          false, // altKey
          false, // shiftKey
          false, // metaKey
          40, // keyCode: unsigned long - the virtual key code, else 0
          charcode, // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
        );
    }

    for (var i = 0; i++; i < txt.length) {
      var char = txt.getCharCodeAt(i)
      var event = _createKeyboardEvent(i)
      document.dispatchEvent(keyboardEvent);
    }
}
