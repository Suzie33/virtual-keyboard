const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    textarea: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    layoutInd: 0
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.textarea = document.querySelector(".keyboard-input");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Open keyboard on focus
    this.elements.textarea.addEventListener("focus", () => {
      this.open(this.elements.textarea.value, currentValue => {
        this.elements.textarea.value = currentValue;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout1 = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "done",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift",
      "space"
    ];

    const keyLayout = [
      [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "done",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift",
        "space"
      ],
      [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "done",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift",
        "space"
      ]
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout[0].forEach((key, ind) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "done", "enter", "shift"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;
            const left = this.elements.textarea.value.slice(0, cursorPos);
            const right = this.elements.textarea.value.slice(cursorPos);

            this.properties.value = left.substring(0, left.length - 1) + right;
            this._triggerEvent("oninput");
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos - 1;
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            this.elements.textarea.focus();
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("arrow_upward");

          keyElement.addEventListener("click", () => {

            this._toggleShift(keyLayout);
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            this.elements.textarea.focus();
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;
            const left = this.elements.textarea.value.slice(0, cursorPos);
            const right = this.elements.textarea.value.slice(cursorPos);

            this.properties.value = left + "\n" + right;
            this._triggerEvent("oninput");
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + 1;
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;
            const left = this.elements.textarea.value.slice(0, cursorPos);
            const right = this.elements.textarea.value.slice(cursorPos);

            this.properties.value = left + " " + right;
            this._triggerEvent("oninput");
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + 1;
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;
            const left = this.elements.textarea.value.slice(0, cursorPos);
            const right = this.elements.textarea.value.slice(cursorPos);

            if (this.properties.capsLock && !this.properties.shift) {
              this.properties.value =  left + keyLayout[this.properties.layoutInd][ind].toUpperCase() + right;
            } else if (this.properties.capsLock && this.properties.shift) {
              this.properties.value =  left + keyLayout[this.properties.layoutInd][ind].toLowerCase() + right;
            } else if (!this.properties.capsLock && this.properties.shift) {
              this.properties.value =  left + keyLayout[this.properties.layoutInd][ind].toUpperCase() + right;
            } else {
              this.properties.value =  left + keyLayout[this.properties.layoutInd][ind].toLowerCase() + right;
            }

            this._triggerEvent("oninput");
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + 1;
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift && !this.properties.capsLock) { // shift pressed, caps not pressed
          key.textContent = key.textContent.toUpperCase();
        } else if (this.properties.shift && this.properties.capsLock) { // shift pressed, caps pressed
          key.textContent = key.textContent.toLowerCase();
        } else if (!this.properties.shift && this.properties.capsLock) { // shift not pressed, caps pressed
          key.textContent = key.textContent.toUpperCase();
        } else { // shift not pressed, caps not pressed
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
  },

  _toggleShift(kl) {
    this.properties.shift = !this.properties.shift;
    const klEn = kl[0];
    const klShiftEn = kl[1];

    this.elements.keys.forEach((key, i) => {
      if (key.childElementCount === 0) {
        if (this.properties.shift) {
          this.properties.layoutInd = 1;
          key.textContent = klShiftEn[i];
        } else {
          this.properties.layoutInd = 0;
          key.textContent = klEn[i];
        }
      }
    })

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift && !this.properties.capsLock) { // shift pressed, caps not pressed
          key.textContent = key.textContent.toUpperCase();
        } else if (this.properties.shift && this.properties.capsLock) { // shift pressed, caps pressed
          key.textContent = key.textContent.toLowerCase();
        } else if (!this.properties.shift && this.properties.capsLock) { // shift not pressed, caps pressed
          key.textContent = key.textContent.toUpperCase();
        } else { // shift not pressed, caps not pressed
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});