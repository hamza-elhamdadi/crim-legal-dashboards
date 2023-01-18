var BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'pt ' + fontFace;
        return context.measureText(text).width;
    }
    return {
        getWidth: getWidth
    };
})();

// Then call it like this:
//console.log(BrowserText.getWidth('hello world', 22, 'Arial')); // 105.166015625
//console.log(BrowserText.getWidth('hello world', 22)); // 100.8154296875