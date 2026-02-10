document.addEventListener("DOMContentLoaded", () => {
  const label = document.getElementById("selectedName");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImg = document.getElementById("modalImg");
  const modalDesc = document.getElementById("modalDesc");
  const modalBadges = document.getElementById("modalBadges");
  const imgLoader = document.getElementById("imgLoader");
  
  // Statistiques
  const totalClicksEl = document.getElementById("totalClicks");
  const lastVisitedEl = document.getElementById("lastVisited");
  
  const govs = document.querySelectorAll("svg .gov");
  
  let exploredRegions = new Set();
  let currentSelected = null;

  govs.forEach((el) => {
    el.addEventListener("click", () => {
      const name = el.id.replaceAll(" ", "_");
      
      // Retirer la classe 'selected' de l'ancien élément
      if (currentSelected) {
        currentSelected.classList.remove("selected");
      }
      
      // Ajouter la classe 'selected' au nouveau
      el.classList.add("selected");
      currentSelected = el;

      // Mettre à jour les stats
      exploredRegions.add(name);
      totalClicksEl.textContent = exploredRegions.size;
      lastVisitedEl.textContent = formatRegionName(name);

      // Texte sous la carte avec animation
      label.classList.add("active");
      label.innerHTML = `Gouvernorat : <strong>${formatRegionName(name)}</strong>`;

      // Contenu de la modal
      const data = governorateData[name];
      modalTitle.textContent = formatRegionName(name);
      
      // Badges dynamiques
      if (data) {
        modalBadges.innerHTML = `
          ${data.population ? `<span class="badge primary">👥 ${data.population}</span>` : ''}
          ${data.area ? `<span class="badge success">📏 ${data.area}</span>` : ''}
          ${data.specialty ? `<span class="badge warning">⭐ ${data.specialty}</span>` : ''}
        `;
      } else {
        modalBadges.innerHTML = '';
      }
      
      // Gestion du chargement de l'image
      imgLoader.classList.remove("hidden");
      modalImg.classList.remove("loaded");
      modalImg.src = `images/${name}.jpg`;
      modalImg.alt = `Photo de ${formatRegionName(name)}`;
      
      modalImg.onload = () => {
        imgLoader.classList.add("hidden");
        modalImg.classList.add("loaded");
      };
      
      modalImg.onerror = () => {
        imgLoader.classList.add("hidden");
        modalImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23111824' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23a9b6c7' font-size='18' font-family='system-ui'%3EImage non disponible%3C/text%3E%3C/svg%3E";
        modalImg.classList.add("loaded");
      };
      
      modalDesc.textContent = descriptions[name] || "Description indisponible.";

      // Ouvrir la modal
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      
      // Focus sur le bouton de fermeture pour l'accessibilité
      setTimeout(() => {
        modal.querySelector(".modal__close").focus();
      }, 100);
    });
    
    // Effet au clavier (Enter et Space)
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
    
    // Rendre les gouvernorats focusables
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Gouvernorat de ${el.id}`);
  });
});

// ===== FERMETURE DE LA MODAL =====
const modal = document.getElementById("modal");

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  
  // Retirer le focus
  document.activeElement.blur();
}

// Clic sur le bouton X ou backdrop
modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close='true']")) {
    closeModal();
  }
});

// Touche ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

// ===== HELPER FUNCTIONS =====
function formatRegionName(name) {
  return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// ===== DONNÉES ENRICHIES =====
const governorateData = {
  TATAOUINE: { population: "~150K hab.", area: "38 889 km²", specialty: "Décors Star Wars" },
  KAIROUAN: { population: "~570K hab.", area: "6 712 km²", specialty: "UNESCO" },
  SILIANA: { population: "~220K hab.", area: "4 631 km²", specialty: "Céréales" },
  SIDI_BOUZID: { population: "~430K hab.", area: "7 405 km²", specialty: "Agriculture" },
  GAFSA: { population: "~340K hab.", area: "8 990 km²", specialty: "Phosphate" },
  TOZEUR: { population: "~110K hab.", area: "5 593 km²", specialty: "Oasis" },
  KEBILI: { population: "~160K hab.", area: "22 084 km²", specialty: "Dattes" },
  MEDENINE: { population: "~480K hab.", area: "9 167 km²", specialty: "Ksour" },
  GABES: { population: "~380K hab.", area: "7 175 km²", specialty: "Oasis maritime" },
  SFAX: { population: "~1M hab.", area: "7 545 km²", specialty: "Industrie" },
  SOUSSE: { population: "~700K hab.", area: "2 669 km²", specialty: "Tourisme" },
  MONASTIR: { population: "~550K hab.", area: "1 019 km²", specialty: "Ribat" },
  MAHDIA: { population: "~430K hab.", area: "2 966 km²", specialty: "Pêche" },
  NABEUL: { population: "~790K hab.", area: "2 788 km²", specialty: "Céramique" },
  TUNIS: { population: "~1.1M hab.", area: "346 km²", specialty: "Capitale" },
  ARIANA: { population: "~580K hab.", area: "482 km²", specialty: "Résidentiel" },
  BEN_AROUS: { population: "~630K hab.", area: "761 km²", specialty: "Industrie" },
  MANNOUBA: { population: "~420K hab.", area: "1 137 km²", specialty: "Université" },
  BIZERTE: { population: "~570K hab.", area: "3 685 km²", specialty: "Port" },
  BEJA: { population: "~300K hab.", area: "3 740 km²", specialty: "Grenier" },
  JENDOUBA: { population: "~400K hab.", area: "3 102 km²", specialty: "Forêts" },
  ZAGHOUAN: { population: "~180K hab.", area: "2 768 km²", specialty: "Temple des eaux" },
  KASSERINE: { population: "~440K hab.", area: "8 066 km²", specialty: "Mont Chaambi" },
  KEF: { population: "~240K hab.", area: "5 081 km²", specialty: "Histoire" }
};

// ===== DESCRIPTIONS =====
const descriptions = {
  TATAOUINE: "Région saharienne du sud tunisien, Tataouine est connue pour ses paysages désertiques et ses ksour traditionnels. Elle possède un riche patrimoine berbère et une architecture unique. La région est également célèbre pour ses décors de films.",
  KAIROUAN: "Ville historique et spirituelle de la Tunisie, Kairouan est classée au patrimoine mondial de l'UNESCO. Elle est réputée pour la Grande Mosquée et son rôle majeur dans l'histoire islamique. Son artisanat est très apprécié.",
  SILIANA: "Située au nord-ouest, Siliana se distingue par ses reliefs, ses forêts et son agriculture. La région est connue pour la culture des céréales et de l'olivier. Elle offre un cadre naturel calme et authentique.",
  SIDI_BOUZID: "Gouvernorat du centre tunisien à vocation agricole, Sidi Bouzid est un acteur clé dans la production de fruits et légumes. Il occupe une place importante dans l'histoire contemporaine du pays. La région est majoritairement rurale.",
  GAFSA: "Riche en ressources minières, Gafsa est un centre majeur de production de phosphate. Elle possède également des oasis et un patrimoine antique important. La région joue un rôle économique stratégique.",
  TOZEUR: "Célèbre pour ses oasis et son architecture en briques traditionnelles, Tozeur est une destination touristique majeure. Elle est située aux portes du désert du Sahara. Son artisanat est unique.",
  KEBILI: "Gouvernorat saharien connu pour ses vastes oasis et le lac Chott El Jerid. Kébili est une région agricole importante, notamment pour les dattes. Elle offre des paysages désertiques impressionnants.",
  MEDENINE: "Située au sud-est, Médenine est connue pour ses ksour et son héritage berbère. Elle joue un rôle important dans le commerce régional. La région combine tradition et modernité.",
  GABES: "Ville côtière du sud, Gabès possède l'une des rares oasis maritimes au monde. Elle est un pôle industriel et agricole important. Son écosystème est unique en Tunisie.",
  SFAX: "Deuxième pôle économique du pays, Sfax est un centre industriel et commercial majeur. La ville est réputée pour son port et son dynamisme économique. Son patrimoine culturel est riche.",
  SOUSSE: "Ville touristique par excellence, Sousse est connue pour sa médina classée à l'UNESCO. Elle combine histoire, plages et activités modernes. Son économie est tournée vers le tourisme.",
  MONASTIR: "Ville côtière historique, Monastir est célèbre pour son ribat et son rôle culturel. Elle est également un centre universitaire important. Le tourisme y est très développé.",
  MAHDIA: "Ancienne capitale fatimide, Mahdia est une ville paisible au bord de la mer. Elle est connue pour ses plages et sa médina. La pêche est une activité clé.",
  NABEUL: "Située au Cap Bon, Nabeul est réputée pour son artisanat et sa céramique. La région est aussi agricole et touristique. Elle offre un mélange de traditions et de modernité.",
  TUNIS: "Capitale de la Tunisie, Tunis est le centre politique, économique et culturel du pays. Elle abrite une médina classée à l'UNESCO. La ville combine histoire et vie moderne.",
  ARIANA: "Gouvernorat urbain proche de la capitale, Ariana est un centre résidentiel et économique. Elle est connue pour ses espaces verts et ses institutions. Son développement est rapide.",
  BEN_AROUS: "Situé au sud de Tunis, Ben Arous est un pôle industriel important. Il joue un rôle clé dans l'économie nationale. La région est fortement urbanisée.",
  MANNOUBA: "La Manouba est une région agricole et universitaire proche de la capitale. Elle est connue pour ses terres fertiles. Son développement est en pleine croissance.",
  BIZERTE: "Ville portuaire du nord, Bizerte possède un important patrimoine maritime. Elle est connue pour son vieux port et ses plages. La pêche y est très présente.",
  BEJA: "Région agricole majeure, Béja est souvent appelée le grenier de la Tunisie. Elle produit céréales et produits laitiers. Son paysage est verdoyant.",
  JENDOUBA: "Située à l'extrême nord-ouest, Jendouba est riche en forêts et terres agricoles. Elle est proche de sites antiques importants. La région est très verte.",
  ZAGHOUAN: "Zaghouan est connue pour son patrimoine romain et ses montagnes. Elle abrite le temple des eaux. La région est riche en histoire et en nature.",
  KASSERINE: "Gouvernorat montagneux du centre-ouest, Kasserine est marqué par le mont Chaambi. L'agriculture et l'élevage y sont dominants. La région possède un fort potentiel naturel.",
  KEF: "Ville du nord-ouest au riche passé historique, Le Kef est connue pour ses monuments et sa culture. Elle offre un cadre montagneux agréable. Son patrimoine est remarquable."
};