//** **********************************************************************
//      Daddelkiste Version 0.90 - 2016 / 2017
//      Javascript implementation of an "Advanced Slot Machine"
//
//      Copyright (C) 2017 Rainer Wess, Osnabrück, Germany
//      Open Source / Freeware - released under GPL 2
//* ***********************************************************************

// Bilder für die Scheiben in Arrays laden
// Scheibe 1 ist links, Scheibe 2 in der Mitte, Scheibe 3 rechts
// Bilder auf Scheibe 3 identisch Scheibe 1,

// Scheibe 1 + 3 oben: (12 Felder)
// Sonne, 30, 120, 30, Sonne, 30, 60, 30, Sonne, 30, 120, 30

// Scheibe 1 + 3 unten: (12 Felder)
// Disk, 20, 80, 20, 160, 20, 40, 20, 40, 80, 20, 40 

// Scheibe 2 oben (Mittlere Scheibe): (12 Felder)
// Sonne, 20, 30, 60, 30, 160, 20, 40, 30, 80, 20, 120

var i, j = 0;

var Scheibe = new Array();

for (var i = 0; i <= 4; ++i) {
	Scheibe[i] = new Array(12);
}

for (j = 0; j <= 4; j++) {
	for (i = 0; i <= 12; i++) {
		Scheibe[j][i] = new Image();
	}
}
// Scheibe 1 + 3 oben: (12 Felder)
// Sonne, 30, 120, 30, Sonne, 30, 60, 30, Sonne, 30, 120, 30

Scheibe[0][0].src = "images/S0.gif";
Scheibe[0][1].src = "images/S1.gif";
Scheibe[0][2].src = "images/S30.gif";
Scheibe[0][3].src = "images/S120.gif";
Scheibe[0][4].src = "images/S30.gif";
Scheibe[0][5].src = "images/S1.gif";
Scheibe[0][6].src = "images/S30.gif";
Scheibe[0][7].src = "images/S60.gif";
Scheibe[0][8].src = "images/S30.gif";
Scheibe[0][9].src = "images/S1.gif";
Scheibe[0][10].src = "images/S30.gif";
Scheibe[0][11].src = "images/S120.gif";
Scheibe[0][12].src = "images/S30.gif";

for (i = 0; i <= 12; i++) {
	Scheibe[1][i] = new Image();
}

// Scheibe 1 + 3 unten: (12 Felder)
// Disk, 20, 80, 20, 160, 20, 40, 20, 40, 80, 20, 40 

Scheibe[1][0].src = "images/S0.gif";
Scheibe[1][1].src = "images/S1.gif";
Scheibe[1][2].src = "images/S20.gif";
Scheibe[1][3].src = "images/S80.gif";
Scheibe[1][4].src = "images/S20.gif";
Scheibe[1][5].src = "images/S160.gif";
Scheibe[1][6].src = "images/S20.gif";
Scheibe[1][7].src = "images/S40.gif";
Scheibe[1][8].src = "images/S20.gif";
Scheibe[1][9].src = "images/S40.gif";
Scheibe[1][10].src = "images/S80.gif";
Scheibe[1][11].src = "images/S20.gif";
Scheibe[1][12].src = "images/S40.gif";

// Scheibe 2 (Mittlere Scheibe): (12 Felder)
// Sonne, 20, 30, 60, 30, 160, 20, 40, 30, 80, 20, 120   
// Bilder mit "m" sind gestreift, also in Sonderspielen Gewinnfelder

Scheibe[2][0].src = "images/S0.gif";
Scheibe[2][1].src = "images/S1m.gif";
Scheibe[2][2].src = "images/S20.gif";
Scheibe[2][3].src = "images/S30m.gif";
Scheibe[2][4].src = "images/S60.gif";
Scheibe[2][5].src = "images/S30m.gif";
Scheibe[2][6].src = "images/S160.gif";
Scheibe[2][7].src = "images/S20m.gif";
Scheibe[2][8].src = "images/S40.gif";
Scheibe[2][9].src = "images/S30m.gif";
Scheibe[2][10].src = "images/S80.gif";
Scheibe[2][11].src = "images/S20m.gif";
Scheibe[2][12].src = "images/S120.gif";

for (i = 0; i <= 12; i++) {
	Scheibe[3][i].src = Scheibe[0][i].src;
	Scheibe[4][i].src = Scheibe[1][i].src;
}

var Risiko = new Array();
for (i = 0; i <= 3; i++) {
	Risiko[i] = new Image();
}

Risiko[0].src = "images/risiko_passiv.gif";
Risiko[1].src = "images/risiko_aktiv.gif";
Risiko[2].src = "images/risiko_passiv_an.gif";
Risiko[3].src = "images/risiko_aktiv_an.gif";