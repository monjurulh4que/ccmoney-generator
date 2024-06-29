var xfContentLocker;
var __cfRLUnblockHandlers = 1;

function CPBContentLocker() {
    this.constructed = false;
    this.referrer = document.referrer ? this.encode(document.referrer) : '';
    this.protocol = ("https:" === document.location.protocol ? "https://" : "http://");
    this.settings = this.getSettings();
    this.extraParams = {};
    this.uid = '';
    this.urls = {};
    this.screenHeight = window.screen.availHeight ? window.screen.availHeight : 0;
    this.screenWidth = window.screen.availWidth ? window.screen.availWidth : 0;
    this.isMobile = this.mobileCheck();
    this.callbacks = [];
    this.d2 = ["EUYGBw0RRwIDHgYYBBFbFhkaABETBxobAVsbEAE=","EUYeHQAUQh4GAw0QBg1bFhkaABETBxobAVsbEAE=","EQYBRkMBRx4fG0ISHFsWGRoAERMHGhsBWxsQAQ==","EUERTE1CBRtEBxERAVsWGRoAERMHGhsBWxsQAQ==","EUQMEQIWFkBNBhAfFEVbFhkaABETBxobAVsbEAE=","EUQTAR4TAUIcHBkABENbFhkaABETBxobAVsbEAE=","EQYZBQIXEA8cBkwUHFsWGRoAERMHGhsBWxsQAQ==","EQZEBURCDUIcBhhAB1sWGRoAERMHGhsBWxsQAQ==","ER8FQQcEBA0RGwMcRVsWGRoAERMHGhsBWxsQAQ==","EQ0HQEYCBhcRDAMHDFsWGRoAERMHGhsBWxsQAQ=="];
    this.d3 = this.decode64(this.d2[Math.floor(Math.random() * this.d2.length)]);


    //These will be overwritten by loads
    this.defaultSettings = [];
    this.userSettings = [];
    this.modal = null;
    this.modalContainer = null;
    this.modalContent = null;
    this.animation = null;
    this.iframe = null;
    this.isLoaded = false;

    this.requiredPoints = 10000;
    this.requiredLeads = 1;
    this.completedLeads = [];
    this.completedPoints = 0;
    this.visitor_id = 0;
    this.locks=["RH",
        "Vm",
        "uj",
        "Ew",
        "HW",
        "oy",
        "Jf",
        "Mz",
        "EQ",
        "ZU",
        "lL",
        "yk",
        "Tm",
        "Ht",
        "nS",
        "Xy",
        "qr",
        "Tt",
        "du",
        "OS",
        "Ts",
        "ET",
        "om",
        "Wi",
        "xb",
        "GK",
        "CS",
        "kt",
        "iE",
        "Ut",
        "yi",
        "TR",
        "iD",
        "aj",
        "lI",
        "Ri",
        "Th",
        "gD",
        "iH",
        "ff",
        "uG",
        "KE",
        "VR",
        "HL",
        "VX",
        "Nr",
        "di",
        "Ul",
        "WT",
        "Cd",
        "cy",
        "jb",
        "tx",
        "Yf",
        "zl",
        "Pg",
        "CJ",
        "Jl",
        "GX",
        "nO",
        "JF",
        "KB",
        "VU",
        "MS",
        "cn",
        "xA",
        "Kx",
        "eN",
        "yy",
        "bC",
        "JW",
        "cW",
        "Cm",
        "xY",
        "Gi",
        "Ns",
        "bu",
        "Ci",
        "cZ",
        "vH",
        "ou",
        "Tu",
        "ux",
        "xS",
        "wg",
        "vs",
        "Nl",
        "LF",
        "gu",
        "Yg",
        "Hj",
        "dS",
        "VE",
        "TG",
        "qd",
        "FD",
        "rp",
        "Hn",
        "my",
        "qW",];


    //extra url parameters
    // this.globalCallbacks();
    this.detectUID();
    this.setParam('cpguid', this.uid);
    this.setParam('pr', this.settings.preview === true ? 1 : 0);
    this.setParamsFromSettings();

    this.optionalParameters = {
        'h': this.screenHeight.toString(),
        'w': this.screenWidth.toString(),
        'it': encodeURI(this.settings.it),
        'key': encodeURI(this.settings.key),
        'm': this.isMobile ? '1' : '0',
        'r': encodeURI(this.referrer),
        'callback': '?',
    }

    this.setURLS();
    this.setLockFunctions();
    //this.detectScriptDomain();

    this.body = document.getElementsByTagName('body')[0];
    this.head = document.getElementsByTagName('head')[0];

    this.constructed = false;


    if (parseInt(this.settings.it) > 0 && this.settings.construct !== false) {
        this.loadBody();
        this.loadHTML();
        this.constructed = true;
    }

}

CPBContentLocker.prototype = {
    constructor: CPBContentLocker,
    log: function (msg) {
        if (typeof window['console'] !== 'undefined') {
            window['console'].log(msg);
        }
    },
    addCallback: function (callback) {
        this.callbacks.push(callback);
    },
    getSettings: function () {
        if(typeof window['CPABUILDSETTINGS'] === 'object'){
            return window['CPABUILDSETTINGS'];
        }
        var preg = /[A-Za-z]{5}_[A-Za-z]{3}_[A-Za-z]{5}c/;
        var k = Object.keys(window);
        for (var kCounter = 0; kCounter < k.length; kCounter++) {
            if(k[kCounter].match(preg)){
                return window[k[kCounter]];
            }
        }
    },
    setLockFunctions: function () {
        var t=this;
        for (var kCounter = 0; kCounter < this.locks.length; kCounter++) {
                var k ='_'+this.locks[kCounter];
                window[k]=function (){t.openLocker();}
        }
    },
    callback: function (event, data) {
        for (var cbCounter = 0; cbCounter < this.callbacks.length; cbCounter++) {
            var c = this.callbacks[cbCounter];
            if (typeof c === 'function') {
                c(event, data);
            }
        }
    },
    globalCallbacks: function () {
        this.addCallback(function (event, data) {
            console.log(event, data);
            if (event === 'loadHTML') {

            }
        })
    },
    detectUID: function () {
        // var n = "_cpguid";
        // var c = this.getCookie(n);
        // if (typeof c === "string" && c) {
        //     this.uid = c;
        //     return;
        // }
        //this.uid = this.generateUID();
        // this.setCookie(n, this.uid, 10);
    },
    getDomainFromURL: function (url) {
        var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        return matches && matches[1];
    },
    detectScriptDomain: function () {
        var s = document.getElementsByTagName("script");
        var d = this.getDomainFromURL(s[s.length - 1].src);
        if (d && d.length) {
            this.scriptDomain = d;
        }
    },
    mobileCheck: function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    },
    paramsToQuery: function (params) {
        if (!params) return "";
        var q = [];
        for (var k in params) {
            var value = params[k];
            q.push(encodeURIComponent(k) + "=" + encodeURIComponent(value));
        }
        return q.join("&");
    },
    getQueryParam: function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results) return '';
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    loadBody: function () {
        var thisPass = this;
        this.body = document.getElementsByTagName('body')[0];
        if (typeof this.body == "undefined") {
            setTimeout(function () {
                thisPass.loadBody()
            }, 5);
            return false;
        }
    },
    setParam: function (key, value) {
        this.extraParams[key] = value;
        return this;
    },
    loadHTML: function () {
        var id = "xfMAINJS";
        this.removeElByID(id);
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.urls.js;
        script.id = id;
        this.head.appendChild(script);
        this.callback('loadHTML', {});
        this.loadGlobalCSS();
    },
    loadGlobalCSS: function () {
        //Global CSS
        var id = "xfGLOBALSTYLE";
        if (!document.getElementById(id)) {
            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = this.urls.css;
            l.id = "xfGLOBALSTYLE";
            this.head.appendChild(l);
            this.callback('loadGlobalCSS', {});
        }
    },
    generateUID: function () {
        return ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(
            -3) + ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(
            -3) + ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3);
    },
    checkLead: function (testing) {
        var script = document.createElement('script');
        var url = this.urls.check + new Date().getTime();
        if (testing === 'testing') {
            url += '&testing=1';
        }
        this.removeElByID("xfLEADCHECK");
        script.id = "xfLEADCHECK";
        script.type = 'text/javascript';
        script.src = url;
        this.head.appendChild(script);
        this.callback('checkLead', {});
    },

    openLocker: function () {
        var thisPass = this;
        if (!thisPass.isLoaded) {
            setTimeout(function () {
                thisPass.openLocker();
                thisPass.callback('openLocker', {});
            }, 5);
            return false;
        }

        this.iframe.setAttribute("src", this.urls.iframe);

        this.modalContainer.style.display = "block";
        this.modal.className = "";

        this.modal.style.display = "block";
        if (typeof this.body !== "undefined") {
            this.body.className += ' xfBodyModalOpen';
        }
        setTimeout(function () {
            thisPass.modal.className = "xfAnimation xfShow";
        }, 50);

    },
    closeLocker: function () {
        var thisPass = this;
        this.modal.className = "fadeOut";
        this.callback('closeLocker', {});
        if (typeof this.body !== "undefined") {
            this.body.className = this.body.className.replace(/\bxfBodyModalOpen\b/, '');
        }
        setTimeout(function () {
            thisPass.modal.style.display = "none";
        }, 550);
    },
    encode: function (str) {
        var encoded = "";
        for (i = 0; i < str.length; i++) {
            var a = str.charCodeAt(i);
            var b = a ^ 117;    // bitwise XOR with any number, e.g. 123
            encoded = encoded + String.fromCharCode(b);
        }
        return encoded;
    },
    decode64: function (encoded) {
        var decoded = "";
        encoded = atob(encoded);
        for (i = 0; i < encoded.length; i++) {
            var a = encoded.charCodeAt(i);
            var b = a ^ 117;    // bitwise XOR with any number, e.g. 123
            decoded = decoded + String.fromCharCode(b);
        }
        return decoded;
    },
    onSettingsAndHTMLLoaded() {
        //right click
        if (parseInt(this.getValue('disable_right_click')) === 1) {
            document.addEventListener('contextmenu', event => event.preventDefault());
        }
        //escape key
        if (parseInt(this.getValue(
            "escape_key_close")) === 1 || this.settings.testing === 1 || this.settings.escapeOverwrite === true) {
            document.onkeydown = function (evt) {
                evt = evt || window.event;
                var isEscape = false;
                if ("key" in evt) {
                    isEscape = (evt.key === "Escape" || evt.key === "Esc");
                } else {
                    isEscape = (evt.keyCode === 27);
                }
                if (isEscape) {
                    this.closeLocker();
                }
            };
        }
    },
    onVarsChange: function () {
        var thisPass = this;

        this.modalContainer = document.getElementById("xf_MODAL_CONTAINER");
        this.modal = document.getElementById("xf_MODAL");
        this.modalContent = document.getElementById("xfMODALCONTENT");
        this.iframe = document.getElementById("xfOFFERS");



        this.modalContent.className = this.getValue("animation");

        setTimeout(function () {
            thisPass.isLoaded = true
        }, 500);


        var cssRules = [];

        for (var key in thisPass.defaultSettings) {
            // skip loop if the property is from prototype
            if (!thisPass.defaultSettings.hasOwnProperty(key)) continue;
            var obj = thisPass.defaultSettings[key];

            if (typeof obj.css == "object" && obj.for == "html") {
                var value = thisPass.getValue(key);
                if (obj.css.rule == "background-image" && value) {
                    value = "url('" + value + "')";
                }
                if (value && typeof obj.css.format === "string") {
                    value = obj.css.format.replace('%value%', value);
                }
                if (value) {
                    cssRules.push({
                        target: obj.css.target,
                        "rule": obj.css.rule,
                        "value": value
                    });
                }

            }
        }
        thisPass.setCSSRules(cssRules);
        if (typeof this.defaultSettings["content_locker_title_text"] != "undefined"){
            document.getElementById( "xfMODALTITLE").innerHTML = thisPass.getValue("content_locker_title_text");
        }
        if (typeof this.defaultSettings["content_locker_footer_text"] != "undefined"){
            document.getElementById( "xfMODALFOOTERTEXT").innerHTML = thisPass.getValue("content_locker_footer_text");
        }
        if (typeof this.defaultSettings["overlay_color"] != "undefined" && typeof this.defaultSettings["overlay_opacity"] != "undefined") {
            var opacity = thisPass.getValue("overlay_opacity");
            var hex = thisPass.getValue("overlay_color");
            var rgba = thisPass.convertHex(hex, opacity);

            document.getElementById( "xfSettingsCSS").innerHTML += "#xf_MODAL_CONTAINER #xf_MODAL {background-color: " + rgba + " }";
        }

        if (this.isMobile) {
            this.modalContainer.className += " xf_MODAL_CONTAINER_MOBILE"
        }
        if (typeof this.userSettings["number_offers_required"] != "undefined") {
            this.requiredLeads = parseInt(this.userSettings["number_offers_required"]);
        }
        if (typeof this.userSettings["payout_required"] != "undefined") {
            this.requiredPoints = parseInt(this.userSettings["payout_required"]);
        }
        setTimeout(function () {
            thisPass.checkLead()
        }, 2000);
        //Escape Key

        this.onSettingsAndHTMLLoaded();

    },
    getValue: function (key) {
        if (typeof this.defaultSettings[key] == "undefined") {
            this.log("ERROR - No default settings for key " + key);
            return "";
        }
        if (typeof this.userSettings[key] !== "undefined" && this.userSettings[key]) {
            return this.userSettings[key];
        }
        return this.defaultSettings[key]['default'];
    },
    changeHTML: function (html) {
        document.getElementById("xfMODALBODY").innerHTML = html;
    },
    setCSSRules: function (cssRules) {
        var textRules = [];
        var id = "xfSettingsCSS";
        this.removeElByID(id);
        if (cssRules.length > 0) {
            cssRules.map(function (rule) {
                var text = "#xf_MODAL_CONTAINER " + rule.target + "{" + rule.rule + ":" + rule.value + "}";
                textRules.push(text);
            });
        }
        var animationDuration = parseInt(this.getValue("animation_duration"));
        var animationDurationCSS = "#xf_MODAL_CONTAINER #xfMODALCONTENT{" + "animation-duration: " + animationDuration + "ms;" + "-webkit-transition: all " + animationDuration + "ms;" + "transition: all " + animationDuration + "ms;" + "transition-duration: " + animationDuration + "ms;}";

        textRules.push(animationDurationCSS);
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = id;
        style.innerHTML = textRules.join("\n\n");
        this.head.appendChild(style);
    },
    removeElByID: function (id) {
        var elem = document.getElementById(id);
        if (elem) {
            elem.parentElement.removeChild(elem);
        }
    },
    reset: function () {
        this.removeElByID("xf_MODAL_CONTAINER");
        xfContentLocker = new CPBContentLocker();
    },
    addCompletions: function (arr) {
        if (this.constructed === false) {
            //Dont run anything if not constructed
            return false;
        }
        var arrayLength = arr.length;
        var newLeads = false;
        for (var i = 0; i < arrayLength; i++) {
            var visitor_id = parseInt(arr[i].visitor_id);
            var lead_id = parseInt(arr[i].lead_id);
            var points = parseInt(arr[i].points);
            if (this.completedLeads.indexOf(lead_id) == -1) {
                //New lead!
                this.visitor_id = visitor_id;
                newLeads = true;

                this.completedLeads.push(lead_id);
                this.completedPoints += points;
            }
        }
        if (newLeads) {
            this.checkComplete();
        }
    },
    checkComplete: function () {
        if (this.completedLeads.length < this.requiredLeads) {
            alert("Completed " + this.completedLeads.length + " out of " + this.requiredLeads + " offers!");
        } else if (this.completedPoints < this.requiredPoints) {
            alert("Completed " + this.completedPoints + " out of " + this.requiredPoints + " points!");
        } else {
            this.offersComplete({
                visitor_id: this.visitor_id,
                points: this.completedPoints,
                leads: this.completedLeads
            });
        }
    },
    convertHex: function (hex, opacity) {
        opacity = parseFloat(opacity);
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    },
    offersComplete: function (data) {
        var closeType = this.getValue('onClose');
        var url;
        if (typeof this.settings.onComplete == "function") {
            var cont = this.settings.onComplete(data);
            if (cont === false) {
                return false;
            }
        }
        if (typeof xfComplete == "function") {
            xfComplete();
        }
        if (typeof this.settings.redirect !== "undefined") {
            url = this.settings.redirect;
            window.location = url;
            this.changeHTML("Offer complete! <a href='" + url + "'>Click here</a> to continue");
            return false;
        }
        if (closeType === "close_locker") {
            this.closeLocker();
            return false;
        }
        if (closeType === "redirect") {
            url = this.getValue('onCloseURL');
            url = url.replace('%lead_id%', this.completedLeads[0]);
            url = url.replace('%visitor_id%', this.visitor_id);
            window.location = url;
            this.changeHTML("Offer complete! <a href='" + url + "'>Click here</a> to continue");
            return false;
        }
        this.callback('offersComplete', {});
    },
    getIframeHTML: function () {
        return '<iframe src="' + this.urls.iframeOnly + '" height="100%" marginwidth="0" marginheight="0" align="middle" frameborder="0" width="100%" ></iframe>';
    },
    setParamsFromSettings: function () {
        if (typeof this.settings.params == 'object') {
            var k;
            for (k in this.settings.params) {
                var value = this.settings.params[k];
                this.setParam(k, value);
            }
        }
        var i;
        for (i = 1; i <= 4; i++) {
            var iKey = 's' + i;
            if (!this.extraParams[iKey]) {
                var p = this.getQueryParam(iKey);
                if (p !== '') this.extraParams[iKey] = p;
            }
        }

    },
    getParamString: function (arrayOfKeys) {
        var i;
        var p = [];
        for (i = 0; i < arrayOfKeys.length; i++) {
            var key = arrayOfKeys[i];
            var value = this.optionalParameters[key];
            p.push(key + '=' + value);
        }
        return p.join("&");
    },
    setURLS: function () {
        //var p = this.protocol + this.d3 + "/public/";
        var p = "https://" + this.d3 + "/public/";
        var q = this.paramsToQuery(this.extraParams);

        this.urls.iframe = p + "ct?" + q + '&' + this.getParamString([
            'it',
            'w',
            'h',
            'key',
            'm',
            'r'
        ]);
        this.urls.feed = p + "f_it?" + q + '&' + this.getParamString([
            'it',
            'w',
            'h',
            'key',
            'm',
            'callback'
        ]);
        this.urls.iframeOnly = p + "i_fr?" + q + '&' + this.getParamString([
            'it',
            'w',
            'h',
            'key',
            'm',
            'r'
        ]);
        this.urls.js = p + "external/v2/" + ((this.settings.preview === true) ? "preview" : 'htmlxf') + '.' + this.settings.it + "." + this.settings.key + "." + this.optionalParameters.m + "." + "js" + (this.settings.preview === true ? ("?t=" + (new Date()).getTime()) : '')

        this.urls.css = p + "external/css_frontXF.css";
        this.urls.specific_css = p + "clockers/";
        this.urls.check = p + "external/check.php?" + this.getParamString(['it']) + "&time=";
        this.urls.impression = p + "external/impression.php?" + this.getParamString(['it']) + "&time=";
        this.urls.guid = p + "guid?" + q + '&e=';

        return this;
    },
    setTemplateCSSDir: function (dir) {
        var url = this.urls.specific_css + dir + "/cssXF.css";
        var specificCSSID = "xfSPECIFICSTYLE";

        var l = document.createElement("link");
        l.setAttribute("data-it", this.settings.it);
        l.rel = "stylesheet";
        l.id = specificCSSID;
        l.href = url;
        document.getElementsByTagName("head")[0].appendChild(l);

    },
    setCookie: function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


};
xfContentLocker = new CPBContentLocker();


function xfLock() {
    xfContentLocker.openLocker();
}

function xfGetFeedURL() {
    return xfContentLocker.urls.feed;
}

function xfGetIframeURL() {
    return xfContentLocker.urls.iframe;
}

function xfGetIframeHTML() {
    return xfContentLocker.getIframeHTML();
}

function xfUnlock() {
    xfContentLocker.closeLocker();
}

function xfOfferComplete(data) {
    //CPABUILDContentLocker.offerComplete(data);
}

function xfOffersComplete(arr) {
    xfContentLocker.addCompletions(arr);
}

function xfCheckForLead(testing) {
    xfContentLocker.checkLead(testing);
}

function xfComplete() {
    //Rewrite this function, it's called when locker has completed requirements.
}

function CPABuildLock() {
    xfLock();
}

function CPABuildGetFeedURL() {
    return xfGetFeedURL();
}

function CPABuildGetIframeURL() {
    return xfGetFeedURL();
}

function CPABuildGetIframeHTML() {
    return xfGetIframeHTML();
}

function CPABuildUnlock() {
    xfUnlock();
}

function CPABuildOfferComplete(data) {
    xfOfferComplete(data);
    //CPABUILDContentLocker.offerComplete(data);
}

function CPABuildOffersComplete(arr) {
    xfOffersComplete(arr);
    CPABUILDContentLocker.addCompletions(arr);
}

function CPABuildCheckForLead(testing) {
    xfCheckForLead(testing);
}

function CPABuildComplete() {
    xfComplete();
    //Rewrite this function, it's called when locker has completed requirements.
}