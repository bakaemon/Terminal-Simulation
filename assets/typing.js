let terminal;
let inputElement;

function createInput(isCreate) {
    let tinput = document.getElementById("t-input");
    if (isCreate) {
        tinput.innerHTML = ` <b>> &nbsp;</b>
            <input type="text" id="terminal-input" autofocus>`;
        inputElement = document.getElementById("terminal-input");
        inputElement.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
                var command = inputElement.value;
                inputElement.value = "";
                createInput(false);
                await executeCommand(command);
                createInput(true);
            }
        });
        // focus on the input
        inputElement.focus();
    } else {
        tinput.innerHTML = "";
    }
}
async function typeEffectEvent(element, text, speed, callbacks) {
    createInput(false);
    let i = 0;
    let isInterrupted = false;
    // if element is a string, then it's a selector
    terminal = typeof element === "string" ? document.querySelector(element) : element;
    terminal.classList.remove("typed");
    terminal.classList.add("typing");
    // switchCursor(true);

    async function handleInterrupt(event) {
        // if ctrl+c is pressed
        if (event.keyCode === 67 && event.ctrlKey) {
            isInterrupted = true;
            terminal.classList.remove("typing");
            terminal.innerHTML += "<br>^C";
            document.removeEventListener("keyup", handleInterrupt);
            createInput(true);
            return;
        }
    }
    document.addEventListener("keyup", handleInterrupt);
    async function typeWriter() {
        if (i < text.length) {
            const currentChar = text.charAt(i);
            if (currentChar === "[" && text.charAt(i + 1) === ">") {
                // Check for delay command [>X] where X is the delay time in milliseconds
                const closingBracketIndex = text.indexOf("]", i);
                if (closingBracketIndex !== -1) {
                    const delayTime = parseInt(text.substring(i + 2, closingBracketIndex));
                    await new Promise((resolve) => setTimeout(resolve, delayTime));
                    i = closingBracketIndex + 1;
                    await typeWriter();
                    return;
                }
            }
            else if (currentChar === "[" && text.charAt(i + 1) === "!") {
                const closingBracketIndex = text.indexOf("]", i);
                if (closingBracketIndex !== -1) {
                    const callbackIndex = parseInt(text.substring(i + 2, closingBracketIndex));
                    if (callbacks && callbacks[callbackIndex] && typeof callbacks[callbackIndex] === "function") {
                        // put callback as a cancelable promise
                        currentPromise = new CancelablePromise(callbacks[callbackIndex]);
                        await currentPromise.then((result) => {
                            // if the promise is not canceled
                            if (!isInterrupted) {
                                typeEffectEvent(terminal, result, speed, callbacks);
                            } else {
                                currentPromise.cancel();
                            }
                        });
                    }
                    i = closingBracketIndex + 1;
                    await typeWriter();
                    return;
                }
            }
            terminal.innerHTML += currentChar;
            i++;
            await new Promise((resolve) => setTimeout(resolve, speed));
            if (isInterrupted) {
                document.removeEventListener("keyup", handleInterrupt);
                // switchCursor(false);
                return;
            }
             else await typeWriter();
        } else {
            terminal.classList.remove("typing");
            // delay before transitioning to typed
            await new Promise((resolve) => setTimeout(resolve, 200));

            // waiting blinking cursor
            terminal.classList.add("typed");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            terminal.classList.remove("typed");
            document.removeEventListener("keyup", handleInterrupt);
            // switchCursor(false);
        }
    }
    

    await typeWriter();
}




function switchCursor(isBlinking) {
    if (!isBlinking) {
        terminal.classList.remove("typing");
        return new Promise((resolve) => setTimeout(resolve, 200))
            .then(() => {
                // waiting blinking cursor
                terminal.classList.add("typed");
                return new Promise((resolve) => setTimeout(resolve, 1000))
                    .then(() => {
                        terminal.classList.remove("typed")
                    });
            });
    } else {
        terminal.classList.remove("typed");
        terminal.classList.add("typing");
        return;
    }
}

// override the default typeEffect function
async function typeEffect(element, text, speed) {
    await typeEffectEvent(element, text, speed, []);
}


