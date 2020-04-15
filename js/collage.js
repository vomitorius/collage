var canvas = new fabric.Canvas('c');
canvas.backgroundColor = '#CCCCCC';
console.log($('#content').height);
canvas.setWidth($('#content').width());
canvas.setHeight($('#content').height());
var page = 0;

var idx_x = 0;
var idx_y = 0;
	
function makeCollage() {
	var word = '';

	var xmlHttp = new XMLHttpRequest();
	var theUrl = "https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			console.log(JSON.parse(xmlHttp.responseText));
			word = JSON.parse(xmlHttp.responseText)[0].word;
			$('#word').val(word);
			if (page != 4) {
				page++;
				getImages(word);
			
			}
		}

	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);

}


function getImages() {

	var xmlHttp2 = new XMLHttpRequest();
	var theUrl2 = "https://www.googleapis.com/customsearch/v1?q=" + $('#word').val() + "&start=" + parseInt(page * 10 + 1) + "&filetype=png&imgType=face&cx=008027332941483755550:ige8eubodlc&searchType=image&num=10&key=AIzaSyBiNsx2DvTYsGDQlv-3FQmYXaAOjzcmhKg";
	console.log(theUrl2);
	xmlHttp2.onreadystatechange = function() {
		if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200) {
			addImagesToCanvas(JSON.parse(xmlHttp2.responseText).items);
			if (page != 4) {
				page++;
				getImages(word);
			
			}

		}

	}
	xmlHttp2.open("GET", theUrl2, true); // true for asynchronous 
	xmlHttp2.send(null);
}
/*
https://developers.google.com/custom-search/json-api/v1/reference/cse/list#try-it
*/
function addImagesToCanvas(images) {
	
	for (var i in images) {
		var image = new fabric.Image.fromURL(images[i].link, function(oImg) {
			
			/* Ranfom POS
			oImg.left = Math.floor(Math.random() * 1050);
			oImg.top = Math.floor(Math.random() * 700);
			oImg.scaleX = 0.4;
			oImg.scaleY = 0.4;
			oImg.angle = Math.floor(Math.floor(Math.random() * 90) - 45);*/
			
			oImg.width = 100;
			oImg.height = 70;
			oImg.left = idx_x *(oImg.width+5);
			oImg.top  = idx_y *(oImg.height+5);
			idx_x++;
			console.log('IDX', idx_x*200);
			console.log('cnv', canvas.width);
			if ((idx_x+1) *oImg.width > canvas.width){
				idx_y++;
				idx_x=0;
			}
			
			// ... Modify other attributes
			canvas.insertAt(oImg, 0);
		});
	}
}


// A $( document ).ready() block.
$( document ).ready(function() {
    makeCollage();
});



$("#search").click(function() {
	var page = 0;

	idx_x = 0;
	idx_y = 0;
	canvas.clear();
	canvas.backgroundColor = '#CCCCCC';
	getImages();
});

$('#word').on('keydown', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
    console.log('enter')
      page = 0;
      idx_x = 0;
	idx_y = 0;
	canvas.clear();
	canvas.backgroundColor = '#CCCCCC';
	getImages();
    }
});