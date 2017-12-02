
//*******************************************************************
//      Daddelkiste Duomatic Version 0.93 
//      Javascript implementation of a penny arcade casino game
//
//      Copyright (C) 2017 Rainer Wess, Osnabrück, Germany
//      Open Source / Freeware - released under GPL 2.0
//*******************************************************************

var geld = 0;
var punkte = 0;
var ss = 0;
var gewinn = 0;
var einsatz = 20;

// Variablen für Scheibenpositionen, Zufallszahl von 1 bis 12 (0 löscht Scheibe)
var s1 = 0; // left disc
var s2 = 0; // disc in the middle
var s3 = 0; // right disc
var s_stop = 1; // Zählvariable fürs stoppen der Scheiben per Stop-Taste

// Definition der Scheibenbelegung
// 999 = Sonne
var disc = [];
disc[0] = [0, 999, 30, 120, 30, 999, 30, 60, 30, 999, 30, 120, 30]; // links oben
disc[1] = [0, 999, 20, 80, 20, 160, 20, 40, 20, 40, 80, 20, 40]; // links unten
disc[2] = [0, 999, 20, 30, 60, 30, 160, 20, 40, 30, 80, 20, 120]; // mitte
disc[3] = [0, 999, 30, 120, 30, 999, 30, 60, 30, 999, 30, 120, 30]; // rechts oben
disc[4] = [0, 999, 20, 80, 20, 160, 20, 40, 20, 40, 80, 20, 40]; // rechts unten

// Mode Points
// Aus gs die Punkte ermitteln
var gpu_points = [0, 30, 60, 120, 240, 500, 1000, 2000, 4000, 9000, 0, 20, 40, 80, 160, 300, 600, 1200, 2500, 5000, 10000];

// Mode: Game 
// Aus gs die Punkte ermitteln
var gpu_games = [0, 30, 60, 120, 240, 0, 0, 0, 0, 0, 0, 20, 40, 80, 160, 0, 0, 0, 0, 0, 0];

// Mode: Game
// Aus gs die Sonderspiele ermitteln
var gss = [0, 0, 0, 0, 0, 5, 10, 20, 40, 90, 0, 0, 0, 0, 0, 3, 6, 12, 25, 50, 100];


var gam = 0; // Gewinn-Feldnummer bei der großen Ausspielung mitte (Felder 21-28)

// Ausspielreihenfolge GA rechts(4-9)/links(15-20)/mitte(21-28)
var arf = [0, 0, 0, 0, 4, 8, 6, 9, 5, 7, 0, 0, 0, 0, 0, 15, 19, 17, 20, 16, 18, 21, 26, 23, 28, 24, 27, 22, 25];

var gs = 0; // Gewinnstufe, Kern der Risikofunktion, 0-9 fur rechts, 10-20 links
var rsr = 5; // Risikostufe rechts, default Wert, bis zum Erreichen von 5 SS
var rsl = 15; // Risikostufe links, default Wert, bis zum Erreichen von 3 SS

// *****************
// Boolsche Variablen

var startautomatik = false; // Startet automatisch das nächste Spiel
var autostart = false; // startet die erste Scheibe nochmal, wenn keine Sonne
var risikoautomatik = false;

var test = false; // Für Funktiontest
var win = false; // Zufallsvariable, bestimmt ob risiko erfolgreich
var riskiert = false; // true wenn Risikotaste während Risikophase gedrückt wurde
// und in dem Bereich in dem die Risikoautomatik aktiv ist
var risikophase = false;
var spiel_laueft_noch = false; // ist praktisch während des ganzen Spiels true, geht nur unmittelbar
// vor start des nächsten Spiels kurz auf false, verhindert Mehrfachstarts
var teilgewinn_angenommen = false; // entprellt und verzoegert das Herunterteilen
var mtg; // mit Teilgewinn
var gewinn_angenommen = false; // verhintert das mehrfache Annehmen eines Gewinnes
var hoechststufe = false; // Bei Höchstgewinn bleibt Gerät trotz Automatikstart stehen bis START gedrückt wird
//  steuert Animation und Sound bei Gewinn von 90 und 100 Sonderspielen
var ausspielung = false; // dient zum stoppen von allen Ausspielungen
var ga = false; // true bei grossen Ausspielungen, wird benotigt wegen Ausspielreihenfolge arf 
var gf = false; // gestreiftes Feld auf mittlerer Scheibe,  kein sonstiger Gewinn, nur in Sonderspielen relevant
var sonderspiel = false;
var in_ss_gewonnen = false;

var counter = 0; // wird fur die Risikoautomatik und automatische Gewinnannahme verwendet
var ns = 0; // Null Selektor in Risikophase (rechte oder linke Null)
var pu_ang = 0;
var pu_neu = 0;
var pu_hoch = 0; // wird fürs hochzählen der Punkte benötigt
var intP_hoch; // Interval wird fürs hochzählen der Punkte benötigt


var ss_ang = 0;
var ss_neu = 0;
var ss_hoch = 0; // wird fürs hochzählen der Sonderspiele benötigt
var intS_hoch; // wird fürs hochzählen der Sonderspiele benötigt

var lo = true; // fur Lichtanimation bei Hoechststufe
var ani = true; // fur Lichtanimation bei Sonderspielen
var intS; // fur Lichtanimation bei Sonderspielen
var intH; // Interval fur Lichtanimation bei Hoechststufe

// ************************
// Variablen die über Einstelldialog einstellbar sind:

// games oder points
var game_mode = "games";
var games = true; 
// green, blue, gray 
var color_theme = "black";

var risiko_win = 50; // Prozent für Gewinn bei Risiko, default 50 (Risiko 1:1)
// dieser Wert kann nach eigenem Geschmack verändert werden
// bei Erhöhung des Wertes läßt sich leichter Hochdrücken
var spiel_tempo = 100; // Geschwindigkeit des Spielablaufs (50,75,100,125,150)
var auto_risiko = 4; // nach wieviel Sekunden Risikoautomatik
// auto_risiko muss kleiner sein als auto_annahme!!!
var auto_annahme = 6; // nach wieviel Sekunden automatische Gewinnannahme

// *****************
// Farbdefinitionen für die Tasten
var btn_rot_aus = "#990000"; // Farbe der roten Button passiv
var btn_rot_auto = "#BB0000"; // Farbe der roten Button bei Automatik
var btn_rot_an = "#FF0000"; // Farbe der roten Button aktiv
var btn_gelb_aus = "#997A00"; // Farbe der gelben Risiko-Buttons passiv
var btn_gelb_auto = "#CCA300"; // Farbe der gelben Button bei Automatik
var btn_gelb_an = "#FFCC00"; // Farbe der gelben Risiko-Buttons aktiv
// Alternative Farben
// 
// Für die Farbschemen
var bg_gruen = "#003322";
var bg_blau = "#002233";
var bg_black = "#003030";
var btn_gruen_aus = "#006600";
var btn_gruen_an = "#009900";
var btn_blau_aus = "#2F4F4F";
var btn_blau_an = "#4D8080";
var btn_grau_aus = "#333333";
var btn_grau_an = "#555555";

// nützliche kleine Helfer Funktionen

function id(id) {
	return document.getElementById(id);
}

function bgImg(n, i) {
	return id("feld" + n).style.backgroundImage = "url(" + Risiko[i].src + ")";
}

function hide(hid) {
	id(hid).style.visibility = "hidden";
}

function show(sid) {
	id(sid).style.visibility = "visible";
}

function button_text(bid, btxt) {
	id(bid).value = btxt;
}

function button_color(bid, bcolor) {
	id(bid).style.backgroundColor = bcolor;
}

function setColor(sid, scolor) {
	id(sid).style.color = scolor;
}

function setBgColor(sid, scolor) {
	id(sid).style.backgroundColor = scolor;
}

function setInfo(txt) {
	id("Info").innerHTML = txt;
}

function setPF(pid, ptxt) {
	id(pid).innerHTML = ptxt;
}

// Multi-Language
function setPfText() {
	
	//setPF("L_Geraet", plfText[0]);
	//setPF("L_Typ", plfText[1]);
	setPF("L_Geld", plfText[2]);
	setPF("L_Punkte", plfText[3]);
	setPF("L_Spiele", plfText[4]);
	setPF("L_Gewinn", plfText[5]);
	setPF("L_Einsatz", plfText[6]);
	setPF("L_GAL", plfText[8]);
	setPF("L_GAR", plfText[8]);
	setPF("L_KAL", plfText[8]);
	setPF("L_KAR", plfText[8]);
}

// Multi-Language
function setCfgText() {

	setPF("c1a", cfgText[0]);
	setPF("c1b", cfgText[0]);
	setPF("c1c", cfgText[0]);
	setPF("c1d", cfgText[0]);
	setPF("c2a", cfgText[1]);
	setPF("c2b", cfgText[1]);
	setPF("c2c", cfgText[1]);
	setPF("c2d", cfgText[1]);
	setPF("c3a", cfgText[2]);
	setPF("c3b", cfgText[2]);
	setPF("c3c", cfgText[2]);
	setPF("c3d", cfgText[2]);
	setPF("c4a", cfgText[3]);
	setPF("c4b", cfgText[3]);
	setPF("c4c", cfgText[3]);
	setPF("c4d", cfgText[3]);
	setPF("game_mode", cfgText[4]);
	setPF("color_theme", cfgText[5]);
	setPF("winning", cfgText[6]);
	setPF("speed", cfgText[7]);
	setPF("r_auto", cfgText[8]);
	setPF("t_auto", cfgText[9]);
	setPF("c_instr", c_instr);
	setPF("c_hint", c_hint);
	setPF("c_think", c_think);
	setPF("c_github", c_github);
}

// Multi-Language
function setBtnText() {
	
	button_text("start_button", btnText[0]);
	button_text("mitte_button", btnText[1]);
	button_text("stop_button", btnText[2]);
	button_text("risiko_button1", btnText[3]);
	button_text("risiko_button2", btnText[3]);
	button_text("geldeinwurf", btnText[6]);
	button_text("cfg_button", btnText[7]);
	button_text("exit1", btnText[8]);
	button_text("exit2", btnText[8]);
	button_text("exit3", btnText[8]);
	button_text("exit4", btnText[8]);
	button_text("mode_games", btnText[9]);
	button_text("mode_points", btnText[10]);
	button_text("theme_green", btnText[11]);
	button_text("theme_blue", btnText[12]);
    button_text("theme_black", btnText[13]); // petrol
	
}

function change_game_mode(mode) {

	game_mode = mode;

	if (mode == "games") games = true;
	else games = false;
	
	var felder_games = ["0", "30", "60", "120", "240", "5 S", "10 S", "20 S", "40 S", "90 S", "0", "20", "40", "80", "160", "3 S", "6 S", "12 S", "25 S", "50 S", "100 S", "10 S", "12 S", "20 S", "25 S", "40 S", "50 S", "90 S", "100 S"];

	var felder_points = ["0", "30", "60", "120", "240", "500", "1000", "2000", "4000", "9000", "0", "20", "40", "80", "160", "300", "600", "1200", "2500", "5000", "10000", "1000", "1200", "2000", "2500", "4000", "5000", "9000", "10000"];

	if (games) {
		// setPF("Typ", "Duomatic: Games");
		show("L_Spiele");
		show("Spiele");
		button_color("mode_games", btn_gruen_an);
		button_color("mode_points", btn_grau_aus);
		for (var i = 0; i <= 28; i++) {
			setPF("feld" + i, felder_games[i]);
		}
	}
	else {
		// setPF("Typ", "Duomatic: Points");
		hide("L_Spiele");
		hide("Spiele");
		button_color("mode_points", btn_gruen_an);
		button_color("mode_games", btn_grau_aus);
		for (var i = 0; i <= 28; i++) {
			setPF("feld" + i, felder_points[i]);
		}

	}
}


function change_color_theme(theme) {

	color_theme = theme;
	var bg_color = "#111111";

	if (theme == "green") {
		bg_color = bg_gruen;
		button_color("theme_green", btn_gruen_an);
		button_color("theme_blue", btn_grau_aus);
		button_color("theme_black", btn_grau_aus);
	}
	if (theme == "blue") {
		bg_color = bg_blau;
		button_color("theme_green", btn_grau_aus);
		button_color("theme_blue", btn_gruen_an);
		button_color("theme_black", btn_grau_aus);
		
	}
	if (theme == "black") {
		bg_color = bg_black;
		button_color("theme_green", btn_grau_aus);
		button_color("theme_blue", btn_grau_aus);
		button_color("theme_black", btn_gruen_an);
	}

		setBgColor("Geraet", bg_color);
		setBgColor("options", bg_color);
		setBgColor("instruction",bg_color);
		setBgColor("think", bg_color);
        setBgColor("about", bg_color);
	
}

function saveSettings() {
	// Check browser support
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem("game_mode", String(game_mode));
		localStorage.setItem("color_theme", String(color_theme));
		localStorage.setItem("risiko_win", String(risiko_win));
		localStorage.setItem("spiel_tempo", String(spiel_tempo));
		localStorage.setItem("auto_risiko", String(auto_risiko));
		localStorage.setItem("auto_annahme", String(auto_annahme));
		setInfo(infoText[0]);
	}
	else setInfo("Could not save settings");

}

function loadSettings() {

	if (localStorage.game_mode) {
		game_mode = (localStorage.game_mode);
	}
	if (localStorage.color_theme) {
		color_theme = (localStorage.color_theme);
	}
	if (localStorage.risiko_win) {
		risiko_win = Number(localStorage.risiko_win);
	}
	if (localStorage.spiel_tempo) {
		spiel_tempo = Number(localStorage.spiel_tempo);
	}
	if (localStorage.spiel_tempo) {
		auto_risiko = Number(localStorage.auto_risiko);
	}
	if (localStorage.spiel_tempo) {
		auto_annahme = Number(localStorage.auto_annahme);
	}

	id("risiko_win").value = risiko_win;
	id("rw").value = String(risiko_win) + " %";
	id("spiel_tempo").value = spiel_tempo;
	id("spt").value = String(spiel_tempo) + " %";
	id("auto_risiko").value = auto_risiko;
	id("ar").value = String(auto_risiko) + cfgText[10];
	id("auto_annahme").value = auto_annahme;
	id("aga").value = String(auto_annahme) + cfgText[10];
}

function zum_starten_auffordern() {
	setInfo(infoText[3]);
}

function zeige_Geld() {
	id("Geld").value = String(geld) + ".00";
}

function zeige_Punkte() {
	id("Punkte").value = String(punkte);
}

function zeige_Gewinn() {
	id("Gewinn").value = String(gewinn);
}

function zeige_Spiele() {
	id("Spiele").value = String(ss);
}

function zeige_Einsatz() {
	id("Einsatz").value = String(einsatz);
}

function zeige_feld(nr, status) {

	if (risikoautomatik && (nr == rsr || nr == rsl)) { // Bild mit grunem Balken 
		if (status == 1) bgImg(nr, 3);
		else bgImg(nr, 2);
	}
	else { // ohne grünen Balken
		if (status == 1) bgImg(nr, 1);
		else bgImg(nr, 0);
	}
}

function zeige_felder(von, bis, status) {
	// z.B (0,9,0) schaltet die Felder (von 0, bis 9, aus 0)

	for (i = von; i <= bis; i++) {
		zeige_feld(i, status);
	}
}

function stop_ausp_ani() {
	
    setColor("L_KAL", "#FFCC00");
	setColor("L_KAR", "#FFCC00");
	setColor("L_GAL", "#FF0000");
	setColor("L_GAR", "#FF0000");
}

function ani_ss() {

	ani = (ani) ? false : true;

	if (ani) setColor("L_Spiele", "#FF0000");
	else setColor("L_Spiele", "#FFCC00");
}

function lichtorgel() {

	lo = (lo) ? false : true;

	for (i = 0; i <= 20; i++) {
		if (lo) {
			(i % 2 == 0) ? zeige_feld(i, 1): zeige_feld(i, 0);
		}
		else {
			(i % 2 == 0) ? zeige_feld(i, 0): zeige_feld(i, 1);
		}
	}
}

function reset() {

	// setzt die Formularfelder neu, die bei einem reload der Webseite
	// sonst mit falschen Werten gefüllt bleiben

	setInfo(infoText[1]);
	geld = 0;
	zeige_Geld();
	punkte = 0;
	zeige_Punkte();
	gewinn = 0;
	zeige_Gewinn();
	ss = 0;
	zeige_Spiele();

	loadSettings();
	
	change_game_mode(game_mode);
	change_color_theme(color_theme);
	
	// For localisation de, en usw.
	setBtnText();
	setPfText();
	setCfgText();

}

function funktionstest(nr) {
	
// 0 = kleine Ausspielung links
// 1 = kleine Ausspielung rechts
// 2 = grosse Ausspielung links
// 3 = grosse Ausspielung rechts
// 4 = grosse Ausspielung mitte

	if (!spiel_laueft_noch) {
		
	    test = true;
	
	    var s1_test = [3,2,1,9,1];
	    var s2_test = [1,1,1,1,1];
	    var s3_test = [4,2,5,5,1];
	
	    s1 = s1_test[nr];
	    s2 = s2_test[nr];
	    s3 = s3_test[nr];
	
	    punkte = punkte + 20;
        starte_Spiel();
        
    }
}

function umbuchen_animieren2() {

	id("Punkte").value = "> > " + String(punkte);
	setTimeout("Geld_zu_Punkte()", 8 * spiel_tempo);
}

function umbuchen_animieren1() {

	id("Punkte").value = "> >   " + String(punkte);
	setInfo(infoText[2]);
	setTimeout("umbuchen_animieren2()", 8 * spiel_tempo);
}

function Geldeinwurf() {

	geld = geld + 10;
	zeige_Geld();
	button_color("geldeinwurf", btn_gruen_aus);
	setTimeout("umbuchen_animieren1()", 8 * spiel_tempo);
}

function zeige_Scheibe(i, position) {

	audio_stop();
	id("scheibe" + i).src = Scheibe[i][position].src;
	if (i != 2) id("scheibe" + (i + 1)).src = Scheibe[i + 1][position].src;
	if (position != 0) audio_play("walzenstop");
	// position = 0 entspricht Scheibe löschen, leeres Bild
}

function stop_Scheibe_1() {

	if (s_stop == 1) {
		s_stop++;
		if(!test) s1 = zufallszahl(1, 12);
		zeige_Scheibe(0, s1);

		// Falls Autostart eingeschaltet und auf Scheibe1 keine Sonne
		if (autostart && !(s1 == 1 || s1 == 5 || s1 == 9)) {
			setTimeout("zeige_Scheibe(0, 0);", 7 * spiel_tempo);
			if(!test) s1 = zufallszahl(1, 12);
			setTimeout("zeige_Scheibe(0, s1);", 15 * spiel_tempo);
		}
		setTimeout("stop_Scheibe_3()", 10 * spiel_tempo);
	}
}

function stop_Scheibe_2() {

	if (s_stop == 3) {
		s_stop++;
		if(!test) s2 = zufallszahl(1, 12);
		zeige_Scheibe(2, s2);
		button_color("stop_button", btn_rot_aus);
		setTimeout("Gewinnermittlung();", 10 * spiel_tempo);

	}
}

function stop_Scheibe_3() {

	if (s_stop == 2) {
		s_stop++;
		if(!test) s3 = zufallszahl(1, 12);
		zeige_Scheibe(3, s3);
		setTimeout("stop_Scheibe_2()", 15 * spiel_tempo);
	}
}

function Scheiben_loeschen() {

	for (var i = 0; i <= 4; i++) {
		id("scheibe" + i).src = Scheibe[i][0].src;
	}
	button_color("stop_button", btn_rot_an);
	setTimeout("stop_Scheibe_1()", 15 * spiel_tempo);
}

function ausspiel_stop() {
	ausspielung = false;   
	}


function zufallszahl(min, max) {

	// liefert tatsächlich gleichverteilte Zufallszahlen
	// var x = Math.floor(Math.random() * (max - min + 1)) + min;
	// siehe: http://aktuell.de.selfhtml.org/artikel/javascript/zufallszahlen/

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function win_or_loose() {

	return (zufallszahl(1, 100) <= risiko_win) ? true : false;
}

function Geld_zu_Punkte() {

	punkte = punkte + geld * 100;
	geld = 0;
	zeige_Punkte();
	zeige_Geld();

	if (!spiel_laueft_noch) {
		setTimeout("zum_starten_auffordern();", 3 * spiel_tempo);

		setTimeout("button_color('start_button', btn_rot_an);", 3 * spiel_tempo);
	}
}


function Hoechststufe_zurueck() {

	hoechststufe = false;
	clearInterval(intH);

	audio_stop();

}

function risikotaste_gedrueckt() {

	if (!risikophase) {
		if (risikoautomatik) {
			risikoautomatik = false;
			zeige_feld(rsr, 0);
			zeige_feld(rsl, 0);
			button_color("risiko_button1", btn_gelb_aus);
			button_color("risiko_button2", btn_gelb_aus);
			setInfo(infoText[8]);
		}
		else {
			risikoautomatik = true;
			setze_risikostufe(5);
			setze_risikostufe(15);
			button_color("risiko_button1", btn_gelb_auto);
			button_color("risiko_button2", btn_gelb_auto);
			setInfo(infoText[9]);
		}
	}
	else riskiert = true;
}

function risiko_auto() {

	// Bedingungen notwendig wegen zeitverzögertem Auslösen
	// kann sich inzwischen geändert haben
	if (risikoautomatik && !gewinn_angenommen) riskiert = true;

}

function setze_risikostufe(rs) {

	var rsa;

	if (risikoautomatik) {
		if (rs < 10) {
			rsa = rsr;
			rsr = rs;
			setInfo(infoText[10]);
		}
		else {
			rsa = rsl;
			rsl = rs;
			setInfo(infoText[11]);
		}
		zeige_feld(rsa, 0);
		zeige_feld(rs, 0);
	}
}

function the_end() {

	risikophase = false;
	gf = false;
	test = false;

	audio_stop();

	if (autostart) button_color("mitte_button", btn_rot_auto);
	else button_color("mitte_button", btn_rot_aus);
	button_text("mitte_button", btnText[1]);

	button_color("stop_button", btn_rot_aus);
	button_text("stop_button", btnText[2]);

	if (risikoautomatik) {
		button_color("risiko_button1", btn_gelb_auto);
		button_color("risiko_button2", btn_gelb_auto);
	}
	else {
		button_color("risiko_button1", btn_gelb_aus);
		button_color("risiko_button2", btn_gelb_aus);
	}

	spiel_laueft_noch = false;

	if (punkte < einsatz) {
		button_color("geldeinwurf", btn_gruen_an);
		setTimeout("setInfo(infoText[1]);", 10 * spiel_tempo);
	}
	else if (startautomatik && !hoechststufe) {
		starte_Spiel();
	}
	else {
		button_color("start_button", btn_rot_an);
		zum_starten_auffordern();
	}
}


function ausspiel_gs(gewinnstufe, prozentsatz) {

	// Dieser Funktion werden als Argumente alle Gewinnstufen und 
	// die dazugehörigen Prozentangaben übergeben. Die Funktion
	// zieht dann eine Zufallszahl und ermittelt welche Gewinnstufe
	// die Ausspielung gewonnen hat, diese wird dann als    
	// Rückgabewert zurùckgegeben

	var gw = [];
	var pw = [];
	var a = 0;
	var b = 0;
	var z = zufallszahl(1, 100);

	gewinn_angenommen = false;
	ausspielung = true;
	audio_play("ausspielung");

	for (i = 0; i < arguments.length; i++) {
		(i % 2 == 0) ? gw.push(arguments[i]): pw.push(arguments[i]);
	}

	for (var i = 0; i < pw.length; i++) {
		b = a + pw[i];
		if ((a < z) && (z <= b)) break;
		a = b;
	}

	return gw[i]; // gs

}

function kleine_Ausspielung_links() {
	
	setColor("L_KAL", "#FF0000");
	
	gs = ausspiel_gs(11, 50, 12, 15, 13, 10, 14, 10, 15, 10, 16, 5);
	animiere_ausspielung(11, 16, 11);
	setTimeout("ausspiel_stop();", 20 * spiel_tempo);
}

function kleine_Ausspielung_rechts() {
	
	setColor("L_KAR", "#FF0000");
	
	gs = ausspiel_gs(1, 50, 2, 20, 3, 15, 4, 10, 5, 5);
	animiere_ausspielung(1, 5, 1);
	setTimeout("ausspiel_stop();", 20 * spiel_tempo);
}

function grosse_Ausspielung_links() {

	//   Grosse Ausspielung animieren,
	//    von 3 bis 100 Sonderspiele
	//    extra spannend

	ga = true;
	setInfo(infoText[21]);
	setColor("L_GAL", "#FFCC00");

	gs = ausspiel_gs(15, 50, 16, 15, 17, 10, 18, 10, 19, 10, 20, 5);
	animiere_ausspielung(15, 20, 15);
	setTimeout("ausspiel_stop();", 40 * spiel_tempo);
}

function grosse_Ausspielung_rechts() {

	ga = true;
	setColor("L_GAR", "#FFCC00");
	setInfo(infoText[20]);

	gs = ausspiel_gs(4, 50, 5, 15, 6, 10, 7, 10, 8, 10, 9, 5);
	animiere_ausspielung(4, 9, 4);
	setTimeout("ausspiel_stop();", 40 * spiel_tempo);
}

// Ende Teil 1

function Hoechststufe_erreicht() {

	hoechststufe = true;
	button_color("mitte_button", btn_rot_aus);
	audio_play("hauptgewinn");

	intH = setInterval(lichtorgel, 800);
	setTimeout("Gewinn_annehmen();", 8 * spiel_tempo);

}

function starte_Spiel() {

	gs = 0;
	gewinn = 0;
	ss_neu = 0;
	s_stop = 1;
	
	risikophase = false;
	gewinn_angenommen = false;
	ausspielung = false;
	ga = false;
	
	spiel_tempo = id("spiel_tempo").value;
	
	if (punkte >= einsatz) {

		spiel_laueft_noch = true;
		punkte = punkte - einsatz;
		zeige_Punkte();
		zeige_Gewinn();
		zeige_felder(0, 20, 0);
		setInfo(" ");
		audio_play("abbuchen");
		
		if (hoechststufe) Hoechststufe_zurueck();

		if (startautomatik) button_color("start_button", btn_rot_auto);
		else button_color("start_button", btn_rot_aus);

		if (risikoautomatik) {
			zeige_feld(rsr, 0);
			zeige_feld(rsl, 0);
		}
		if (games) {
			if (ss == 0) {
				in_ss_gewonnen = false;
				sonderspiel = false;
				if (intS) {
					clearInterval(intS);
					setColor("L_Spiele", "#FF0000");
				}
			}

			if (ss == 1 && in_ss_gewonnen == false) {
				setInfo(infoText[21]);
				sonderspiel = true;
			}
			else if (ss > 0) {
				sonderspiel = true;
				ss = ss - 1
				zeige_Spiele();
			}
		}
		setTimeout("Scheiben_loeschen()", spiel_tempo);
	}
	else {
		setInfo(infoText[1]);
		button_color("geldeinwurf", btn_gruen_an);
	}
}

function starttaste_gedrueckt() {

	if (spiel_laueft_noch) {
		if (startautomatik) {
			startautomatik = false;
			button_color("start_button", btn_rot_aus);
			setInfo(infoText[4]);
		}
		else {
			startautomatik = true;
			button_color("start_button", btn_rot_auto);
			setInfo(infoText[5]);
		}
	}
	else if (!spiel_laueft_noch) starte_Spiel();
}

function mittleretaste_gedrueckt() {

	if (!risikophase) {
		if (autostart) {
			autostart = false;
			button_color("mitte_button", btn_rot_aus);
			setInfo(infoText[6]);
		}
		else {
			autostart = true;
			button_color("mitte_button", btn_rot_auto);
			setInfo(infoText[7]);
		}
	}
	else Teilgewinn_annehmen();
}

function stoptaste_gedrueckt() {

	if (ausspielung) ausspiel_stop();
	else if (risikophase || hoechststufe) Gewinn_annehmen();
	else {
		stop_Scheibe_2();
		stop_Scheibe_3();
		stop_Scheibe_1();
	}
}


function pu_hochzaehlen() {

	if (gewinn > pu_hoch) {
		pu_hoch = pu_hoch + 10;
		punkte = punkte + 10;
		zeige_Punkte();
	}
	else {
		clearInterval(intP_hoch);
		zeige_Gewinn();
	    //zeige_feld(gs, 0);

	    audio_play("angenommen");
        setInfo(infoText[12] + gewinn + infoText[16]);
        gewinn =  0;
        if(!ausspielung) { setTimeout("the_end();", 20 * spiel_tempo);
        }
	}
}

function ss_hochzaehlen() {
	if (ss_neu > ss_hoch) {
		ss_hoch++;
		ss++;
		zeige_Spiele();
	}
	else {
		clearInterval(intS_hoch);
		//zeige_feld(gs, 0);
		audio_play("angenommen");
        setInfo(infoText[12] + ss_neu + infoText[17]);
        ss_neu = 0;
        if (!ausspielung) {
        setTimeout("the_end();", 20 * spiel_tempo);
        }
	}
}

function Gewinn_annehmen() {

	if (!gewinn_angenommen && (gewinn > 0 || ss_neu > 0)) {
		gewinn_angenommen = true;
		button_color("stop_button", btn_rot_aus);
		
		if (!hoechststufe) {
			audio_stop();
		}
		 if (games && ss_neu > 0) {
			if (ss_neu > 19) {
		setInfo(infoText[12] + ss_neu + infoText[15]);
		    }
            //ss_annehmen
           	if (ss == 0) {
		            intS = setInterval(ani_ss, 800);
           	}
               ss_hoch = 0
               intS_hoch = setInterval(ss_hochzaehlen, spiel_tempo);
         }
		 else if (gewinn > 0)  {
            // pu_annehmen
            if(gewinn > 1900) {
		         setInfo(infoText[12] + gewinn + infoText[14]);
		    }
	        pu_hoch = 0;
        	intP_hoch = setInterval(pu_hochzaehlen, 10);
          }
	}
}


function Teilgewinn_annehmen() {
   var tg;
   
	if (!teilgewinn_angenommen && !hoechststufe) {
		
	   if (gs == 1 || gs == 11) {
			setInfo(infoText[18]);
		}
		else if (!gewinn_angenommen && ((1 < gs && gs < 9) || (11 < gs && gs < 20))) {
			
			teilgewinn_angenommen = true;
			zeige_feld(gs + 1, 0);
			zeige_feld(gs, 0);
		
			if(games) {
			     if ((1 < gs && gs < 6) || (11 < gs && gs < 16)) {
				
				      if (gs == 5 || gs == 15) ss_neu = 0;
				      gewinn = gpu_points[gs];
     				 tg = gpu_points[gs] - gpu_points[gs - 1];
                      gs = gs - 1;
                      zeige_feld(gs, 1);
				      gewinn = gewinn - tg;
				      punkte = punkte + tg;
				      setInfo(infoText[13] + tg + infoText[16]);
			     }
			     else if ((5 < gs && gs < 9) || (15 < gs && gs < 20)) {
				     tg = gss[gs] - gss[gs - 1];
				     gs = gs - 1;
				
                 	if (ss == 0) {
		                intS = setInterval(ani_ss, 800);
                 	}
                     zeige_feld(gs, 1);
                     ss_neu = ss_neu - tg;
			         ss = ss + tg;
			         setInfo(infoText[13] + tg + infoText[17]);
                }
			}
			else {
				gewinn = gpu_points[gs];
				tg = gpu_points[gs] - gpu_points[gs - 1];
				gs = gs - 1;
			    zeige_feld(gs, 1);
				gewinn = gewinn - tg;
				punkte = punkte + tg;
				setInfo(infoText[13] + tg + infoText[16]);
	       }
           zeige_Punkte();
           zeige_Spiele();                   
           setTimeout("starte_risiko();", 20 * spiel_tempo); 
          
		}
	}
}

function starte_risiko() {
   
	risikophase = true;
	riskiert = false;
	counter = 0;

    zeige_feld(gs, 1);
	audio_stop();

	risiko_win = id("risiko_win").value;
	auto_risiko = id("auto_risiko").value;
	auto_annahme = id("auto_annahme").value;

	if (games) {
		gewinn = gpu_games[gs];
		ss_neu = gss[gs];
	}
	else {
		gewinn = gpu_points[gs];
	}
	
	zeige_Gewinn();

	if (gs == 0 || gs == 10) {
		setTimeout("the_end();", 20 * spiel_tempo);
	}

	win = win_or_loose();

	button_text("stop_button", btnText[5]);

	if (gs == 9 || gs == 20) {
		button_color("stop_button", btn_rot_an);
		Hoechststufe_erreicht();
	}
	else if (((0 < gs && gs < 9) || (10 < gs && gs < 20)) && !gewinn_angenommen) {

		button_color("risiko_button1", btn_gelb_an);
		button_color("risiko_button2", btn_gelb_an);
		button_text("mitte_button", btnText[4]);
		button_color("stop_button", btn_rot_an);

		if ((1 < gs && gs < 9) || (11 < gs && gs < 20)) {
			button_color("mitte_button", btn_rot_an);
		}
		else button_color("mitte_button", btn_rot_aus);
		
		animiere_risiko();
	}

}

function animiere_risiko() {
	
	rfeld = gs + 1;
    ns = (gs > 10) ? 10 : 0;
    audio_stop();
	
	if (!gewinn_angenommen && !teilgewinn_angenommen) {

	    zeige_feld(gs, 0);

		if (counter % 2 == 0) {
			
			zeige_feld(rfeld, 1);
			zeige_feld(ns, 0);
			 audio_play("risiko2");
		}
		else {
			zeige_feld(rfeld, 0);
			zeige_feld(ns, 1);
		    audio_play("risiko1");
		}
		// automatische Gewinnannahme
		counter = counter + 1;
		if (counter > (2 * auto_annahme)) Gewinn_annehmen();
		// Risikoautomatik
		if (counter > (2 * auto_risiko) && risikoautomatik && (gs < rsr || (10 < gs && gs < rsl))) {
			risiko_auto();
		}
		if (riskiert) {
			if (win) {
				gs = gs + 1;
				audio_stop();
				if (games) {
					gewinn = gpu_games[gs];
					ss_neu = gss[gs];
				}
				else {
					gewinn = gpu_points[gs];
				}
				zeige_feld(ns, 0);
				zeige_feld(gs, 1);
			}
			else {
				zeige_feld(rfeld, 0);
				zeige_feld(ns, 1);
				gs = ns;
				gewinn = 0;
				ss_neu = 0;
				button_color("stop_button", btn_rot_aus);
			}
	        setInfo(" ");
		    starte_risiko();
		}
		else setTimeout("animiere_risiko();", 500);
	}
	else {
		zeige_feld(ns, 0);
		zeige_feld(rfeld, 0);
		zeige_feld(gs, 1);
		if (teilgewinn_angenommen)  teilgewinn_angenommen = false; 
	}
}

function animiere_ausspielung(von_, bis_, feld_) {
	// Ausspielung , von Feld,
	//  bis Feld,  startet bei Feld z.b. (5, 9, 5)

	button_text("stop_button", btnText[2]);
	button_color("stop_button", btn_rot_an);

	von = von_;
	bis = bis_;

	if (feld_ == bis + 1) feld_ = von;

	if (ga) { // grosse A. andere Reihenfolge
		feld = arf[feld_];
		if (feld_ == von) feld_davor = arf[bis];
		else feld_davor = arf[feld_ - 1];
	}
	else { // kleine Ausspielung
		feld = feld_;
		if (feld == von) feld_davor = bis;
		else feld_davor = feld - 1;
	}

	next = feld_ + 1;
	zeige_feld(feld, 1);
	zeige_feld(feld_davor, 0);

	if ((gs == feld || gam == feld) && !ausspielung) {

		gam = 0;

		if (games) {
			gewinn = gpu_games[gs];
			ss_neu = gss[gs];
		}
		else {
			gewinn = gpu_points[gs];
		}
		zeige_Gewinn();
		zeige_Spiele();
		stop_ausp_ani();
		audio_stop();
		setInfo(" ");
		setTimeout("zeige_feld(gs, 1);", 5 * spiel_tempo);
		if (feld > 20) {
		setTimeout("zeige_feld(feld, 0);", 20 * spiel_tempo);
		}
		setTimeout("starte_risiko();", 20 * spiel_tempo);
	}

	else {
		setTimeout("animiere_ausspielung(von, bis, next);", 2 * spiel_tempo);
	}
}

function grosse_Ausspielung_mitte() {

	// Zuordnung von Gewinnstufe auf Ausspielfelder(21-28)
	// damit das richtige Gewinnfeld beleuchtet wird, nicht
	// nur das in der Risikoleiter
	var gam_gs = [0, 0, 0, 0, 0, 0, 21, 23, 25, 27, 0, 0, 0, 0, 0, 0, 0, 22, 24, 26, 28];

	ga = true;
	setInfo(infoText[22]);

	gs = ausspiel_gs(6, 25, 17, 25, 7, 15, 18, 15, 8, 5, 19, 5, 9, 5, 20, 5);
	gam = gam_gs[gs];
	animiere_ausspielung(21, 28, 21);
	setTimeout("ausspiel_stop();", 50 * spiel_tempo);
}

function gewinn_in_ss() {

	in_ss_gewonnen = true;
	gewinn = 200;

	if ((ss > 9 && (s2 != 1 || gf)) || ausspielung) {
		Gewinn_annehmen();
	}
	else if ((sonderspiel && ss < 10) || s2 == 1) {
		gs = 14;
		punkte = punkte + 40;
		zeige_Punkte();
		setInfo(infoText[13] + " 40" + infoText[16]);
		zeige_feld(gs,1);
		setTimeout("starte_risiko();", 10 * spiel_tempo);
	}
}

function einfacher_Gewinn(eg) {

	switch (eg) {
		case 160:
			gs = 14;
			break;
		case 120:
			gs = 3;
			break;
		case 80:
			gs = 13;
			break;
		case 60:
			gs = 2;
			break;
		case 40:
			gs = 12;
			break;
		case 30:
			gs = 1;
			break;
		case 20:
			gs = 11;
			break;
			
	}

	if (games) gewinn = gpu_games[gs];
	else gewinn = gpu_points[gs];

	zeige_Gewinn();
	zeige_feld(gs, 1);

	setTimeout("starte_risiko();", 20 * spiel_tempo);
}

function Gewinnermittlung() {

	var i;
	var j;
	var k = 0;
	var sonne = 0;
	var tmp = 0;
	var ge = [];
    gf = 0;
	gs = 0;
	gewinn = 0;

	audio_stop();

	// die ungeraden Felder sind gestreift (Gewinn in Sonderspielen)
	if(s2 != 1)  gf = s2 % 2;

	for (i = 0; i <= 1; i++) {
		for (j = 3; j <= 4; j++) {
			if (disc[i][s1] == disc[j][s3]) {
				ge[k] = disc[i][s1];
				if (ge[k] == 999) sonne++;
				k++;
			}
		}
	}

	if (ge.length > 1 && ge[1] > ge[0]) {
		tmp = ge[0];
		ge[0] = ge[1];
		ge[1] = tmp;
	}

	if (disc[2][s2] == 999) {

		switch (sonne) {
			case 4: //gam
				gs = 6;
				ausspielung = true;
				if (games) gewinn_in_ss();
				setTimeout("grosse_Ausspielung_mitte();", 30 * spiel_tempo);
				break;
			case 2: // gal
				gs = 15;
				ausspielung = true;
				if (games) gewinn_in_ss();
				setTimeout("grosse_Ausspielung_links();", 30 * spiel_tempo);
				break;
			case 1: // gar
				gs = 4;
				ausspielung = true;
				if (games) gewinn_in_ss();
				setTimeout("grosse_Ausspielung_rechts();", 30 * spiel_tempo);
				break;
			case 0:
				if (games && sonderspiel) gewinn_in_ss();
				else {
					if (ge.length > 0 && ge[0] > 30) {
						gs = 11; // vorlÃ¤ufig 
						einfacher_Gewinn(ge[0]);
					}
					else if (ge[0] == 30) {
						gs = 1;
						zeige_feld(gs, 1);
						setTimeout("kleine_Ausspielung_rechts();", 15 * spiel_tempo);
					}
					else { // nix oder 2*20 und Sonne in der Mitte
						gs = 11;
						zeige_feld(gs, 1);
						setTimeout("kleine_Ausspielung_links();", 15 * spiel_tempo);
					}
				}
				break;
		}
	}

	if (ge.length > 0 && disc[2][s2] != 999) {
		for (i = 0; i < ge.length; i++) {
			if (ge[i] == disc[2][s2]) {
				gs = 11; // vorlÃ¤ufig
				if (games && sonderspiel) gewinn_in_ss();
				else einfacher_Gewinn(ge[i]);
			}
		}
	}

	if (gs == 0) {
		if (games && sonderspiel && gf) gewinn_in_ss();
		else setTimeout("the_end();", 20 * spiel_tempo);
	}

}


// ENDE