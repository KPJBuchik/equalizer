let audioCtx = window.AudioContext || window.webkitAudioContext;
let audioContext, canvasContext;

let filters = [];

let analyser;
let width, height;
let dataArray, bufferLength;
let masterGain, stereoPanner;
let count=0;

$(".switch").on("click", function () {
    audioContext = new audioCtx()
    buildAudioGraph();

});

function buildAudioGraph() {
    let mediaElement = document.getElementById('preview-player');
    let sourceNode = audioContext.createMediaElementSource(mediaElement);

    analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);



    [60, 170, 350, 1000, 3500, 10000].forEach(function (freq, i) {
        let eq = audioContext.createBiquadFilter();
        eq.frequency.value = freq;
        eq.type = "peaking";
        eq.gain.value = 0;
        filters.push(eq);
    });

    sourceNode.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
    }

    masterGain = audioContext.createGain();
    masterGain.value = 1;


    filters[filters.length - 1].connect(masterGain);

    stereoPanner = audioContext.createStereoPanner();
    masterGain.connect(stereoPanner);

    stereoPanner.connect(analyser);
    analyser.connect(audioContext.destination);
}



function changeGain(sliderVal, nbFilter) {
    let value = parseFloat(sliderVal);
    filters[nbFilter].gain.value = value;

    let output = document.querySelector("#gain" + nbFilter);
    output.value = value + " dB";


}


