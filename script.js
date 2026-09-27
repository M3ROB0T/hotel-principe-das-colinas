const WHATSAPP_NUMBER = "5593984182845";
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


let activePhotos = [];
let activePhotoIndex = 0;
const photoDialog = document.querySelector('.photo-dialog');

function showPhoto(index) {
  if (!activePhotos.length) return;
  activePhotoIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activePhotoIndex];
  document.querySelector('#photoImage').src = photo.image;
  document.querySelector('#photoImage').alt = photo.title;
  document.querySelector('#photoCaption').textContent = `${photo.title} · ${activePhotoIndex + 1} / ${activePhotos.length}`;
  photoDialog.querySelectorAll('.photo-prev, .photo-next').forEach(button => button.hidden = activePhotos.length < 2);
}

function openPhoto(photos, index) {
  if (!photos.length) return;
  activePhotos = photos;
  showPhoto(index);
  photoDialog.showModal();
  document.body.classList.add('photo-open');
}

photoDialog.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
photoDialog.querySelector('.photo-prev').addEventListener('click', () => showPhoto(activePhotoIndex - 1));
photoDialog.querySelector('.photo-next').addEventListener('click', () => showPhoto(activePhotoIndex + 1));
photoDialog.addEventListener('close', () => document.body.classList.remove('photo-open'));
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(activePhotoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

function buildGallery() {
  const filters = document.querySelector('.gallery-filters');
  const grid = document.querySelector('#hotelGallery');
  function render(category) {
    const photos = GALLERY.filter(photo => category === 'Todos' || photo.category === category);
    grid.replaceChildren();
    photos.forEach((photo, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-photo';
      button.setAttribute('aria-label', `Ampliar foto: ${photo.title}`);
      const img = document.createElement('img');
      Object.assign(img, {src: photo.image, alt: photo.title, loading: 'lazy', decoding: 'async', width: 960, height: 640});
      const caption = document.createElement('figcaption');
      caption.textContent = photo.title;
      button.append(img);
      button.addEventListener('click', () => openPhoto(photos, index));
      figure.append(button, caption);
      grid.append(figure);
    });
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === category)));
    document.querySelector('.gallery-count').textContent = `${photos.length} fotos · ${category}`;
  }
  ['Todos', ...new Set(GALLERY.map(photo => photo.category))].forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category;
    button.addEventListener('click', () => render(category));
    filters.append(button);
  });
  render('Todos');
}

function wa(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatDate(value){
  if(!value) return "Não informado";
  const [y,m,d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function buildWhatsAppMessage(type, details = {}) {
  const greeting = "Olá, equipe do Hotel Príncipe das Colinas!";
  const source = "Vim pelo catálogo do hotel";
  const confirmation = "A reserva será confirmada pela equipe do hotel, após a consulta de disponibilidade.";

  if (type === "reservation") {
    const name = String(details.name || "").trim();
    const notes = String(details.notes || "").trim();
    return [
      "Solicitação de hospedagem",
      "",
      greeting,
      `${source} e gostaria de consultar a disponibilidade para a minha estadia.`,
      "",
      `Hóspede: ${name || "Não informado"}`,
      `Check-in: ${formatDate(details.checkIn)}`,
      `Check-out: ${formatDate(details.checkOut)}`,
      `Hóspedes: ${details.guests || "Não informado"}`,
      `Suíte de interesse: ${details.suite ? `Suíte ${details.suite}` : "Sem preferência"}`,
      ...(notes ? ["", "Observações:", notes] : []),
      "",
      "Podem me informar a disponibilidade, o valor da estadia e as condições de reserva?",
      "",
      confirmation
    ].join("\n");
  }

  if (type === "suite") {
    return [
      greeting,
      "",
      `${source} e me interessei pela Suíte ${details.suite}.`,
      "Gostaria de saber mais sobre essa suíte e consultar valores e disponibilidade para a minha estadia.",
      "",
      "Podem me ajudar a planejar a hospedagem?",
      "",
      confirmation
    ].join("\n");
  }

  return [
    greeting,
    "",
    `${source} e gostaria de planejar minha hospedagem com vocês.`,
    "Podem me informar as opções de suítes, os valores e a disponibilidade?",
    "",
    "Obrigado pelo atendimento!"
  ].join("\n");
}

function buildSuites(){
  const carousel = document.querySelector("#suiteCarousel");
  const select = document.querySelector("#suite");
  const jump = document.querySelector("#suiteJump");

  SUITES.forEach((suite)=>{
    const reference = suite.imageKind === 'reference';
    const photoTitle = reference ? `Interior do hotel — foto de referência para a consulta da ${suite.title}` : suite.title;
    const card = document.createElement("article");
    card.className = "suite-card";
    card.id = `suite-${suite.number}`;
    card.innerHTML = `
      <div class="suite-media${reference ? ' suite-media-reference' : ''}">
        <button type="button" class="suite-photo" aria-label="Ampliar foto: ${photoTitle}">
          <img src="${suite.image}" alt="${photoTitle}" loading="lazy" decoding="async" width="960" height="720">
          <span class="suite-number" aria-hidden="true">${suite.number}</span>
          <span class="suite-zoom" aria-hidden="true">${reference ? 'Foto de referência · Ampliar' : 'Ampliar foto'} ↗</span>
        </button>
      </div>
      <div class="suite-content">
        <h3>${suite.title}</h3>
        <p>${suite.description}</p>
        <button type="button" class="btn btn-gold suite-btn" data-suite="${suite.number}">
          Consultar disponibilidade
        </button>
      </div>`;

    card.querySelector('.suite-photo').addEventListener('click', () => openPhoto([{image: suite.image, title: photoTitle}], 0));

    carousel.appendChild(card);

    const opt = document.createElement("option");
    opt.value = suite.number;
    opt.textContent = suite.title;
    select.appendChild(opt);
    if (jump) jump.appendChild(opt.cloneNode(true));
  });

  if (jump) {
    jump.addEventListener("change", () => {
      const selectedCard = document.getElementById(`suite-${jump.value}`);
      selectedCard?.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "nearest",
        inline: "start"
      });
    });
  }
}

function setupCarousel(){
  const c = document.querySelector("#suiteCarousel");
  const previous = document.querySelector(".carousel-arrow.prev");
  const next = document.querySelector(".carousel-arrow.next");
  const count = document.querySelector(".suite-count");
  c.tabIndex = 0;
  c.setAttribute("role", "region");
  c.setAttribute("aria-label", "Catálogo de suítes");
  previous.setAttribute("aria-controls", c.id);
  next.setAttribute("aria-controls", c.id);

  const step = () => {
    const cards = c.querySelectorAll(".suite-card");
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : c.clientWidth;
  };
  const move = direction => c.scrollBy({
    left: direction * step(),
    behavior: reducedMotion.matches ? "instant" : "smooth"
  });
  const update = () => {
    previous.disabled = c.scrollLeft <= 2;
    next.disabled = c.scrollLeft + c.clientWidth >= c.scrollWidth - 2;
    if (count) {
      const position = Math.min(SUITES.length, Math.round(c.scrollLeft / step()) + 1);
      count.textContent = `${String(position).padStart(2, "0")} / ${SUITES.length} suítes`;
    }
  };
  next.addEventListener("click", () => move(1));
  previous.addEventListener("click", () => move(-1));
  c.addEventListener("scroll", update, {passive: true});
  window.addEventListener("resize", update, {passive: true});
  c.addEventListener("keydown", event => {
    if (event.target !== c) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      c.scrollTo({left: event.key === "Home" ? 0 : c.scrollWidth, behavior: "instant"});
    }
  });
  update();
}

function setupReveal(){
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});

  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}

function setupParallax(){
  if (reducedMotion.matches || window.matchMedia("(pointer: coarse)").matches) return;
  const items = document.querySelectorAll("[data-parallax]");
  let ticking = false;

  const update = ()=>{
    items.forEach(el=>{
      const speed = parseFloat(el.dataset.parallax || "0.1");
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight/2 - (rect.top + rect.height/2)) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener("scroll",()=>{
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  },{passive:true});
  update();
}

function setupHeader(){
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".main-nav");

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  if (!nav.id) nav.id = "mainNavigation";
  menu.setAttribute("aria-controls", nav.id);
  const setMenuOpen = open => {
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  menu.addEventListener("click",()=>{
    setMenuOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setMenuOpen(false);
      menu.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (getComputedStyle(menu).display === "none") setMenuOpen(false);
  }, {passive: true});
}

function setupSuiteButtons(){
  document.addEventListener("click",(e)=>{
    const btn = e.target.closest(".suite-btn");
    if(!btn) return;
    const suite = btn.dataset.suite;
    const msg = buildWhatsAppMessage("suite", {suite});
    window.open(wa(msg),"_blank","noopener");
  });
}

function setupForm(){
  const form = document.querySelector("#reservationForm");

  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = new FormData(form);
    const msg = buildWhatsAppMessage("reservation", {
      name: data.get("nome"),
      checkIn: data.get("entrada"),
      checkOut: data.get("saida"),
      guests: data.get("hospedes"),
      suite: data.get("suite"),
      notes: data.get("observacao")
    });

    window.open(wa(msg),"_blank","noopener");
  });
}

function setupDirectContact(){
  const msg = buildWhatsAppMessage("contact");
  document.querySelector("#whatsappContact").href = wa(msg);
  document.querySelector("#floatingWhatsapp").href = wa(msg);
}

function imageFallbacks(){
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      if(img.closest(".suite-media")) return;
      img.style.opacity = ".18";
    });
  });
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();

buildGallery();
buildSuites();
setupCarousel();
setupReveal();
setupParallax();
setupHeader();
setupSuiteButtons();
setupForm();
setupDirectContact();
imageFallbacks();
