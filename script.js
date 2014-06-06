var debug = "";
window.onload = function()
{
    var ejecutaVideo = false;
    var reproVideo = false;
    var video = nom_div("video");
    var canvas = nom_div('canvas');
    var tomafoto = nom_div('boton');
    var asciiCam = nom_div('asciiCam');
    var width = 300;
    var height = 300;
    var efecto = 0;
    var colorGama = 1;
    canvas.width = width;
    canvas.height = height;
    var c = canvas.getContext('2d');
    //Solicitar la cámara al usuario...
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
    navigator.getMedia(
    {
        video: true,
        audio: false
    },

    function(fuente)//URL blog
    {
        if(navigator.mozGetUserMedia)
        {
            video.mozSrcObject = fuente;
        }
        else
        {
            var URL = window.URL || window.webkitURL;
            video.src = URL.createObjectURL(fuente);
        }
        video.play();
    },
    function(err)
    {
        //alert("El navegador no soporta getMedia");
        console.log("El navegador no soporta getUserMedia");
    });

    video.addEventListener('canplay', function(ev)
    {
        if (!ejecutaVideo)
        {
            height = video.videoHeight / (video.videoWidth/width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            ejecutaVideo = true;
        }
    });

    function capturarVideo()
    {
        var character, line = "";
        c.clearRect (0, 0, width, height);
        c.drawImage(video, 0, 0, width, height);
        var pixels = c.getImageData(0, 0, width, height);
        var pix = pixels.data;
        var colorAlfa;
        var rgba = [0, 0, 0];
        
        //var ascii = nom_div("ascii");
        asciiCam.innerHTML = "";
        //var linea = "";
       
        for (var i = 0, n = pix.length; i < n; i +=4)
            {
                rgba[0] = pix[i]; //rojo..
                rgba[1] = pix[i+1]; //Verde
                rgba[2] = pix[i+2]; //Azul..
                colorAlfa = rgba[0]*0.2126 + rgba[1]*0.7152 + rgba[2]*0.0722; //Alpha...

            if(colorAlfa > 250) character = " "; //almost white
            else if(colorAlfa > 230) character = "`";
            else if(colorAlfa > 200) character = ":";
            else if(colorAlfa > 175) character = "*";
            else if(colorAlfa > 150) character = "+";
            else if(colorAlfa > 125) character = "#";
            else if(colorAlfa > 50) character = "W";
            else character = "@"; //almost black
            
            if(i !== 0 && (i/4)%width === 0) //if the pointer reaches end of pixel-line
            {
                asciiCam.appendChild(document.createTextNode(line));
                asciiCam.appendChild(document.createElement("br"));
                line = "";
            }

            line += character;
            }

    }

    setInterval(loop, 100);

    function loop()
    {
        if(reproVideo)
        {
            console.log("Ingresa...");
            capturarVideo();
            //reproVideo = !reproVideo;
        }
    }

    tomafoto.addEventListener('click', function(event)
    {
        reproVideo = !reproVideo;
        video.style.display = "none";
        principal.style.display = "none";

    });

    nom_div("descarga").addEventListener('click', function(event)
    {
        var nomfoto = prompt("Nombre de la foto", "foto");
        this.download = nomfoto + ".png";
        this.href = canvas.toDataURL();
    });

    nom_div("botonD").addEventListener('click', function(event)
    {
       window.location.href = 'index.html';
    });

    function nom_div(div)
    {
        return document.getElementById(div);
    }
}