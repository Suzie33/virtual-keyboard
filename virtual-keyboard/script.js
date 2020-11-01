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
    layoutInd: 0,
    language: "en",
    sounds: true,
    voice: false
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

    // Setup lighting keys
    this.elements.textarea.addEventListener("keydown", (e) => {
      this._lightButtons(e.keyCode);
    })
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const keyLayout = [
      [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "done",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "arrowLeft", "arrowRight",
        "en","space", "sounds", "voice"
      ],
      [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}", "done",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", "\"", "enter",
        "shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?", "arrowLeft", "arrowRight",
        "en","space", "sounds", "voice"
      ],
      [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "done",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "shift","я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "arrowLeft", "arrowRight",
        "ru","space", "sounds", "voice"
      ],
      [
        "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "done",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "shift","я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "arrowLeft", "arrowRight",
        "ru", "space", "sounds", "voice"
      ]
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout[0].forEach((key, ind) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "done", "enter", "arrowRight"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this._playSound(key);
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
          keyElement.setAttribute('title', 'CapsLock');
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            this._playSound(key);
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            this.elements.textarea.focus();
          });
          this.elements.textarea.addEventListener("keydown", (e) => {
            if (e.keyCode === 20) {
              this._toggleCapsLock();
              keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
              this.elements.textarea.focus();
            }
          })

          break;

        case "shift":
          keyElement.setAttribute('title', 'Shift');
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("arrow_upward");

          keyElement.addEventListener("click", () => {
            this._toggleShift(keyLayout);
            this._playSound(key);
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            this.elements.textarea.focus();
          });
          this.elements.textarea.addEventListener("keydown", (e) => {
            if (e.keyCode === 16) {
              this._toggleShift(keyLayout);
              keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
              this.elements.textarea.focus();
            }
          })

          break;

        case "enter":
          keyElement.setAttribute('title', 'Enter');
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;
            const left = this.elements.textarea.value.slice(0, cursorPos);
            const right = this.elements.textarea.value.slice(cursorPos);

            this.properties.value = left + "\n" + right;
            this._triggerEvent("oninput");
            this._playSound(key);
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
            this._playSound(key);
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + 1;
          });

          break;

        case "done":
          keyElement.setAttribute('title', 'Hide keyboard');
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._playSound(key);
            this._triggerEvent("onclose");
          });

          break;

        case "en":
          keyElement.setAttribute('title', 'en/ru');
          keyElement.classList.add("keyboard__key--wide");
          keyElement.textContent = this.properties.language.toUpperCase();

          keyElement.addEventListener("click", () => {
            // this.properties.shift = false;

            if (this.properties.language === 'en') {
              this.properties.language = 'ru';
            } else {
              this.properties.language = 'en';
            }
  
            this._toggleLang(keyLayout);
            keyElement.textContent = this.properties.language.toUpperCase();

            this._playSound(key);
            this.elements.textarea.focus();
          })

          break;

        case "arrowLeft":
          keyElement.innerHTML = createIconHTML("arrow_back");
          keyElement.classList.add("keyboard__key--green");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;

            this._playSound(key);
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos - 1;
          });
  
          break;

        case "arrowRight":
          keyElement.innerHTML = createIconHTML("arrow_forward");
          keyElement.classList.add("keyboard__key--green");

          keyElement.addEventListener("click", () => {
            let cursorPos = this.elements.textarea.selectionStart;

            this._playSound(key);
            this.elements.textarea.focus();
            this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + 1;
          });

          break;

        case "sounds":
          keyElement.setAttribute('title', 'Keyboard sounds');
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "keyboard__key--active");
          keyElement.innerHTML = createIconHTML("volume_up");

          keyElement.addEventListener("click", () => {
            this.properties.sounds = !this.properties.sounds;
            this._playSound(key);
            keyElement.classList.toggle("keyboard__key--active", this.properties.sounds);
            this.elements.textarea.focus();
          });

          break;

        case "voice":
          keyElement.setAttribute('title', 'Voice recognition');
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_voice");

          keyElement.addEventListener("click", () => {
            this.properties.voice = !this.properties.voice;
            if (this.properties.voice) {
              this._voiceRecognition();
            }
            keyElement.classList.toggle("keyboard__key--active", this.properties.voice);
            this.elements.textarea.focus();
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
            this._playSound(key);
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
    const klRu = kl[2];
    const klShiftRu = kl[3];

    this.elements.keys.forEach((key, i) => {
      if (key.childElementCount === 0) {
        if (this.properties.shift && this.properties.language === 'en') { // en with shift
          this.properties.layoutInd = 1;
          key.textContent = klShiftEn[i];
        } else if (!this.properties.shift && this.properties.language === 'en') { // en without shift
          this.properties.layoutInd = 0;
          key.textContent = klEn[i];
        } else if (this.properties.shift && this.properties.language === 'ru') { // ru with shift
          this.properties.layoutInd = 3;
          key.textContent = klShiftRu[i];
        } else {
          this.properties.layoutInd = 2; //ru without shift
          key.textContent = klRu[i];
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

  _toggleLang(kl) {
    const klEn = kl[0];
    const klShiftEn = kl[1];
    const klRu = kl[2];
    const klShiftRu = kl[3];

    this.elements.keys.forEach((key, i) => {
      if (key.childElementCount === 0) {
        if (this.properties.language === 'en' && !this.properties.shift) {
          this.properties.layoutInd = 0;
          key.textContent = klEn[i];
        } else if (this.properties.language === 'en' && this.properties.shift) {
          this.properties.layoutInd = 1;
          key.textContent = klShiftEn[i];
        } else if (this.properties.language === 'ru' && !this.properties.shift) {
          this.properties.layoutInd = 2;
          key.textContent = klRu[i];
        } else {
          this.properties.layoutInd = 3;
          key.textContent = klShiftRu[i];
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

  _lightButtons(code) {
    const CODES_AND_INDEXES = {
      49: 0,
      50: 1,
      51: 2,
      52: 3,
      53: 4,
      54: 5,
      55: 6,
      56: 7,
      57: 8,
      48: 9,
      8: 10, // 2nd row
      81: 11,
      87: 12,
      69: 13,
      82: 14,
      84: 15,
      89: 16,
      85: 17,
      73: 18,
      79: 19,
      80: 20,
      219: 21,
      221: 22,
      20: 24, // 3rd row
      65: 25,
      83: 26,
      68: 27,
      70: 28,
      71: 29,
      72: 30,
      74: 31,
      75: 32,
      76: 33,
      186: 34,
      222: 35,
      13: 36,
      16: 37, // 4d row
      90: 38,
      88: 39,
      67: 40,
      86: 41,
      66: 42,
      78: 43,
      77: 44,
      188: 45,
      190: 46,
      191: 47,
      37: 48,
      39: 49,
      32: 51
    }
    let keyInd = CODES_AND_INDEXES[code];
    this.elements.keys[keyInd].classList.add("keyboard__key--colored");

    this.elements.textarea.addEventListener("keyup", (e) => {
      if (e.keyCode === code) {
        this.elements.keys[keyInd].classList.remove("keyboard__key--colored");
      }
    })
  },

  _playSound(key) {
    if (!this.properties.sounds) return;

    const audioEn = document.querySelector('.audio_en');
    const audioRu = document.querySelector('.audio_ru');
    const audioEnter = document.querySelector('.audio_enter');
    const audioCaps = document.querySelector('.audio_caps');
    const audioShift = document.querySelector('.audio_shift');
    const audioBackspace = document.querySelector('.audio_back');

    audioRu.currentTime = 0;

    if (key === 'enter') {
      audioEnter.play();
    } else if (key === 'caps') {
      audioCaps.play();
    } else if (key === 'shift') {
      audioShift.play();
    } else if (key === 'backspace') {
      audioBackspace.play();
    } else {
      if (this.properties.language === "en") {
        audioEn.play();
      } else {
        audioRu.play();
      }
    }
  },

  _voiceRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    if (this.properties.language === 'ru') recognition.lang = 'ru';

    recognition.addEventListener('result', e => {
      if (this.properties.voice) {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
  
        if (e.results[0].isFinal) {
          let cursorPos = this.elements.textarea.selectionStart;
          const left = this.elements.textarea.value.slice(0, cursorPos);
          const right = this.elements.textarea.value.slice(cursorPos);
  
          this.properties.value = left + transcript + " " + right;
          this._triggerEvent("oninput");
          this.elements.textarea.selectionStart = this.elements.textarea.selectionEnd = cursorPos + transcript.length + 1;
        }
      }
    })
    
    recognition.addEventListener('end', () => {
      if (this.properties.voice) {
        recognition.start();
      }
    });
    recognition.start();
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
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});