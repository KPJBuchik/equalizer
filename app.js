let audioCtx = window.AudioContext || window.webkitAudioContext;
let audioContext, canvasContext;

let filters = [];

let analyser;
let width, height;
let dataArray, bufferLength;
let masterGain, stereoPanner;
let eqSwitch = 0;
let count=0;


$(".slider").on("click", function () {
    eqSwitch++;
    audioContext = new audioCtx()
    buildAudioGraph();

});

function buildAudioGraph() {
    var mediaElement = document.getElementById('preview-player');
    var sourceNode = audioContext.createMediaElementSource(mediaElement);

    analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);



    [60, 170, 350, 1000, 3500, 10000].forEach(function (freq, i) {
        var eq = audioContext.createBiquadFilter();
        eq.frequency.value = freq;
        eq.type = "peaking";
        eq.gain.value = 0;
        filters.push(eq);
    });

    sourceNode.connect(filters[0]);
    for (var i = 0; i < filters.length - 1; i++) {
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
    var value = parseFloat(sliderVal);
    filters[nbFilter].gain.value = value;

    var output = document.querySelector("#gain" + nbFilter);
    output.value = value + " dB";


}


