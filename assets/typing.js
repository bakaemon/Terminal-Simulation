async function typeEffect(element, text, speed) {
    let i = 0;
    // if element is a string, then it's a selector
    const terminal = typeof element === "string" ? document.querySelector(element) : element;
    terminal.classList.remove("typed");
    terminal.classList.add("typing");

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
            terminal.innerHTML += currentChar;
            i++;
            await new Promise((resolve) => setTimeout(resolve, speed));
            await typeWriter();
        } else {
            terminal.classList.remove("typing");
            // delay before removing the typing class
            await new Promise((resolve) => setTimeout(resolve, 200));
            terminal.classList.add("typed");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            terminal.classList.remove("typed");
        }
    }

    await typeWriter();
}

