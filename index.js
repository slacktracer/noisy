document.addEventListener(
    'deviceready',
    function onDeviceReady() {
        document.removeEventListener('deviceready', onDeviceReady, false);

        window.NDRCatch = true;

        void function headset() {

            var status;

            window.plugins.headsetdetection.detect(function onDetection(detected) {
                status = detected;
            });

            loop();

            function loop() {

                window.plugins.headsetdetection.detect(function onDetection(detected) {
                    if (
                        status === true
                        &&
                        detected === false
                    ) {
                        setVolume(0, 0);
                        noisy.slider[0].value = 0;
                        noisy.slider[0].rangeSlider.update();
                    }
                    status = detected;
                });

                setTimeout(
                    loop,
                    200
                );

            }

        }();

        window.setTimeout(
            function onTimeout() {
                $('#intro').hide();
                $('#main').show();
            },
            500
        );

    },
    false
);
