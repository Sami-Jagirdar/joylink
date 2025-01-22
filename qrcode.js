const QRCode = require('qrcode');

window.onload = () => {
    const url = 'http://192.168.1.86:5001'; //TODO figure out how to determine the IP address

    const qrcodeElement = document.getElementById('qrcode');

    if (!qrcodeElement) {
        console.error('QR code container not found!');
        return;
    }

    QRCode.toCanvas(qrcodeElement, url, function (error) {
        if (error) {
            console.error('Error generating QR code:', error);
            return;
        }
        console.log('QR code generated!');
    });

};

