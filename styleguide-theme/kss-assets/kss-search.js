var searchField = document.getElementById('kss-search');
var sections = document.getElementsByClassName('section');
var resultsHTMLElement = document.getElementById('kss-search-results');

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

searchField.onfocus = function () {
  if (resultsHTMLElement.firstChild) {
    resultsHTMLElement.style.display = 'flex';
  }
}

searchField.onblur = function () {
  setTimeout(function () {
    resultsHTMLElement.style.display = 'none';
  }, 50);
}

searchField.oninput = function () {
  resultsHTMLElement.style.display = 'flex';

  var results = [];

  while (resultsHTMLElement.firstChild) {
    resultsHTMLElement.removeChild(resultsHTMLElement.firstChild);
  }

  for (var i = 0; i < sections.length; i++) {
    var searchString = searchField.value;

    if (searchString === '') {

      while (resultsHTMLElement.firstChild) {
        resultsHTMLElement.removeChild(resultsHTMLElement.firstChild);
      }

      resultsHTMLElement.style.display = 'none';

      return;
    }

    var title = sections[i].getAttribute('data-title');

    if (title.includes(searchString) || title.includes(capitalize(searchString))) {
      var result = {
        title: sections[i].getAttribute('data-title'),
        url: sections[i].getAttribute('data-url'),
        depth: sections[i].getAttribute('data-depth'),
        sectionID: sections[i].getAttribute('data-reference').split('.')[1]
      }

      results.push(result);
    }
  }

  for (var i = 0; i < results.length; i++) {
    var lastSectionID = results[i].sectionID;

    if (i > 0) {
      lastSectionID = results[i - 1].sectionID;
    }

    var resultLink = document.createElement('a');

    resultLink.href = '#' + results[i].url;
    resultLink.innerHTML = results[i].title;

    if (results[i].depth === '2') {
      resultLink.style.fontWeight = 'bold';
      resultLink.style.marginTop = '5%';
    }

    if (results[i].sectionID !== lastSectionID) {
      resultLink.style.marginTop = '5%';
    }

    resultsHTMLElement.appendChild(resultLink);
  }

  console.log(results.length)

  if (results.length === 0) {
    resultsHTMLElement.style.display = 'none';
  }
};
