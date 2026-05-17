// NAVIGACE
var navbar     = document.getElementById('navbar');
var hamburger  = document.querySelector('.nav-hamburger');
var mobileMenu = document.querySelector('.nav-mobile');

// barveni menu pri scrollu dolu
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// otvirani a zavirani menu na mobilu pres klik na hamburger
hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  if (mobileMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden'; // zamknuti stranky proti rolovani pod menu
  } else {
    document.body.style.overflow = '';
  }
});

// zavreni mobilniho menu kdyz se klikne na nejaky odkaz uvnitr
var odkazyMenu = document.querySelectorAll('.nav-mobile a');
odkazyMenu.forEach(function(odkaz) {
  odkaz.addEventListener('click', function() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// NASTAVENÍ MINIMA DATUMU PRO REZERVACI
// zjisti dnesni datum a nastavi ho jako nejzazsi mozny den pro kliknuti v kalendari
var dnesniDen = new Date();
var rok = dnesniDen.getFullYear();
var mesic = String(dnesniDen.getMonth() + 1).padStart(2, '0');
var den = String(dnesniDen.getDate()).padStart(2, '0');
var minDatum = rok + '-' + mesic + '-' + den;
var inpDatum = document.getElementById('res-date');
if (inpDatum) {
  inpDatum.setAttribute('min', minDatum);
}


// CAROUSEL
var aktivniSlide = 0;
var pasSlidu     = document.querySelector('.carousel-track');
var obalTecek    = document.querySelector('.carousel-dots');
var tecky        = obalTecek.querySelectorAll('.dot');

// hlavni hybatko s obrazky posouva pas do stran podle indexu
function prejitNaSlide(n) {
  if (n >= tecky.length) { n = 0; }
  if (n < 0) { n = tecky.length - 1; }
  aktivniSlide = n;
  pasSlidu.style.transform = 'translateX(-' + (aktivniSlide * 100) + '%)'; // prepocet posunu v procentech
  for (var i = 0; i < tecky.length; i++) {
    tecky[i].classList.remove('active');
  }
  tecky[aktivniSlide].classList.add('active');
}

document.querySelector('.carousel-btn.prev').addEventListener('click', function() {
  prejitNaSlide(aktivniSlide - 1);
});
document.querySelector('.carousel-btn.next').addEventListener('click', function() {
  prejitNaSlide(aktivniSlide + 1);
});

// prirazeni spravneho cisla slidu ke kazde tecce pod obrazkem
for (var i = 0; i < tecky.length; i++) {
  tecky[i].addEventListener('click', function() {
    for (var j = 0; j < tecky.length; j++) {
      if (tecky[j] === this) {
        prejitNaSlide(j);
      }
    }
  });
}

// automaticke pretaceni po 5 vterinach stopne se kdyz na to najede mys
var autoplay = setInterval(function() { prejitNaSlide(aktivniSlide + 1); }, 5000);
var obalCarousel = document.querySelector('.carousel-wrapper');
obalCarousel.addEventListener('mouseenter', function() { clearInterval(autoplay); });
obalCarousel.addEventListener('mouseleave', function() {
  autoplay = setInterval(function() { prejitNaSlide(aktivniSlide + 1); }, 5000);
});


// ODPOČÍTÁVÁNÍ
var ciloveDatum = new Date('2026-09-01T10:00:00');

// prepocet milisekund na dny hodiny minuty a sekundy
function aktualizujOdpocet() {
  var elDays = document.getElementById('cd-days');
  if (!elDays) return;

  var rozdil = ciloveDatum - new Date();

  if (rozdil <= 0) {
    document.querySelector('.countdown-title').textContent = 'Výstava právě probíhá!';
    document.querySelector('.countdown-grid').style.display = 'none';
    return;
  }

  var dny     = Math.floor(rozdil / (1000 * 60 * 60 * 24));
  var hodiny  = Math.floor((rozdil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minuty  = Math.floor((rozdil % (1000 * 60 * 60)) / (1000 * 60));
  var sekundy = Math.floor((rozdil % (1000 * 60)) / 1000);

  elDays.textContent                                 = String(dny).padStart(2, '0');
  document.getElementById('cd-hours').textContent   = String(hodiny).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minuty).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(sekundy).padStart(2, '0');
}

aktualizujOdpocet();
setInterval(aktualizujOdpocet, 1000); // spousteni odpoctu kazdou vterinu znova


// NAČÍTÁNÍ EXPOZIC Z CSV
function nactiExpoZCSV() {
  // stazeni externiho csv souboru s daty expozic
  fetch('data/expozice.csv')
    .then(function(response) { return response.text(); })
    .then(function(csv) {
      var radky = csv.trim().split('\n');
      var expozice = [];

      // rozsekani radku podle stredniku a vytvoreni pole objektu
      for (var i = 1; i < radky.length; i++) {
        var casti = radky[i].split(';');
        if (casti.length >= 4) {
          expozice.push({
            jmeno: casti[0].trim(),
            popis: casti[1].trim(),
            kategorie: casti[2].trim(),
            img: casti[3].trim()
          });
        }
      }
      
      // generovani html karticek a nastrceni do divu expo-grid na webu
      var mrizka = document.getElementById('expo-grid');
      var obsahMrizky = '';
      
      for (var i = 0; i < expozice.length; i++) {
        var expo = expozice[i];
        var rok = expo.jmeno.split('—')[0].trim(); // vytazeni roku z textu pred pomlckou
        var jmeno = expo.jmeno.split('—')[1].trim(); // vytazeni jmena z textu za pomlckou
        
        obsahMrizky += '<div class="expo-card">'
          + '<img class="expo-card-img" src="' + expo.img + '" alt="' + jmeno + '" onerror="this.src=\'images/placeholder.jpg\'">'
          + '<div class="expo-card-body">'
          + '<p class="expo-card-tag">' + rok + '</p>'
          + '<h3 class="expo-card-title">' + jmeno + '</h3>'
          + '<p class="expo-card-desc">' + expo.popis + '</p>'
          + '</div></div>';
      }
      
      if (mrizka) {
        mrizka.innerHTML = obsahMrizky;
      }
    })
    .catch(function(err) {
      console.log('CSV nenalezena, používám fallback data', err);
      nactiExpoFallback(); // zachrana kdyz csv soubor nejde stahnout
    });
}

function nactiExpoFallback() {
  var expozice = [
    { rok: '1920', jmeno: 'Coco Chanel', popis: 'Gabrielle Chanel osvobodila ženy od korzetu a přinesla elegantní jednoduchost. Tweedové sako, malé černé šaty a nadčasové šperky.', img: 'images/expo1.jpg' },
    { rok: '1947', jmeno: 'Christian Dior', popis: 'New Look změnil poválečný svět jedinou kolekcí. Extravagantní sukně, úzký pas a ženská silueta vrátily Paříži status módního hlavního města.', img: 'images/expo2.jpg' },
    { rok: '1966', jmeno: 'Yves Saint Laurent', popis: 'Saint Laurent přinesl ženám smokingový oblek a učinil z ulice módní přehlídkovou dráhu. Průkopník Pop art vlivů a kulturní diverzity v módě.', img: 'images/expo3.jpg' },
    { rok: '1970', jmeno: 'Vivienne Westwood', popis: 'Britská královna punku propojila módní haute couture s pouličním revoltou. Sex Pistols a razantní střihy, které dodnes šokují i inspirují.', img: 'images/expo4.jpg' },
    { rok: '1980', jmeno: 'Rei Kawakubo', popis: 'Zakladatelka Comme des Garçons přinesla dekonstruktivismus a asymetrii. Japonský pohled na prázdnotu, nedokonalost a oděv jako sochařské dílo.', img: 'images/expo5.jpg' },
    { rok: '1990', jmeno: 'Alexander McQueen', popis: 'Temná romantika, divadelní přehlídky a bezohledná kreativita. McQueen redefinoval hranice módy a proměnil každou kolekci v umělecký zážitek.', img: 'images/expo6.jpg' }
  ];

  var mrizka = document.getElementById('expo-grid');
  var obsahMrizky = '';

  for (var i = 0; i < expozice.length; i++) {
    var expo = expozice[i];
    obsahMrizky += '<div class="expo-card">'
      + '<img class="expo-card-img" src="' + expo.img + '" alt="' + expo.jmeno + '" onerror="this.src=\'images/placeholder.jpg\'">'
      + '<div class="expo-card-body">'
      + '<p class="expo-card-tag">' + expo.rok + '</p>'
      + '<h3 class="expo-card-title">' + expo.jmeno + '</h3>'
      + '<p class="expo-card-desc">' + expo.popis + '</p>'
      + '</div></div>';
  }

  mrizka.innerHTML = obsahMrizky;
}

nactiExpoZCSV();


// FAQ
var otazky = document.querySelectorAll('.faq-question');

// harmonika nejdriv zavre vsechny ostatni polozky a otevre jen tu na kterou se kliklo
for (var i = 0; i < otazky.length; i++) {
  otazky[i].addEventListener('click', function() {
    var polozka = this.parentElement;
    var jeOtevrena = polozka.classList.contains('open');

    var otevrenePolozky = document.querySelectorAll('.faq-item.open');
    for (var k = 0; k < otevrenePolozky.length; k++) {
      otevrenePolozky[k].classList.remove('open');
    }

    if (!jeOtevrena) {
      polozka.classList.add('open');
    }
  });
}
