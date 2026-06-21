// var version_load='2.150';
var cfs3_enable=true;
var version_load='2.76';
if(document.domain === "campus.ieditorial.net" || document.domain === "demomoodle.innoforma.com"){
	version_load = (Math.random()).toString();
}

// Registra el tiempo cuando se dispara el evento load
window.addEventListener("load", function(event) {
	var loadTime = performance.now() / 1000;
	console.log('%cPágina Cargada en ' + loadTime.toFixed(2) + ' segundos', 'color: #1cfff9; background: #bd4147; font-size: 1.3em; padding: 0.25em 0.5em; margin: 1em; font-family: Helvetica; border: 2px solid white; border-radius: 0.6em; font-weight: bold; text-shadow: 1px 1px 1px #000121;');
});

try{

    // implement JSON.stringify serialization
    JSON.stringify = JSON.stringify || function (obj) {

        var t = typeof (obj);
        if (t != "object" || obj === null) {

            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);

        }
        else {

            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n]; t = typeof(v);

                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);

                json.push((arr ? "" : '"' + n + '":') + String(v));
            }

            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    // implement JSON.parse de-serialization
    JSON.parse = JSON.parse || function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };

}catch(err) {
    console.log("******************************");
    console.log("error en cross browser json");
    console.log(err);
    console.log("******************************");
}

/********************************************************************************************/
/********************************************************************************************/

// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

/**/

(function(window){
var
$_GET = window.$_GET = {},
$_VAN = window.$_VAN = {},
location = window.location,
search = location.search,
href = location.href,

index = search.indexOf('?') != -1 ? search.indexOf('?') + 1 : 0,
get = search.substr(index).split('&'),
vanity = href.replace(/^https?:\/\/(.*?)\//i, '').replace(/\?.*$/i, '').split('/');

for (var i in get){
var split = get[i].split('=');
$_GET[split[0]] = decodeURIComponent(split[1])||null;
}
for (var i in vanity)
$_VAN[i] = vanity[i]||null;
})(window);

/**/

var app_domain_access = $_GET["app_domain_access"];

if((typeof(app_domain_access)=="undefined") || (app_domain_access=="")){
	app_domain_access='';
}


if(app_domain_access != ''){
	global_document_domain=app_domain_access;
}else{
	global_document_domain=document.domain;
}

/**/


// Añadir dominios en V3
let dominiosV3 = [];
	dominiosV3.push(global_document_domain);
// Listado dominios no V3
let noDominioV3 = [];

	if (global_document_domain === 'red-aula.es' || global_document_domain === 'teleformacion.icaformacion.com') {
		noDominioV3.push(global_document_domain);
	}

	noDominioV3.forEach(function(dom) {
		dominiosV3 = dominiosV3.filter(function(item) {
			return item !== dom;
		});
	});



function in_array(needle, haystack) {
	for(var i in haystack) {
		if(haystack[i] == needle) return true;
	}
	return false;
}


var valid_protocols=[
	"http:",
	"https:",
];


if(in_array(document.location.protocol,valid_protocols)){
	global_protocol=document.location.protocol;
}else{
	global_protocol='http:';
}

//forzamos https, lo necesitamos para el seteo de cookies en la carga desde CloudFront-S3
global_protocol='https:';

urlGlobal = global_protocol + "//www.educalms.com/REPOSITORIO/";



//cambio de url del repositorio por el tema del tráfico para euroinnova

var urlsAliasIeditorialEuroinnova = [
	"alumnos.euroinnova.edu.es",
	"certificados.euroinnova.edu.es"
];

if(in_array(global_document_domain,urlsAliasIeditorialEuroinnova)){

	urlGlobal = global_protocol + "//cursos.euroinnova.edu.es/REPOSITORIO/";
}

//cambio de url del repositorio por el tema del tráfico para inesem

var urlsAliasIeditorialInesem = [
	"alumnado.inesem.es"
];

if(in_array(global_document_domain,urlsAliasIeditorialInesem)){

	urlGlobal = global_protocol + "//cursos.inesem.es/REPOSITORIO/";
}

//cambio de url del repositorio por el tema del tráfico para rededuca

var urlsAliasIeditorialRededuca = [
	"campusvirtual.rededuca.net"
];

if(in_array(global_document_domain,urlsAliasIeditorialRededuca)){

	urlGlobal = global_protocol + "//cursos.rededuca.net/REPOSITORIO/";
}

/**/

urlCss = urlGlobal + "CSS/";
urlScr = urlGlobal + "SCR/";

var v = $_GET["v"];//url del elemento a mostrar
var t = $_GET["t"];//titulo del elemento
var c = $_GET["c"];//css a utilizar


var elementoPedido = v;
var p = $_GET["p"];

var theme = '';

if((typeof($_GET["theme"])=="undefined")|| ($_GET["theme"]=="")){
	if((typeof($_GET["tema"])=="undefined")|| ($_GET["tema"]=="")){
		theme='';
	}else{
		theme = $_GET["tema"];
	}

}else{
	theme = $_GET["theme"];
}

var scormid = $_GET["scormid"];

if((typeof(scormid)=="undefined")|| (scormid=="")){
	scormid='';
}

var escertificado = $_GET["escertificado"];

if((typeof(escertificado)=="undefined")|| (escertificado=="")){
	escertificado='false';
}

/**/

var rutaUnicaRepo = $_GET["r"];

if((typeof(rutaUnicaRepo)=="undefined")|| (rutaUnicaRepo=="")){
	rutaUnicaRepo='';

	rutaUnicaRepo = $_GET["?r"];

	if((typeof(rutaUnicaRepo)=="undefined")|| (rutaUnicaRepo=="")){
		rutaUnicaRepo='';
	}
}

/**/

var mostrar_impresion = $_GET["mostrar_impresion"];

if((typeof(mostrar_impresion)=="undefined")|| (mostrar_impresion=="")){
	mostrar_impresion='';
}

/**/


function TamVentana() {
	var Tamanyo = [0, 0];
	if (document.all) {
	Tamanyo[0] = document.documentElement.clientWidth;
	Tamanyo[1] = document.documentElement.clientHeight;
	}
	else {
	Tamanyo[0] = window.innerWidth;
	Tamanyo[1] = window.innerHeight;
	}
	return Tamanyo;
}

		
function loadjs(filename){
 
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref);
}


var cmbTpRcrs = function(json) {
    
	tipoRecurso = json.valor;
	if(
		dominiosV3.includes(global_document_domain) &&
		(
			((fecha_registro > 1717656253 || rol) && interno === "0") // Fecha 1717656253 --> 06/06/2024 08:44:13
			||
			((fecha_registro > 1740355200 || rol) && interno === "1") // Fecha 1740355200 --> 24/02/2025 00:00:00
		)
	){
		cntCrgV3();
	}else{
		cntCrg();
	}

}

	
if((typeof(t)=="undefined")|| (t=="")){
	//alert("No tenemos variable t");
	//t="Título no definido";
	t="";
}
else{

	try {
	
		while(t != decodeURIComponent(t)){
			t = decodeURIComponent(t);
		}
	}
	catch(err) {
		t = t;
	}

	t = t.replace( /atilde/g, 'á');//de este modo utilizamos un expresion regular /textoBuscado/ y ahora "g" significa global, es decir en toda la cadena
	t = t.replace( /adieresis/g, 'ä');//con "i" queremos decir que no sea sensible a mayusculas, podemos usarlas juntas /textoBuscado/gi
	t = t.replace( /Atilde/g, 'Á');
	t = t.replace( /Adieresis/g, 'Ä');
	t = t.replace( /etilde/g, 'é');
	t = t.replace( /edieresis/g, 'ë');
	t = t.replace( /Etilde/g, 'É');
	t = t.replace( /Edieresis/g, 'Ë');
	t = t.replace( /itilde/g, 'í');
	t = t.replace( /idieresis/g, 'ï');
	t = t.replace( /Itilde/g, 'Í');
	t = t.replace( /Idieresis/g, 'Ï');
	t = t.replace( /otilde/g, 'ó');
	t = t.replace( /odieresis/g, 'ö');
	t = t.replace( /Otilde/g, 'Ó');
	t = t.replace( /Odieresis/g, 'Ö');
	t = t.replace( /utilde/g, 'ú');
	t = t.replace( /udieresis/g, 'ü');
	t = t.replace( /Utilde/g, 'Ú');
	t = t.replace( /Udieresis/g, 'Ü');
	
	t = t.replace( /_0grado_/g, 'º');
	t = t.replace( /_primera_/g, 'ª');
	t = t.replace( /_ampersand_/g, '&');
	
	t = t.replace( /%22/g, '"');
	t = t.replace( /%27/g, "'");

	t = t.replace( /\?\?/g, "¿");//para empezar una pregunta ponemos en el reload ?? y terminamos con ?   ??Que tal?
	t = t.replace( /!!/g, "¡");

	t = t.replace( /ntilde/g, "ñ");
	t = t.replace( /Ntilde/g, "Ñ");


	
	t = t.replace( /%E2%80%9C/g, '“');
	t = t.replace( /%E2%80%9D/g, '”');
	t = t.replace( /%E2%80%98/g, "‘");	
	t = t.replace( /%E2%80%99/g, "´");
	t = t.replace( /%E2%80%A6/g, "…");
	t = t.replace( /%E2%80%93/g, "–");
	t = t.replace( /%E2%80%94/g, "—");

	
	t = t.replace( /%C2%B4/g, "´");	
	
	
	t=t.split('%20');//tenemos que quitar los espacios que aparecen como %20
	t=t.join(' ');
	//alert("Titulo = " + t);
	
	t=unescape(t);
}


var css_from_base=false;
	
// determinamos la tipoRecurso del archivo
if((typeof(c)=="undefined") || (c=="")){
	//alert("No tenemos variable c de css");
	//podiamos definir aqui la dirección de una pagina html de error!!
}else{}


	var FinishRestrictivo=false;
	
	var dominios_FinishRestrictivo = [
		"coviran.betrained.com",
		"campus.dcedformacion.com",
		"randstadlearning.elmg.net",
		"campus.deustoformacion.com",
		"campus.ceac.com",
		"campus.deustosalud.com",
		"campus.iditformacion.com",
		"www.formacion.cc",
		"campus.auladirecta.com",
		"www.campusadams.com",
		"campus.euroformac.com",
		"campus.imasf.com",
		"www.auladirecta.com",
		"campus.ideoformacion.com",
		"campustic.grupoeuroformac.com",
		"campus.intergrupo.net",
		"bricomart-central.learningcloud.me",
		"campustic.auladirecta.com",
		"campustic.euroformac.com",
		"campustic.imasf.com",
		"campus.ideadosformacion.com",
		"campus2.ideadosformacion.com",
		"campusidiomas.ideadosformacion.com",
		"formaciononline-ocupados18.corenetworks.es",
		"inkor.virtuox.es",
		"gestionv1-c8703.evolcampus.com",
		"sefmurcia.auladirecta.com",
		"cam.auladirecta.com",
		"classlife-static.s3-eu-west-1.amazonaws.com",
		"campuscolquimur.educativa.es",
		"campus2.intergrupo.net",
		"aulaonline.inpformacion.com",
		"contents.contenidoscumlaude.com",
		"caelms.s3.amazonaws.com",
		"dub.scorm.canvaslms.com",
		"faster.chamilo.t2v.com",
		"campus.grupoformacion.es",
		"campus.atperson.com",
		"cloud.scorm.com",
		"campus.gruposese.com",
		"campus.fundacionsese.org",
		"campus.educativa.com",
		"montajesdelsaz.grupoformacion.es",
		"campus.zinkgular.es"
    ];

	if(in_array(global_document_domain,dominios_FinishRestrictivo)){
		FinishRestrictivo=true;
	}

	
	
// codigo necesario de modo general 

document.write(
	'<meta name="keywords" content="cursos, masters, online, e-learning, formacion, calidad, campus, aula, virtual,		contenido, scorm, didactico" />'
	+'<meta name="description" content="Cursos y Masters online de calidad" />'
	+'<meta name="language" content="es" />'
	+'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
	+'<meta http-equiv="Cache-Control" content="no-cache" />'
	+'<meta http-equiv="Pragma" content="no-cache" />'
	+'<meta http-equiv="Expires" content="-1" />'
);

document.write(
	'<!--[if lt IE 7]>'
	+'<script defer type="text\/javascript" src="'+urlScr+'pngfix.js?rev=' + version_load + '"><\/script>'
	+'<![endif]-->'

	+'<!--[if lt IE 9]>'
	+'<script type="text/javascript" src="'+urlCss+'PIE2/PIE_IE678.js?rev=' + version_load + '"></script>'
	+'<![endif]-->'
	+'<!--[if IE 9]>'
	+'<script type="text/javascript" src="'+urlCss+'PIE2/PIE_IE9.js?rev=' + version_load + '"></script>'
	+'<![endif]-->'
);

	// Cambiar estos valores para adaptarlos a las necesidades del SCO
	var bMostrarErroresApi = false;
	var strAPINotFound = "No se ha encontrado la API.";
	var strAPILejos = "No se encuentra la API tras escalar muchas veces...";
	var strFalloInicAPI = "API encontrada, pero LMSInitialize ha fallado.";
	var stfFalloAPISetValue = "Trato de setear un valor pero no encuentro la API";

	// INICIALIZACION DE LA API Y FUNCIONES RECEPTORAS
	var nIntentosBuscarAPI = 0;
	var objAPI_1 = null;
	var bSCOBrowse = false;		//Si el SCO se ha abierto en modo browse
	var dtmFechaInicializado_1 = new Date(); //se ajustara después de inicializar
	var guardado = false;
	var tiempoEnviado = false;
	var videoTerminado = false;

	var local_suspend_data = '';

	function AlertAPIError(str) {
		// console.info(str);
		if (bMostrarErroresApi) { //si esta activado el mostrar errores muestra, si no no.
			// alert(str);
			console.error(str);
		}
	}

	function buscaAPI(ventana) {
		while ((ventana.API == null) && (ventana.parent != null) && (ventana.parent != ventana)) {
			nIntentosBuscarAPI++;
			if (nIntentosBuscarAPI > 400) {
				AlertAPIError(strAPILejos);
				return null;
			}
			ventana = ventana.parent;
		}
		return ventana.API;
	}

	function APIOK() {
		return ((typeof (objAPI_1) != "undefined") && (objAPI_1 != null));
	}

	function getValorSCO(nam) {
		return ((APIOK())) ? objAPI_1.LMSGetValue(nam.toString()) : ""
	}

	dtmFechaInicializado = new Date();

	var ok_1 = "false";

	if ((window.parent) && (window.parent != window)) {
		objAPI_1 = buscaAPI(window.parent);
	}

	if ((objAPI_1 == null) && (window.opener != null)) {
		objAPI_1 = buscaAPI(window.opener);
	}

	if (!APIOK()) {
		AlertAPIError(strAPINotFound);
	}

	ok_1 = objAPI_1.LMSInitialize("");

	if (ok_1.toString() != "true") {
		if(FinishRestrictivo) {
			objAPI_1.LMSFinish("")
		}
		AlertAPIError(strFalloInicAPI);
	}

	var id_estudiante = getValorSCO("cmi.core.student_id");
	var name_estudiante = getValorSCO("cmi.core.student_name");

	id_estudiante = encodeURIComponent(id_estudiante);
	name_estudiante = encodeURIComponent(name_estudiante);


	if(FinishRestrictivo) {
		objAPI_1.LMSCommit("");
	}


	var fecha_registro;
	var rol;
	var interno;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", urlGlobal + "PHP/personalizacion/client_settings.php", false); // true == asincrono ---- false == sincrono
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				try {
					var data = JSON.parse(xhr.responseText);
					fecha_registro = data.fecha_registro;
					rol = (data.rol == 1);
					interno = data.interno;
					// Capture signed token for proxy authentication
					if (data.signed_token) {
						window.SCORM_SIGNED_TOKEN = data.signed_token;
					}
				} catch (e) {
					console.error("Error al analizar JSON:", e);
				}
			} else {
				console.error("Error en la solicitud:", xhr.statusText);
			}
		}
	};

	var params = new URLSearchParams();
	params.append("funcion", "get_date_register");
	params.append("dominio", global_document_domain);
	params.append("student_id", id_estudiante);
	params.append("cc", $_GET["p"]);

	xhr.send(params.toString());

if(
	dominiosV3.includes(global_document_domain) &&
	(
		((fecha_registro > 1717656253 || rol) && interno === "0") // Fecha 1717656253 --> 06/06/2024 08:44:13
		||
		((fecha_registro > 1740355200 || rol) && interno === "1") // Fecha 1740355200 --> 24/02/2025 00:00:00
	)
){
	// Código relacionado con JQUERY.
	document.write(
		'<script src="'+urlScr+'languageV3.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlGlobal+'load_general_info.php?elementoPedido=' + elementoPedido +'&domain=' + global_document_domain +'&rutaUnicaRepo='+rutaUnicaRepo+'&random=' + Math.floor(Math.random()*1000000) + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'jquery/jquery-3.7.1.min.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'jquery/jquery-ui-1.13.2/jquery-ui.min.js?rev=' + version_load + '" type="text\/javascript" ><\/script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'jquery/jquery-ui-1.13.2/jquery-ui.min.css?rev=' + version_load + '">'

		+'<script type="text/javascript">'
			+'var repo_jQ_3_7_1=$=jQuery.noConflict();'
		+'<\/script>'

	);


	document.write(
		//TinyColor
		'<script type="text/javascript" src="'+ urlScr +'TinyColor/tinycolor.js?rev=' + version_load + '" language="JavaScript"></script>'
		// scormFunctions.js
		+'<script src="'+urlGlobal+'loadcontentV3.php?v=Qzg3TkJocWtLRksyaEhMNnQlMkZqWldTaENlRWdvS21TSzRyR3U0cVpteUpzJTNE&rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'
		// lmsScormV3.js
		+'<script src="'+urlGlobal+'loadcontentV3.php?v=SnJ6MG1XeUZFMSUyRjFFWW56eWd1VndNTkNReUx2RGpxWXFId0pweFR5cUNnJTNE=&rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'fredhq_roundabout/jquery.roundabout.js?rev=' + version_load + '"></script>'

		// + '<script src="' + urlScr + 'jqueryUI/printElement.js?rev=' + version_load + '"></script>'

		+'<script type="text/javascript" src="'+urlScr+'message.js?rev=' + version_load + '"></script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'custom-scrollbar-plugin/jquery.mCustomScrollbar.css?rev=' + version_load + '">'
		+'<script type="text/javascript" src="'+urlScr+'custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js?rev=' + version_load + '"></script>'

		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/jquery.textHighlighter.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/rangy-core.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/rangy-textrange.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/jquery.easyMark.js?rev=' + version_load + '"></script>'


		+'<script type="text/javascript" src="'+urlScr+'jquery.ui.touch-punch.min.js?rev=' + version_load + '"></script>'

		+'<script  src="'+urlScr+'flowplayer\/flowplayer-3.2.2.min.js" type="text\/javascript" language="JavaScript"><\/script>'
		+'<script  src="'+urlScr+'jwplayer\/jwplayer.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'toastmessage/src/main/resources/css/jquery.toastmessage.css?rev=' + version_load + '">'
		+'<script  src="'+urlScr+'toastmessage/src/main/javascript/jquery.toastmessageV3.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'sweetalert-master/dist/sweetalert.min.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'
		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'sweetalert-master/dist/sweetalert.css?rev=' + version_load + '">'

		+'<script type="text/javascript" src="'+urlScr+'videojs\/video.min.js?rev=' + version_load + '"></script>'
		+'<script type="text/javascript" src="'+urlScr+'videojs\/es.js?rev=' + version_load + '"></script>'
		+'<link type="text/css" rel="stylesheet" media="screen" href="'+urlScr+'videojs/video-js.css?rev=' + version_load + '"/>'


		// FontAwesome
		+'<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />'

		// Swiper
		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'swiper/swiper-bundle.min.css?rev=' + version_load + '">'
		+'<script type="text/javascript" src="' + urlScr + 'swiper/swiper-bundle.min.js?rev=' + version_load + '"  language="JavaScript"></script>'

		// Mermaid
		+'<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" language="JavaScript"></script>'

		// Traductor
		+'<script type="text/javascript" src="' + global_protocol + '//translate.google.com/translate_a/element.js?rev=' + version_load + '" language="JavaScript"></script>'

		+'<script>'
			+'repo_jQ_3_7_1(window).on("load", function(){'

				+'repo_jQ_3_7_1(document).keydown(function(event) {'
					// Prevenir la acción predeterminada
					+'if(event.ctrlKey && (event.which === 80 || event.which === 112)) {'
						+'event.preventDefault();'
					+'}'
				+'});'

			+'});'
		+'</script>'
	);


	document.write(
		'<\/head>'
	);
	document.write(
		'<body><\/body><\/html>'
	);
	document.close();


	//  Ponemos el titulo que hemos recibido
	var fileref=document.createElement('title');

	if (typeof fileref!="undefined"){
		fileref.innerHTML = t;
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

}else{

	document.write(
		'<script src="'+urlScr+'language.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlGlobal+'load_general_info.php?elementoPedido=' + elementoPedido +'&domain=' + global_document_domain +'&rutaUnicaRepo='+rutaUnicaRepo+'&random=' + Math.floor(Math.random()*1000000) + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'jquery.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'
		+'<script type="text/javascript">'
		+'var repo_jQ_1_4_2=$=jQuery.noConflict();'
		+'<\/script>'

		+'<script src="'+urlScr+'jqueryUI/jquery-1.5.1.min.js?rev=' + version_load + '" type="text\/javascript" ><\/script>'
		+'<script type="text/javascript">'
		+'var repo_jQ_1_5_1=$=jQuery.noConflict();'
		+'<\/script>'
	);

	//CODIGO PARA LA COMUNICACION CON EL LMS **IMPRESCINDIBLE** y tambien para la navegacion
	document.write(
		// scormFunctions.js
		'<script src="'+urlGlobal+'loadcontentV3.php?v=Qzg3TkJocWtLRksyaEhMNnQlMkZqWldTaENlRWdvS21TSzRyR3U0cVpteUpzJTNE&rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'
		//lmsScormV3.1.js
		+ '<script src="'+urlGlobal+'loadcontent.php?v=NG9NeWJvVWtUSGtORkhwTnlNY0hHU3E2ZjNOM2U1aGwxN2hPc0cxYzAxdyUzRA==&rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlCss+'jqueryUI/jquery.ui.all.css?rev=' + version_load + '">'

		+'<script type="text/javascript" src="'+urlScr+'jqueryUI/jquery-ui-1.8.14.custom.js?rev=' + version_load + '"></script>'

		+'<script src="'+urlScr+'fredhq_roundabout/jquery.roundabout.js?rev=' + version_load + '"></script>'

		+ '<script src="' + urlScr + 'jqueryUI/printElement.js?rev=' + version_load + '"></script>'

		+'<script type="text/javascript" src="'+urlScr+'message.js?rev=' + version_load + '"></script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'custom-scrollbar-plugin/jquery.mCustomScrollbar.css?rev=' + version_load + '">'
		+'<script type="text/javascript" src="'+urlScr+'custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js?rev=' + version_load + '"></script>'


		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/jquery.textHighlighter.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/rangy-core.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/rangy-textrange.js?rev=' + version_load + '"></script>'
		+ '<script type="text/javascript" src="' + urlScr + 'subrayador/jquery.easyMark.js?rev=' + version_load + '"></script>'


		+'<script type="text/javascript" src="'+urlScr+'jquery.ui.touch-punch.min.js?rev=' + version_load + '"></script>'

		+'<script  src="'+urlScr+'flowplayer\/flowplayer-3.2.2.min.js" type="text\/javascript" language="JavaScript"><\/script>'
		+'<script  src="'+urlScr+'jwplayer\/jwplayer.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'toastmessage/src/main/resources/css/jquery.toastmessage.css?rev=' + version_load + '">'
		+'<script  src="'+urlScr+'toastmessage/src/main/javascript/jquery.toastmessage.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'

		+'<script src="'+urlScr+'sweetalert-master/dist/sweetalert.min.js?rev=' + version_load + '" type="text\/javascript" language="JavaScript"><\/script>'
		+'<link rel="stylesheet" type="text/css" href="'+urlScr+'sweetalert-master/dist/sweetalert.css?rev=' + version_load + '">'

		+'<link rel="stylesheet" type="text/css" href="'+urlCss+'GENERAL/general.css?rev=' + version_load + '">'

		+'<script type="text/javascript" src="'+urlScr+'videojs\/video.min.js?rev=' + version_load + '"></script>'
		+'<script type="text/javascript" src="'+urlScr+'videojs\/es.js?rev=' + version_load + '"></script>'
		+'<link type="text/css" rel="stylesheet" media="screen" href="'+urlScr+'videojs/video-js.css?rev=' + version_load + '"/>'

		// Mermaid
		+'<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" language="JavaScript"></script>'

	);

	document.write(
		'<\/head>'
	);
	document.write(
		'<body><\/body><\/html>'
	);
	document.close();


//  Ponemos el titulo que hemos recibido
	var fileref=document.createElement('title');

	if (typeof fileref!="undefined"){
		fileref.innerHTML = t;
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

}

if(
	dominiosV3.includes(global_document_domain) &&
	(
		((fecha_registro > 1717656253 || rol) && interno === "0") // Fecha 1717656253 --> 06/06/2024 08:44:13
		||
		((fecha_registro > 1740355200 || rol) && interno === "1") // Fecha 1740355200 --> 24/02/2025 00:00:00
	)
){
		function cntCrgV3(){

		repo_jQ_3_7_1(document).ready(function(repo_jQ_3_7_1) {

			//Ponemos el contenido del body segun corresponda

			if(tipoRecurso == "VID"){

				textoMeter='<div class="wrapper_vid">'
					+'<div class="content_vid">'
					+'<div class="tituloVideoT" style="color: white; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contVideo_vid">'
					+'<\/div>'
					+'<br \/>'
					+'<div id="confirmacion_vid" >Debe ver el vídeo al completo para poder finalizarlo o avanzar en el mismo<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="vid";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarVideoSCO;
			}

			if(tipoRecurso == "PRE"){

				textoMeter='<div class="wrapper_pre">'
					+'<div class="content_pre">'
					+'<div class="tituloPresentacionT" style="color: white; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contSwf_pre">'
					+'<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="pre";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}

			if(tipoRecurso == "PAP"){

				textoMeter='<div class="wrapper_pap">'
					+'<div class="content_pap">'
					+'<div class="tituloPaperT" style="color: black; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contSwf_pap">'
					+'<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="pap";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}

			if(tipoRecurso == "HTM"){

				textoMeter= '' +
					'<div class="loader-container">' +
						'<div class="loader"></div>' +
					'</div>' +
					'<div id="ee">' +
						'<div id="ee_header_htm"></div>' +
						'<div id="ee_content_htm"></div>' +
						'<div id="ee_footer_htm"></div>' +
					'</div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="htm";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}


			if(tipoRecurso == "EVA"){

				textoMeter= '' +
					'<div class="loader-container">' +
						'<div class="loader"></div>' +
					'</div>' +
					'<div id="ee">' +
						'<div id="ee_header_eva"></div>' +
						'<div id="ee_content_eva"></div>' +
						'<div id="ee_footer_eva"></div>' +
					'</div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="eva";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = guardarTiempoSCO;
			}

			//controlamos el tema del scroll en ipad
			var dispositivoUserAgent = navigator.userAgent.toLowerCase();
			var buscarApple='/iphone|ipod|ipad|macintosh/gi';
			if(dispositivoUserAgent.search( eval(buscarApple) ) > -1){
				appleDetectado=true;
			}else{
				appleDetectado=false;
			}

			if(appleDetectado) {

				var css_for_scroll_ipad = '<style>'
					+ 'html, body'
					+ '{'
					+ 'width: 100%; height: 100%;  -webkit-overflow-scrolling: touch;'
					+ '}'
					+ '</style>';

				repo_jQ_3_7_1('head').append(css_for_scroll_ipad);

				repo_jQ_3_7_1('.loader-container').hide();
			}


		});
	}
}else{
	function cntCrg(){

		repo_jQ_1_5_1(document).ready(function(repo_jQ_1_5_1) {

			//Ponemos el contenido del body segun corresponda

			if(tipoRecurso == "VID"){

				textoMeter='<div class="wrapper_vid">'
					+'<div class="content_vid">'
					+'<div class="tituloVideoT" style="color: white; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contVideo_vid">'
					+'<\/div>'
					+'<br \/>'
					+'<div id="confirmacion_vid" >Debe ver el vídeo al completo para poder finalizarlo o avanzar en el mismo<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="vid";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarVideoSCO;
			}

			if(tipoRecurso == "PRE"){

				textoMeter='<div class="wrapper_pre">'
					+'<div class="content_pre">'
					+'<div class="tituloPresentacionT" style="color: white; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contSwf_pre">'
					+'<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="pre";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}

			if(tipoRecurso == "PAP"){

				textoMeter='<div class="wrapper_pap">'
					+'<div class="content_pap">'
					+'<div class="tituloPaperT" style="color: black; margin: auto; text-align: center; font-size: 25px; overflow: hidden; white-space: nowrap;">'+t+'</div>'
					+'<center>'
					+'<div id="contSwf_pap">'
					+'<\/div>'
					+'<\/center>'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="pap";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}

			if(tipoRecurso == "HTM"){

				textoMeter= '<div class="ee_container_htm">'
					+'<div class="ee_header_htm">'
					+'<\/div>'
					+'<div class="ee_content_htm" id="ee_content_htm">'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="htm";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = finalizarSCO;
			}


			if(tipoRecurso == "EVA"){

				textoMeter= '<div class="ee_container_eva">'
					+'<div class="ee_header_eva">'
					+'<\/div>'
					+'<div class="ee_content_eva" id="ee_content_eva">'
					+'<\/div>'
					+'<\/div>';


				var elemento = document.getElementsByTagName("body")[0];

				elemento.className="eva";
				elemento.innerHTML=textoMeter;

				inicializarSCO();
				window.onbeforeunload = window.onunload = guardarTiempoSCO;
			}

			//controlamos el tema del scroll en ipad
			var dispositivoUserAgent = navigator.userAgent.toLowerCase();
			var buscarApple='/iphone|ipod|ipad|macintosh/gi';
			if(dispositivoUserAgent.search( eval(buscarApple) ) > -1){
				appleDetectado=true;
			}else{
				appleDetectado=false;
			}

			if(appleDetectado) {

				var css_for_scroll_ipad = '<style>'
					+ 'html, body'
					+ '{'
					+ 'width: 100%; height: 100%;  -webkit-overflow-scrolling: touch;'
					+ '}'
					+ '</style>';

				repo_jQ_1_5_1('head').append(css_for_scroll_ipad);
			}

		});
	}
}

