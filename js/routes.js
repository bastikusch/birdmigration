function update() {

    //choose interpolation method
    var ip = document.getElementById("interpolation").value;
    if (ip == 0) {
        var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    } else if (ip == 1) {
        var lineSeries = chart.series.push(new am4maps.MapSplineSeries());
    } else {
        var lineSeries = chart.series.push(new am4maps.MapArcSeries());
    }
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";

    var lineTemplate = lineSeries.mapLines.template;
    lineTemplate.nonScalingStroke = true;
    lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
    lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
    lineTemplate.line.strokeOpacity = 1;
    lineTemplate.line.strokeWidth = 0.7;
    //lineTemplate.line.controlPointDistance = 0.2;

    // var n = parseFloat(document.getElementById("individuals").value);
    var start_lat = parseFloat(document.getElementById("lat").value);
    var start_long = parseFloat(document.getElementById("long").value);
    var ver = document.getElementById("strategy").value;
    var sysnr = parseFloat(document.getElementById("system").value);
    var magnet = parseFloat(document.getElementById("magnet").value);
    var wind = [parseFloat(document.getElementById("incl").value)];
    wind[1] = parseFloat(document.getElementById("u").value);
    wind[2] = parseFloat(document.getElementById("v").value);
    var maxdays = parseFloat(document.getElementById("maxdays").value);
    var h1 = document.getElementById("h1").value;
    var h2 = document.getElementById("h2").value;
    var h3 = document.getElementById("h3").value;
    var h4 = document.getElementById("h4").value;
    var initHeading_arr = [h1, h2, h3, h4];

    if (!document.getElementById("grey").hidden) {
        sysnr = 7;
    }
    console.log(sysnr);
    if (ver == 0) {
        route = randomwalk([53, 8], 4, 100, 0.5);
    } else {
        route = migration(sysnr, magnet, wind, maxdays, initHeading_arr, start_long, start_lat);
    }

    lineSeries.data = [{
        "multiGeoLine": route
    }];

    var line = lineSeries.mapLines.create();
}

// function to clear routes
function clear_all() {
    while (chart.series.length > 2) {
        chart.series.removeIndex(2).dispose();
    }
}

function showReport(){
    var myWindow = window.open("", "MsgWindow", 'height=500,width=900,left=300,top=150,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
    myWindow.document.write("<b>Could show statistics of last run simulation</b>" +
        "<p>numbers of individuals survived: 100</p>");
    // var myWindow = window.open("/report.html", "", "width=800,height=600");
}



function magnet2(){

    var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";
    var declination = [{"latitude": -90, "longitude": -180}];

    AmCharts.loadFile( "data/csvfiles/Declination.csv", {}, function( response ) {

        var d = AmCharts.parseCSV(response, {
            "separator": ",",
            "useColumnNames": true,
            "numberFields": ["value"]
        });

        for (var i = 0, len = d.length; i < len; i++) {
            if (+d[i].error == 0.4){
                declination.push({
                    latitude: +d[i].latitude,
                    longitude: +d[i].longitude
                });
            }

        }

        lineSeries.data = [{
            "multiGeoLine": [declination]
        }];

        lineSeries.mapLines.create();

    });
}

function magnet(){
    var circleSeries = chart.series.push(new am4maps.MapPolygonSeries())
    var circleTemplate = circleSeries.mapPolygons.template;
    circleTemplate.fill = am4core.color("black");
    circleTemplate.strokeOpacity = 0;
    circleTemplate.fillOpacity = 1;
    circleTemplate.nonScalingStroke = true;


    AmCharts.loadFile( "data/csvfiles/Declination.csv", {}, function( response ) {

        var d = AmCharts.parseCSV(response, {
            "separator": ",",
            "useColumnNames": true,
            "numberFields": ["value"]
        });
        for (var i = 0, len = d.length; i < len; i = i + 3) {
            if (+d[i].error == 0.4) {
                var polygon = circleSeries.mapPolygons.create();
                polygon.multiPolygon = am4maps.getCircle(+d[i].latitude, +d[i].longitude, 1);
            }
        }
    });
}

function magnet3(){
    var size = 100, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

    for(var i = 0; i < size; i++) {
        x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
        z[i] = new Array(size);
    }

    for(var i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
            var r2 = x[i]*x[i] + y[j]*y[j];
            z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
        }
    }

    var data = [ {
        z: z,
        x: x,
        y: y,
        type: 'contour'
    }
    ];

    var layout = {
        autosize: true,
    };
    Plotly.newPlot('magnetfield', data, layout, {displayModeBar: false});
}








