export function getKey(e) {
  var location = e.location;
  var selector;
  if (location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
    selector = ['[data-key="' + e.keyCode + '-R"]'];
  } else {
    var code = e.keyCode || e.which;
    selector = [
      '[data-key="' + code + '"]',
      '[data-char*="' + encodeURIComponent(String.fromCharCode(code)) + '"]',
    ].join(",");
  }
  return document.querySelector(selector);
}

export function pressKey(char) {
  var key = document.querySelector('[data-char*="' + char.toUpperCase() + '"]');
  if (!key) {
    return console.warn("No key for", char);
  }
  key.setAttribute("data-pressed", "on");
  setTimeout(function () {
    key.removeAttribute("data-pressed");
  }, 200);
}

function keydown(e, errorHandler) {
  errorHandler(checkCapsLock(e), detectKeyboardLanguage(e));
  var key = getKey(e);

  if (!key) return console.warn("No key for", e.keyCode);

  key.setAttribute("data-pressed", "on");
}

let fn = null;

function keyup(e) {
  var key = getKey(e);
  key && key.removeAttribute("data-pressed");
}

function checkCapsLock(event) {
  return event.getModifierState("CapsLock");
}

function detectKeyboardLanguage(event) {
  const key = event.key;
  const code = event.code;

  if (code.startsWith("Key"))
    if (/^[a-zA-Z]$/.test(key)) return 0;
    else if (/^[а-яА-ЯЁё]$/.test(key)) return 1;
}

export function init(errorHandler) {
  fn = (e) => keydown(e, errorHandler);
  document.body.addEventListener("keydown", fn);

  document.body.addEventListener("keyup", keyup);
}

export function destr() {
  document.body.removeEventListener("keydown", fn);

  document.body.removeEventListener("keyup", keyup);
}

// function size () {
//    var size = keyboard.parentNode.clientWidth / 90;
//    keyboard.style.fontSize = size + 'px';
//    console.log(size);
// }
//
// var keyboard = document.querySelector('.keyboard');
// window.addEventListener('resize', function (e) {
//    size();
// });
// size();
