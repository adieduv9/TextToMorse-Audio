let lastMorseOutput = "";

function convert(mode) {
    const text = document.getElementById("inputText").value;

    fetch("/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text,
            mode: mode
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            document.getElementById("output").innerText = data.error;
            return;
        }

        document.getElementById("output").innerText = data.result;

        if (mode === "encode") {
            lastMorseOutput = data.result;
        }
    })
    .catch(error => {
        document.getElementById("output").innerText = "Error communicating with server.";
    });
}


function copyOutput() {
    const output = document.getElementById("output").innerText;
    navigator.clipboard.writeText(output);
}


function playAudio() {
    if (!lastMorseOutput) return;

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 120;
    let time = context.currentTime;

    lastMorseOutput.split("").forEach(symbol => {
        if (symbol === ".") {
            beep(context, time, dotDuration);
            time += dotDuration / 1000 + 0.1;
        }
        else if (symbol === "-") {
            beep(context, time, dotDuration * 3);
            time += (dotDuration * 3) / 1000 + 0.1;
        }
        else {
            time += 0.2;
        }
    });
}


function beep(context, time, duration) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.frequency.value = 600;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(time);
    oscillator.stop(time + duration / 1000);
}
