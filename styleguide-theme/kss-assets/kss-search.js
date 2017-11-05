// JavaScript Datei für die Suchfunktion gdts.one Styleguide


// Definition der Variablen (von HTML in Variable)
var searchField = document.getElementById('kss-search');
var sections = document.getElementsByClassName('section');
var resultsHTMLElement = document.getElementById('kss-search-results');

// Hilfsfunktion um den ersten Buchstaben eines Strings groß zu schreiben
function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Eventhandler kriegt Funktion zugewiesen, die getriggert wird sobald das
// searchField in den Focus kommt
searchField.onfocus = function () {
  // - Feld wird nur eingeblendet, wenn min. schon ein Ergebnis gefunden wurde
  // - flex weil Ergebnisse untereinander dargestellt werden sollen
  //  (siehe kss.css)
  if (resultsHTMLElement.firstChild) {
    resultsHTMLElement.style.display = 'flex';
  }
}

// Eventhandler kriegt Funktion zugewiesen, die getriggert wird sobald das
// searchField aus dem Focus gerät.
searchField.onblur = function () {
  // timeout, weil sonst die Suchergebnisse ausgeblendet werden bevor auf
  // den Link geklickt werden kann
  setTimeout(function () {
    resultsHTMLElement.style.display = 'none';
  }, 50);
}

// Eventhandler kriegt Funktion zugewiesen, die getriggert wird sobald
// eine Benutzereingabe im searchField stattfindet
searchField.oninput = function () {
  resultsHTMLElement.style.display = 'flex';

  // Ergebnisarray
  var results = [];

  // Entferne vorherige Suchergebnisse
  while (resultsHTMLElement.firstChild) {
    resultsHTMLElement.removeChild(resultsHTMLElement.firstChild);
  }

  // Schleife läuft über alle "Section" - Elemente
  for (var i = 0; i < sections.length; i++) {
    // speichern des aktuellen Suchbegriffs in Variable
    var searchString = searchField.value;

    // wenn leer, dann clear vorherige Suchergebnisse aus
    // HTML Element resultsHTMLElement
    if (searchString === '') {

      while (resultsHTMLElement.firstChild) {
        resultsHTMLElement.removeChild(resultsHTMLElement.firstChild);
      }
      // blende result Anzeige aus
      resultsHTMLElement.style.display = 'none';
      // und verlasse Funktion
      return;
    }
    // Beziehe Informationen, wie z.B. titel, oder sectionID aus den
    // data attributes der einzelnen Section Elementen, wie von kss generiert
    // (siehe index.hbs)
    var title = sections[i].getAttribute('data-title');

    // HERE IS WHERE THE MAGIC HAPPENS!
    // wenn der Titel der SEction den Suchbrgriff beinhaltet,
    if (title.includes(searchString) || title.includes(capitalize(searchString))) {
      // erstelle neues JavaScript Objekt mit den Eigenschaften
      // Titel, URL, Depths, sectionID ...
      var result = {
        title: sections[i].getAttribute('data-title'),
        url: sections[i].getAttribute('data-url'),
        depth: sections[i].getAttribute('data-depth'),
        sectionID: sections[i].getAttribute('data-reference').split('.')[1]
      }
      // ... und hänge dieses neue Result Objekt an das ResultsArray an
      results.push(result);
    }
  }

  // Nachdem das Results Array in der vorhergegangenen Schleife befüllt
  // wurde, gehe über das Results Array und erzeuge Links
  for (var i = 0; i < results.length; i++) {
    // Speichere die ID der vorangegangenen Section in Variable
    var lastSectionID = results[i].sectionID;
    if (i > 0) {
      lastSectionID = results[i - 1].sectionID;
    }

    // leeres neues HTML Linkelement wird generiert
    var resultLink = document.createElement('a');
    // Eigenschaften des neuen Elements werden gesetzt (Sprungziel und Titel)
    // String (#+URl)
    resultLink.href = '#' + results[i].url;
    resultLink.innerHTML = results[i].title;

    // Bestimmung der Bereichsüberschriften
    if (results[i].depth === '2') {
      resultLink.style.fontWeight = 'bold';
      resultLink.style.marginTop = '5%';
    }

    // Größerer Abstand bei neuer Section
    if (results[i].sectionID !== lastSectionID) {
      resultLink.style.marginTop = '5%';
    }
    // Neu erzeugtes Linkelement wird in resultsHTMLElement eingehangen
    resultsHTMLElement.appendChild(resultLink);
  }

  // falls keine Treffer gefunden werden, wird Resultfeld nicht eingeblendet
  if (results.length === 0) {
    resultsHTMLElement.style.display = 'none';
  }
};
