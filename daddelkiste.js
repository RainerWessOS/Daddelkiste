//*******************************************************************
//      Daddelkiste Version 0.90 - 2016 / 2017
//      Javascript implementation of an "Advanced Slot Machine"
//
//      Copyright (C) 2017 Rainer Wess, Osnabrück, Germany
//      Open Source / Freeware - released under GPL 2
//*******************************************************************
//  konfigurierbar:

var risiko_win = 50; // Prozent für Gewinn bei Risiko, default 50 (Risiko 1:1)
// dieser Wert kann nach eigenem Geschmack verändert werden
// bei Erhöhung des Wertes läßt sich leichter Hochdrücken
var spiel_tempo = 100; // Geschwindigkeit des Spielablaufs (50,75,100,125,150)
var auto_risiko = 4; // nach wieviel Sekunden Risikoautomatik
// auto_risiko muss kleiner sein als auto_annahme!!!
var auto_annahme = 6; // nach wieviel Sekunden automatische Gewinnannahme

// *********************************************************************
//  don't touch this :

var s1 = 0; // Variablen für Scheibenpositionen, mögliche Werte 1 bis 12
var s2 = 0; // die Scheibenbelegung ist in der lade_bilder.js dokumentiert
var s3 = 0;
var s_stop = 1; // Zählvariable fürs stoppen der Scheiben per Stop-Taste
var ga = 0; // Variable für das Ergebnis der großen Ausspielung mitte
var gs = 0; // Gewinnstufe, Kern der Risikofunktion, 0-9 fur rechts, 10-20 links
var rsr = 5; // Risikostufe rechts, default Wert, bis zum Erreichen von 5 SS
var rsl = 15; // Risikostufe links, default Wert, bis zum Erreichen von 3 SS
// Arrays zur Gewinnermittlung, enthält gewinnende Scheibenpositionen als Strings
// Reihenfolge vom grossten Gewinn (index 0) bis zum Kleinsten (index 11), der letzte Eintrag enthält die gestreifen Felder und ist nur in Sonderspielen relevant
// index 0 : gam, 1, 2: gal, 3 gar, 4 160 gs=14, 5 120 gs=3, 6  80 gs=13, 7 60 gs=2, 8 40 gs=12, 9 30 kar, 10 20 kal, 11 kal, 12 gf
var ge1 = ["01", "01", "05.09", "05.09", "05", "03.11", "03.10", "07", "07.09.12", "02.04.06.08.10.12", "02.04.06.08.11", "01.02.03.04.05.06.07.08.09.10.11.12", "01.02.03.04.05.06.07.08.09.10.11.12"];
var ge2 = ["01", "01", "01", "01", "06", "01.12", "01.10", "01.04", "01.08", "01.03.05.09", "01.02.07.11", "01", "03.05.07.09.11"];
var ge3 = ["01", "05.09", "01", "05.09", "05", "03.11", "03.10", "07", "07.09.12", "02.04.06.08.10.12", "02.04.06.08.11", "01.02.03.04.05.06.07.08.09.10.11.12", "01.02.03.04.05.06.07.08.09.10.11.12"];
var gegs = [6, 15, 15, 4, 14, 3, 13, 2, 12, 1, 11, 11, 21]; // Umsetzung Gewinnindex nach Gewinnstufe
var gf = false; // gestreiftes Feld auf mittlerer Scheibe,  kein sonstiger Gewinn (Sonderfall gs=21)
// Gewinnarray Punkte, rechts 0-9, links 10-20
var gpu = [0, 30, 60, 120, 240, 0, 0, 0, 0, 0, 0, 20, 40, 80, 160, 0, 0, 0, 0, 0, 0];
// Gewinnarray Sonderspiele, rechts 0-9, links 10-20
var gss = [0, 0, 0, 0, 0, 5, 10, 20, 40, 90, 0, 0, 0, 0, 0, 3, 6, 12, 25, 50, 100];
// Ausspielreihenfolge GA rechts(4-9)/links(15-20)/mitte(21-28)
var arf = [0, 0, 0, 0, 4, 8, 6, 9, 5, 7, 0, 0, 0, 0, 0, 15, 19, 17, 20, 16, 18, 21, 26, 23, 28, 24, 27, 22, 25];
// fur Umsetzung von ga (verwendet in GA mitte) auf Gewinnstufe gs
var gags = [6, 17, 7, 18, 8, 19, 9, 20]; // entspricht 10,12,20,25,40,50,90,100 SS
var gas = false; // true bei GA Seiten (rechts/links)
var gam = false; // true bei GA Mitte (oben)
var ausspielung = false; // dient zum stoppen von allen Ausspielungen
var win = false; // Zufallsvariable, bestimmt ob risiko erfolgreich
var riskiert = false; // true wenn Risikotaste während Risikophase gedrückt wurde
// und in dem Bereich in dem die Risikoautomatik aktiv ist
var counter = 0; // wird fur die Risikoautomatik und automatische Gewinnannahme verwendet
var teilgewinn_angenommen = false; // entprellt und verzoegert das Herunterteilen
var gewinn_angenommen = false; // verhintert das mehrfache Annehmen eines Gewinnes
var hoechststufe = false; // Bei Höchstgewinn bleibt Gerät trotz Automatikstart stehen bis START gedrückt wird
//  steuert Animation und Sound bei Gewinn von 90 und 100 Sonderspielen
var ani = true; // fur Lichtanimation bei Sonderspielen
var lo = true; // fur Lichtanimation bei Hoechststufe
var intS; // fur Lichtanimation bei Sonderspielen
var intH; // fur Lichtanimation bei Hoechststufe
var stop = false; // verhintert start eines neuen Spiels während altes noch läuft
// in Ausspielungen, wenn gs noch null ist
// kann sehr wahrscheinlich mit "spiel_laueft_noch" besser realisiert werden
var startautomatik = false; // Startet automatisch das nächste Spiel
var autostart = false; // startet die erste Scheibe nochmal, wenn keine Sonne
var risikoautomatik = false;
var btn_rot_aus = "#990000"; // Farbe der roten Button passiv
var btn_rot_auto = "#BB0000"; // Farbe der roten Button bei Automatik
var btn_rot_an = "#FF0000"; // Farbe der roten Button aktiv
var btn_gelb_aus = "#997A00"; // Farbe der gelben Risiko-Buttons passiv
var btn_gelb_auto = "#CCA300"; // Farbe der gelben Button bei Automatik
var btn_gelb_an = "#FFCC00"; // Farbe der gelben Risiko-Buttons aktiv
var btn_gruen_aus = "#006600";
var btn_gruen_an = "#009900";
var risikophase = false;
var spiel_laueft_noch = false; // ist praktisch während des ganzen Spiels true, geht nur unmittelbar
// vor start des nächsten Spiels kurz auf false, verhindert Mehrfachstarts
var ss = 0;
var ss_neu = 0;
var ss_hoch = 0; // wird fürs hochzählen der Sonderspiele benötigt
var intHoch; // wird fürs hochzählen der Sonderspiele benötigt
var sonderspiel = false;
var in_ss_gewonnen = false;
var guthaben = 0;
var einsatz = 20;
var punkte = 0;
var gewinn = 0;
var ns = 0; // Null Selektor in Risikophase
// nützliche kleine Helfer Funktionen

function id(id) {
	return document.getElementById(id);
}

function bgImg(n, i) {
	return id("feld" + n).style.backgroundImage = "url(" + Risiko[i].src + ")";
}

function hide(id) {
	id(id).style.visibility = "hidden";
}

function show(id) {
	id(id).style.visibility = null;
}

function button_text(bid, txt) {
	id(bid).value = txt;
}

function button_color(bid, bcolor) {
	id(bid).style.backgroundColor = bcolor;
}

function setInfo(txt) {
	id("Info").innerHTML = txt;
}

function setPF(pid, txt) {
	id(pid).innerHTML = txt;
}

function setPFtxt() {
	setPF("Art", playfield[0]);
	setPF("Typ", playfield[1]);
	setPF("a1", playfield[2]);
	setPF("a2", playfield[3]);
	setPF("a3", playfield[4]);
	setPF("a4", playfield[5]);
	setPF("SS_label", playfield[6]);
	setPF("gar", playfield[8]);
	setPF("gal", playfield[8]);
	setPF("pl1", playfield[8]);
	setPF("pl2", playfield[8]);
}

function setConfTxt() {

	setPF("c1a", settingsText[0]);
	setPF("c1b", settingsText[0]);
	setPF("c1c", settingsText[0]);
	setPF("c1", settingsText[0]);
	setPF("winning", settingsText[1]);
	setPF("speed", settingsText[2]);
	setPF("r_auto", settingsText[3]);
	setPF("t_auto", settingsText[4]);
	setPF("c2a", settingsText[5]);
	setPF("c2b", settingsText[5]);
	setPF("c2c", settingsText[5]);
	setPF("c2", settingsText[5]);
	setPF("c3a", settingsText[6]);
	setPF("c3b", settingsText[6]);
	setPF("c3c", settingsText[6]);
	setPF("c3", settingsText[6]);
	setPF("c_anl", c_anl);
	setPF("c_anl_voll", c_anl_voll);
	setPF("c_hint", c_hint);
}

function setBtnTxt() {
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
}

function audio_play(sprite) {
	$.mbAudio.play("audio_sprite", sprite);
}

function audio_stop(sprite) {
	$.mbAudio.stop("audio_sprite", sprite);
}

function saveSettings() {
	// Check browser support
	if (typeof(Storage) !== "undefined") {
		// Store
		localStorage.setItem("risiko_win", String(risiko_win));
		localStorage.setItem("spiel_tempo", String(spiel_tempo));
		localStorage.setItem("auto_risiko", String(auto_risiko));
		localStorage.setItem("auto_annahme", String(auto_annahme));
		setInfo(infoText[0]);
	}
	else setInfo("Could not save settings");

}

function loadSettings() {

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
	id("ar").value = String(auto_risiko) + settingsText[7];
	id("auto_annahme").value = auto_annahme;
	id("aga").value = String(auto_annahme) + settingsText[7];
}

function blinkGal() {
	gal.className = "ausspielung1";
}

function blinkGar() {
	gar.className = "ausspielung1";
}

function resetA() {
	gal.className = "ausspielung";
	gar.className = "ausspielung";
}

function zum_starten_auffordern() {
	setInfo(infoText[3]);
}

function zeige_Guthaben() {
	id("Guthaben").value = String(guthaben) + ".00";
}

function zeige_Punkte() {
	id("Punkte").value = String(punkte);
}

function zeige_Gewinn() {
	id("Gewinn").value = String(gewinn);
}

function zeige_Sonderspiele() {
	id("Sonderspiele").value = String(ss);
}

function zeige_Einsatz() {
	id("Einsatz").value = String(einsatz);
}

function zeige_feld(nr, status) {

	// status = (status == "aus" || 0) ?  0 :  1;

	if (risikoautomatik && (nr == rsr || nr == rsl)) {  // Bild mit grunem Balken 
		if (status == 1) bgImg(nr, 3);
		else bgImg(nr, 2);
	}
	else {
		if (status == 1) bgImg(nr, 1);
		else bgImg(nr, 0);
	}
}

function zeige_felder(von, bis, status) {
	// z.B (0,9,0) schaltet die Felder von 0-9 aus
	// kann auch mit (0,9,aus) aufgerufen werden

	//   (status == "aus" || 0) ? status = 0 :  status = 1;

	for (i = von; i <= bis; i++) {
		zeige_feld(i, status);
	}
}

function setColor(s_id, s_color) {
	id(s_id).style.color = s_color;
}

function ani_ss() {

	ani = (ani) ? false : true;

	if (ani) setColor("SS_label", "#FFFFFF");
	else setColor("SS_label", "#FFCC00");
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

function ausspiel_stop() {
	ausspielung = false;
}

function reset() {

	// setzt die Formularfelder neu, die bei einem reload der Webseite
	// sonst mit falschen Werten gefüllt bleiben

	setInfo(infoText[1]);
	zeige_Guthaben();
	punkte = 0;
	zeige_Punkte();
	gewinn = 0;
	zeige_Gewinn();
	ss = 0;
	zeige_Sonderspiele();
	
	loadSettings();
	// For localisation de, en usw.
	setBtnTxt();
	setPFtxt();
	setConfTxt();

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

	punkte = punkte + guthaben * 100;
	guthaben = 0;
	zeige_Punkte();
	zeige_Guthaben();

	if (!spiel_laueft_noch) {
		setTimeout("zum_starten_auffordern();", 3 * spiel_tempo);
	}
	setTimeout("button_color('start_button', btn_rot_an);", 8 * spiel_tempo);

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

	guthaben = guthaben + 10;
	zeige_Guthaben();
	button_color("geldeinwurf", btn_gruen_aus);
	setTimeout("umbuchen_animieren1()", 8 * spiel_tempo);
}

function zeige_Scheibe(i, position) {

	audio_stop("walzenstop");
	id("scheibe" + i).src = Scheibe[i][position].src;
	if (i != 2) id("scheibe" + (i + 1)).src = Scheibe[i + 1][position].src;
	if (position != 0) audio_play("walzenstop");
	// position = 0 entspricht Scheibe löschen, leeres Bild
}

function stop_Scheibe_1() {

	if (s_stop == 1) {
		s_stop++;
		s1 = zufallszahl(1, 12);
		zeige_Scheibe(0, s1);

		// Falls Autostart eingeschaltet und auf Scheibe1 keine Sonne
		if (autostart && !(s1 == 1 || s1 == 5 || s1 == 9)) {
			setTimeout("zeige_Scheibe(0, 0);", 7 * spiel_tempo);
			s1 = zufallszahl(1, 12);
			setTimeout("zeige_Scheibe(0, s1);", 15 * spiel_tempo);
		}
		setTimeout("stop_Scheibe_3()", 10 * spiel_tempo);
	}
}

function stop_Scheibe_2() {

	if (s_stop == 3) {
		s_stop++;
		s2 = zufallszahl(1, 12);
		zeige_Scheibe(2, s2);
		button_color("stop_button", btn_rot_aus);
		setTimeout("Gewinnermittlung();", 10 * spiel_tempo);

	}
}

function stop_Scheibe_3() {

	if (s_stop == 2) {
		s_stop++;
		s3 = zufallszahl(1, 12);
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

function starte_Spiel() {

	risikophase = false;
	gewinn_angenommen = false;
	stop = false;
	s_stop = 1;
	gs = 0;
	ga = 0;
	gewinn = 0;
	ss_neu = 0;
	spiel_tempo = id("spiel_tempo").value;

	if (hoechststufe) Hoechststufe_zurueck();

	zeige_felder(0, 20, 0);

	if (startautomatik) button_color("start_button", btn_rot_auto);
	else button_color("start_button", btn_rot_aus);

	if (risikoautomatik) {
		zeige_feld(rsr, 0);
		zeige_feld(rsl, 0);
	}

	if (punkte >= einsatz) {

		spiel_laueft_noch = true;
		punkte = punkte - einsatz;
		zeige_Punkte();
		audio_play("abbuchen");

		setInfo(" ");

		if (ss == 0) {
			in_ss_gewonnen = false;
			sonderspiel = false;
			if (intS) {
				clearInterval(intS);
				setColor("SS_label", "#FFFFFF");
			}
		}

		if (ss == 1 && in_ss_gewonnen == false) {
			setInfo(infoText[21]);
			sonderspiel = true;
		}
		else if (ss > 0) {
			sonderspiel = true;
			ss = ss - 1
			zeige_Sonderspiele();
		}
		setTimeout("Scheiben_loeschen()", spiel_tempo);
	}
	else {
		setInfo(infoText[1]);
		button_color("geldeinwurf", btn_gruen_an);
	}
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

function Hoechststufe_zurueck() {

	hoechststufe = false;
	clearInterval(intH);

	audio_stop("hauptgewinn");

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

function the_end() {

	risikophase = false;
	stop = false;
	gf = false;

	audio_stop("angenommen");

	button_text("mitte_button", btnText[1]);

	if (autostart) button_color("mitte_button", btn_rot_auto);
	else button_color("mitte_button", btn_rot_aus);

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

function ss_annehmen() {
	ss_hoch = 0;
	setInfo(infoText[12] + ss_neu + infoText[15]);
	if (!sonderspiel) {
		intS = setInterval(ani_ss, 800);
	}
	intHoch = setInterval(ss_hochzaehlen, spiel_tempo);

}

function ss_hochzaehlen() {
	if (ss_neu > ss_hoch) {
		ss_hoch++;
		ss++;
		zeige_Sonderspiele();
	}
	else {
		clearInterval(intHoch);
		ss_neu = 0;
		audio_play("angenommen");
		setTimeout("the_end();", 20 * spiel_tempo);
	}

}

function punkte_annehmen() {

	punkte = punkte + gewinn;
	zeige_Gewinn();
	zeige_Punkte();
	setInfo(infoText[12] + gewinn + infoText[14]);
	gewinn = 0;
	audio_play("angenommen");
	if (!ausspielung) setTimeout("the_end();", 20 * spiel_tempo);
}

function Gewinn_annehmen() { // Gewinnannahme durch Spieler

	if (gewinn_angenommen) {
		setInfo(infoText[16]);
	}
	else if (gewinn == 0 && ss_neu == 0) {
		setInfo(infoText[17]);
	}
	annehmen();
}

function annehmen() { // Gewinnannahme durch Automat

	if (!gewinn_angenommen && (gewinn > 0 || ss_neu > 0)) {
		gewinn_angenommen = true;
		button_color("stop_button", btn_rot_aus);
		if (!hoechststufe) {
			audio_stop("risiko1");
			audio_stop("risiko2");
		}
		if (gewinn > 0) punkte_annehmen();
		else ss_annehmen();
	}
}

function Teilgewinn_annehmen(tga) {

	var ohne_tga = (typeof(tga) == "number") ? false : true;
	var tg = (ohne_tga) ? 0 : tga;

	if (!teilgewinn_angenommen && !hoechststufe) {
		if (gewinn_angenommen) {
			setInfo(infoText[16]);
		}
		else if (gs == 0 || gs == 10) {
			setInfo(infoText[17]);
		}
		else if (!gewinn_angenommen && ((1 < gs && gs < 10) || (11 < gs && gs < 20))) {

			audio_play("angenommen");

			if ((1 < gs && gs < 5) || (11 < gs && gs < 15)) {
				if (ohne_tga) tg = Math.round(gewinn / 2);
				gewinn = gewinn - tg;
				punkte = punkte + tg;
				setInfo(infoText[13] + tg + infoText[14]);

			}
			else if ((4 < gs && gs < 9) || (14 < gs && gs < 20)) {
				tg = Math.round(ss_neu / 2);
				ss_neu = ss_neu - tg;
				ss = ss + tg;
				setInfo(infoText[13] + tg + infoText[15]);
			}
			if (ohne_tga) {
				teilgewinn_angenommen = true;
				zeige_feld(gs + 1, 0);
				zeige_feld(gs, 0);
				gs = gs - 1;
			}
			zeige_Gewinn();
			zeige_Punkte();
			zeige_Sonderspiele();
			zeige_feld(gs, 1);
			setTimeout("starte_risiko();", 20 * spiel_tempo);

		}
	}
}

function Hoechststufe_erreicht() {

	hoechststufe = true;
	button_color("mitte_button", btn_rot_aus);
	audio_play("hauptgewinn");

	intH = setInterval(lichtorgel, 800);
	setTimeout("annehmen();", 8 * spiel_tempo);

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

	if (ausspielung) ausspielung = false;
	else if (risikophase || hoechststufe) Gewinn_annehmen();
	else {
		stop_Scheibe_2();
		stop_Scheibe_3();
		stop_Scheibe_1();
	}
}

function starte_risiko() {

	risikophase = true;
	riskiert = false;
	counter = 0;

	if (teilgewinn_angenommen) {
		audio_stop("angenommen");
	}
	audio_stop("risiko1");
	audio_stop("risiko2");

	risiko_win = id("risiko_win").value;
	auto_risiko = id("auto_risiko").value;
	auto_annahme = id("auto_annahme").value;

	gewinn = gpu[gs];
	ss_neu = gss[gs];

	if (gs == 0 || gs == 10) {
		zeige_Gewinn();
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
	zeige_feld(gs, 0);

	ns = (gs > 10) ? 10 : 0;

	if (counter % 2 == 0) zeige_feld(ns, 0);
	else zeige_feld(rfeld, 0);

	if (!gewinn_angenommen && !teilgewinn_angenommen) {

		if (counter % 2 == 0) {
			zeige_feld(rfeld, 1);
			audio_stop("risiko1");
			audio_play("risiko2");
		}
		else {
			zeige_feld(ns, 1);
			audio_stop("risiko2");
			audio_play("risiko1");
		}
		// automatische Gewinnannahme
		counter = counter + 1;
		if (counter > (2 * auto_annahme)) annehmen();
		// Risikoautomatik
		if (counter > (2 * auto_risiko) && risikoautomatik && (gs < rsr || (10 < gs && gs < rsl))) {
			risiko_auto();
		}
		if (riskiert) {
			if (win) {
				gs = gs + 1;
				gewinn = gpu[gs];
				ss_neu = gss[gs];
				zeige_feld(ns, 0);
				zeige_feld(gs, 1);
			}
			else {
				gs = 0;
				zeige_feld(rfeld, 0);
				zeige_feld(ns, 1);
				setInfo(" ");
				button_color("stop_button", btn_rot_aus);
			}
			starte_risiko();
		}
		else setTimeout("animiere_risiko();", 500);
	}
	else {
		zeige_feld(ns, 0);
		zeige_feld(rfeld, 0);
		zeige_feld(gs, 1);
		if (teilgewinn_angenommen) teilgewinn_angenommen = false;
	}
}

function animiere_ausspielung(von_, bis_, feld_) {
	// Ausspielung , auf welcher Seite, von Feld,
	//  bis Feld,  startet bei Feld z.b. ("links", 5, 9, 5)
	// oder ("ga", 1, 8, 1)

	button_text("stop_button", btnText[2]);
	button_color("stop_button", btn_rot_an);

	von = von_;
	bis = bis_;

	if (feld_ == bis + 1) feld_ = von;

	if (gas || gam) {
		feld = arf[feld_];
		if (feld_ == von) feld_davor = arf[bis];
		else feld_davor = arf[feld_ - 1];
	}
	else {
		feld = feld_;
		if (feld == von) feld_davor = bis;
		else feld_davor = feld - 1;
	}

	next = feld_ + 1;
	zeige_feld(feld, 1);
	zeige_feld(feld_davor, 0);

	if ((gs == feld || ga == feld) && !ausspielung) {

		if (gam) gs = gags[feld - 21];
		gam = gas = false;
		ga = 0;
		gewinn = gpu[gs];
		ss_neu = gss[gs];
		zeige_Gewinn();
		zeige_Sonderspiele();
		resetA();
		audio_stop("ausspielung");
		setTimeout("zeige_feld(feld, 0);", 20 * spiel_tempo);
		setTimeout("starte_risiko();", 20 * spiel_tempo);
	}

	else {
		setTimeout("animiere_ausspielung(von, bis, next);", 2 * spiel_tempo);
	}
}

function kleine_Ausspielung_rechts() {

	ausspielung = true;
	gewinn_angenommen = false;
	gewinn = ss_neu = 0;
	audio_play("ausspielung");

	var kar = zufallszahl(1, 100);

	if (kar <= 50) gs = 1;
	else if (kar > 50 && kar <= 70) gs = 2;
	else if (kar > 70 && kar <= 85) gs = 3;
	else if (kar > 85 && kar <= 95) gs = 4;
	else gs = 5;

	setTimeout("ausspiel_stop();", 20 * spiel_tempo);
	animiere_ausspielung(1, 5, 1);
}

function grosse_Ausspielung_rechts() {

	ausspielung = true;
	gas = true;
	gewinn_angenommen = false;
	gewinn = ss_neu = 0;
	blinkGar();
	audio_play("ausspielung");
	setInfo(infoText[18]);

	var gar = zufallszahl(1, 100);

	if (gar <= 50) gs = 4;
	else if (gar > 50 && gar <= 65) gs = 5;
	else if (gar > 65 && gar <= 75) gs = 6;
	else if (gar > 75 && gar <= 85) gs = 7;
	else if (gar > 85 && gar <= 95) gs = 8;
	else gs = 9;

	setTimeout("ausspiel_stop();", 40 * spiel_tempo);
	animiere_ausspielung(4, 9, 4);
}

function kleine_Ausspielung_links() {

	//   kleine Ausspielung animieren,
	//   Lauflicht  von 20 Punkte bis 6 Sonderspiele

	ausspielung = true;
	gewinn_angenommen = false;
	gewinn = ss_neu = 0;

	audio_play("ausspielung");

	var kal = zufallszahl(1, 100);

	// ermittle Gewinnstufe links

	if (kal <= 50) gs = 11; //  20P  50%
	else if (kal > 50 && kal <= 65) gs = 12; //  40P  15%
	else if (kal > 65 && kal <= 75) gs = 13; //  80P  10%
	else if (kal > 75 && kal <= 85) gs = 14; // 160P 10%
	else if (kal > 85 && kal <= 95) gs = 15; // 3 SS. 10%
	else gs = 16; // 6 SS.  5%

	setTimeout("ausspiel_stop();", 20 * spiel_tempo);
	animiere_ausspielung(11, 16, 11);
}

function grosse_Ausspielung_links() {

	//   Grosse Ausspielung animieren,
	//    von 3 bis 100 Sonderspiele
	//    extra spannend

	ausspielung = true;
	gas = true;
	gewinn_angenommen = false;
	gewinn = ss_neu = 0;

	setInfo(infoText[19]);
	audio_play("ausspielung");
	blinkGal();

	var gal = zufallszahl(1, 100);

	// ermittle Gewinnstufe links

	if (gal <= 50) gs = 15; //  3 SS 50%
	else if (gal > 50 && gal <= 65) gs = 16; //  6 SS 15%
	else if (gal > 65 && gal <= 75) gs = 17; // 12 SS 10%
	else if (gal > 75 && gal <= 85) gs = 18; // 25 SS 10%
	else if (gal > 85 && gal <= 95) gs = 19; // 50 SS 10%
	else gs = 20; //100 SS 5%

	setTimeout("ausspiel_stop();", 40 * spiel_tempo);
	animiere_ausspielung(15, 20, 15);
}

function grosse_Ausspielung_mitte() {

	ausspielung = true;
	gam = true;
	gewinn_angenommen = false;
	gewinn = ss_neu = 0;

	setInfo(infoText[20]);
	audio_play("ausspielung");

	var gar = zufallszahl(1, 100);

	if (gar <= 25) ga = 21; // 10   25%    
	else if (gar > 25 && gar <= 50) ga = 22; // 12   25%   
	else if (gar > 50 && gar <= 65) ga = 23; // 20   15%     
	else if (gar > 65 && gar <= 80) ga = 24; // 25   15%     
	else if (gar > 80 && gar <= 85) ga = 25; // 40     5%
	else if (gar > 85 && gar <= 90) ga = 26; // 50.    5%
	else if (gar > 90 && gar <= 95) ga = 27; // 90      5%
	else ga = 28; // 100     5%

	setTimeout("ausspiel_stop();", 50 * spiel_tempo);
	animiere_ausspielung(21, 28, 21);
}

function NumToStr(num) {

	var str = (num < 10) ? "0" + num : String(num);
	return str;
}

function ist_Gewinn() {

	var ergebnis = 0;

	// Funktion benötigt die Arrays ge1, ge2, ge3 zur Gewinnermittlung

	var s1s = NumToStr(s1);
	var s2s = NumToStr(s2);
	var s3s = NumToStr(s3);

	for (var i = 0; i < ge2.length; i++) {
		if (ge2[i].indexOf(s2s) != -1) {
			if (ge1[i].indexOf(s1s) != -1) {
				if (ge3[i].indexOf(s3s) != -1) {
					ergebnis = gegs[i];

					break;
				}
			}
		}
	}
	return ergebnis;
}

function gewinn_in_ss() {

	in_ss_gewonnen = true;
	gewinn = 200;

	if ((ss > 9 && (s2 != 1 || gf)) || ausspielung) {
		annehmen();
	}
	else if ((sonderspiel && ss < 10) || s2 == 1) {
		gs = 14;
		zeige_feld(gs, 1);
		Teilgewinn_annehmen(40);
	}

}

function Gewinnermittlung() {

	audio_stop("walzenstop");
	gs = ist_Gewinn();

	switch (gs) {
		case 0:
			setTimeout("the_end();", 20 * spiel_tempo);
			break;
		case 1:
			if (sonderspiel) gewinn_in_ss();
			else {
				zeige_feld(gs, 1);
				setTimeout("kleine_Ausspielung_rechts();", 15 * spiel_tempo);
			}
			break;
		case 11:
			if (sonderspiel) gewinn_in_ss();
			else {
				zeige_feld(gs, 1);
				setTimeout("kleine_Ausspielung_links();", 15 * spiel_tempo);
			}
			break;
		case 4:
			ausspielung = true;
			gewinn_in_ss();
			setTimeout("grosse_Ausspielung_rechts();", 30 * spiel_tempo);
			break;
		case 15:
			ausspielung = true;
			gewinn_in_ss();
			setTimeout("grosse_Ausspielung_links();", 30 * spiel_tempo);
			break;
		case 6:
			ausspielung = true;
			gewinn_in_ss();
			setTimeout("grosse_Ausspielung_mitte();", 30 * spiel_tempo);
			break;
		case 21: // gestreiftes Feld, Gewinn nur in SS
			gf = true;
			if (sonderspiel) gewinn_in_ss();
			else setTimeout("the_end();", 20 * spiel_tempo);
			break;
		default:
			if (sonderspiel) gewinn_in_ss();
			else {
				gewinn = gpu[gs];
				zeige_Gewinn();
				zeige_feld(gs, 1);
				setTimeout("starte_risiko();", 20 * spiel_tempo);
			}
			break;
	}

}

// ENDE