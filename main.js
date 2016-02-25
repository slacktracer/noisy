var context;
var noisy;

context = new AudioContext();

noisy = {
    brownNoise: context.createBrownNoise(8192),
    gainNode: context.createGain(),
    oscillator: context.createOscillator(),
    oscillatorGain: context.createGain(),
    pinkNoise: context.createPinkNoise(8192),
    slider: null,
    timer: null,
    turnOff: null,
    whiteNoise: context.createWhiteNoise(8192)
};

noisy.oscillator.frequency.value = 0;
noisy.oscillator.connect(noisy.oscillatorGain);
noisy.oscillatorGain.connect(noisy.gainNode.gain);

noisy.oscillator.start(0);
noisy.gainNode.gain.value = 0;
noisy.oscillatorGain.gain.value = 0;

noisy.gainNode.connect(context.destination);

$(function() {
    $('#white').click(function onClick() {
        setColor('white');
    });
    $('#pink').click(function onClick() {
        setColor('pink');
    });
    $('#brown').click(function onClick() {
        setColor('brown');
    });
    $('#none').click(function onClick() {
        setOscillation('none');
    });
    $('#low').click(function onClick() {
        setOscillation('low');
    });
    $('#medium').click(function onClick() {
        setOscillation('medium');
    });
    $('#high').click(function onClick() {
        setOscillation('high');
    });
    $('#plus60').click(function onClick() {
        setTimer(60);
    });
    $('#plus10').click(function onClick() {
        setTimer(10);
    });
    $('#plus1').click(function onClick() {
        setTimer(1);
    });
    $('#minus10').click(function onClick() {
        setTimer(-10);
    });
    $('#minus60').click(function onClick() {
        setTimer(-60);
    });
    $('#timer').change(function onClick() {
        setTimer(0);
    });

    noisy.slider = document.querySelectorAll('input[type="range"]');

    rangeSlider.create(
        noisy.slider,
        {
            value: noisy.gainNode.gain.value,
            onSlide: setVolume,
            onSlideEnd: setVolume
        }
    );

    $('#about').on('click touch', function onClickOrTouch() {
        $('#main').hide();
        $('#info').show();
    });

    $('#back').on('click touch', function onClickOrTouch() {
        $('#info').hide();
        $('#main').show();
    });

});

setColor('white');

function onTimerTick() {
    var remainingTime;

    remainingTime = Number(document.getElementById('timer').innerHTML);

    if (Number.isNaN(remainingTime)) remainingTime = 0;

    remainingTime -= 1;

    document.getElementById('timer').innerHTML = remainingTime;

    if (remainingTime === 0) {
        clearInterval(noisy.timer);
        turnOff();
    }
}

function onTurnOffTick() {

    var position;
    var value;

    position = Number(document.getElementById('volumeSet').innerHTML);
    value = noisy.gainNode.gain.value;

    if (position === 0) {
        clearInterval(noisy.turnOff);
        return;
    };

    position -= 1;
    value = position / 100;

    setVolume(position, value);

    noisy.slider[0].value = position;

    noisy.slider[0].rangeSlider.update();

}

function turnOff() {
    clearInterval(noisy.turnOff);
    noisy.turnOff = setInterval(
        onTurnOffTick,
        200
    );
}

function setColor(color) {
    var colorName;
    var selectedNoiseName;

    noisy.whiteNoise.disconnect();
    noisy.pinkNoise.disconnect();
    noisy.brownNoise.disconnect();

    selectedNoiseName = color + 'Noise';
    noisy[selectedNoiseName].connect(noisy.gainNode);

    // if (color === 'white') colorName = 'White';
    // if (color === 'pink') colorName = 'Pink';
    // if (color === 'brown') colorName = 'Brown';

    $('#white').removeClass('active');
    $('#pink').removeClass('active');
    $('#brown').removeClass('active');

    $('#' + color).addClass('active');

    // document.getElementById('colorSet').innerHTML = colorName;
}

function setOscillation(oscillation) {
    var oscillationName;
    var oscillationValue;

    if (oscillation === 'none') { oscillationValue = 0; oscillationName =  'None'; };
    if (oscillation === 'low') { oscillationValue = 0.05; oscillationName =  'Low'; };
    if (oscillation === 'medium') { oscillationValue = 0.1; oscillationName =  'Medium'; };
    if (oscillation === 'high') { oscillationValue = 0.4; oscillationName =  'High'; };

    noisy.oscillator.frequency.value = oscillationValue;

    $('#none').removeClass('active');
    $('#low').removeClass('active');
    $('#medium').removeClass('active');
    $('#high').removeClass('active');

    $('#' + oscillation).addClass('active');

    // document.getElementById('oscillationSet').innerHTML = oscillationName;
}

function setTimer(time) {
    var remainingTime;

    remainingTime = Number(document.getElementById('timer').innerHTML);

    if (Number.isNaN(remainingTime)) remainingTime = 0;

    remainingTime += time;

    if (remainingTime < 0) remainingTime = 0;

    clearInterval(noisy.timer);
    document.getElementById('timerStatus').innerHTML = 'off';

    if (remainingTime !== 0) {
        noisy.timer = setInterval(onTimerTick, 60 * 1000);
        document.getElementById('timerStatus').innerHTML = 'on';
    }

    document.getElementById('timer').innerHTML = remainingTime;
}

function setVolume(position, value) {

    noisy.gainNode.gain.value = value;
    noisy.oscillatorGain.gain.value = value / 2;

    if (value / 2 < 0) {
        noisy.oscillatorGain.gain.value = 0;
    }

    document.getElementById('volumeSet').innerHTML = position;
}
