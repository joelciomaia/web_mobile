// 1. DADOS: alterar este objeto é a forma mais simples de incluir novos conteúdos.
const courses = {
  web: {
    title: "Desenvolvimento Web", year: "2º ano", icon: "</>",
    description: "Crie interfaces que funcionam em diferentes telas e entenda como estrutura, aparência e comportamento se encontram na web.",
    topics: ["HTML semântico", "CSS responsivo", "DOM e eventos", "Projeto de site completo"]
  },
  mobile: {
    title: "Desenvolvimento Mobile", year: "2º ano", icon: "▯",
    description: "Explore os princípios usados na criação de aplicativos e experiências pensadas para celulares e tablets.",
    topics: ["Interfaces mobile", "Navegação entre telas", "Eventos e interação", "Prototipação de aplicativos"]
  },
  programacao: {
    title: "Linguagem de Programação", year: "2º ano", icon: "{ }",
    description: "Use JavaScript para dar instruções ao computador e transformar páginas estáticas em experiências interativas.",
    topics: ["Variáveis e tipos de dados", "Condições e repetições", "Funções", "Arrays e objetos"]
  },
  redes: {
    title: "Redes de Computadores", year: "2º ano", icon: "⌁",
    description: "Compreenda como computadores trocam informações, do endereço IP aos serviços disponíveis na internet.",
    topics: ["Modelos de rede", "Endereçamento IP", "Protocolos", "Segurança básica"]
  },
  logica: {
    title: "Lógica de Programação", year: "1º ano", icon: "◇",
    description: "Desenvolva o raciocínio necessário para analisar problemas e propor sequências eficientes de solução.",
    topics: ["Algoritmos", "Fluxogramas", "Estruturas de decisão", "Estruturas de repetição"]
  },
  informatica: {
    title: "Introdução à Informática", year: "1º ano", icon: "⌘",
    description: "Construa uma base sólida sobre computadores, sistemas operacionais, arquivos, internet e tecnologia no cotidiano.",
    topics: ["Hardware e software", "Sistemas operacionais", "Organização de arquivos", "Cidadania digital"]
  },
  banco: {
    title: "Banco de Dados", year: "1º ano", icon: "▤",
    description: "Aprenda a organizar dados de forma consistente para que sistemas possam armazenar, localizar e relacionar informações.",
    topics: ["Modelagem de dados", "Tabelas e relacionamentos", "Introdução ao SQL", "Consultas básicas"]
  },
  manutencao: {
    title: "Montagem e Manutenção", year: "1º ano", icon: "⚙",
    description: "Conheça os componentes de um computador e desenvolva procedimentos seguros de montagem e diagnóstico.",
    topics: ["Componentes internos", "Montagem segura", "Manutenção preventiva", "Diagnóstico de falhas"]
  },
  sistemas: {
    title: "Desenvolvimento de Sistemas", year: "3º ano", icon: "⌬",
    description: "Planeje e desenvolva aplicações completas, conectando a interface às regras de negócio e ao armazenamento de dados.",
    topics: ["Arquitetura em camadas", "Requisitos transformados em código", "Integração entre componentes", "Testes da aplicação"]
  },
  modelagem: {
    title: "Modelagem de Sistemas", year: "3º ano", icon: "▦",
    description: "Represente como um sistema deve funcionar antes da implementação, tornando requisitos e decisões mais claros para toda a equipe.",
    topics: ["Levantamento de requisitos", "Casos de uso", "Diagramas UML", "Prototipação e documentação"]
  },
  implantacao: {
    title: "Implantação e Manutenção de Sistemas", year: "3º ano", icon: "⇧",
    description: "Prepare sistemas para uso real e aprenda a acompanhar, corrigir e atualizar uma aplicação depois da publicação.",
    topics: ["Controle de versões e releases", "Configuração de ambientes", "Implantação", "Monitoramento e suporte"]
  },
  integrador: {
    title: "Projeto Integrador", year: "3º ano", icon: "✦",
    description: "Aplique os conhecimentos construídos durante o curso para resolver um problema real por meio de um projeto desenvolvido em equipe.",
    topics: ["Definição do problema", "Planejamento do projeto", "Integração das disciplinas", "Testes, documentação e apresentação"]
  }
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

// 2. BUSCA E FILTROS
const searchInput = $("#searchInput");
const clearSearch = $("#clearSearch");
let activeFilter = "all";

function filterCards() {
  const term = searchInput.value.toLowerCase().trim();
  let visibleCards = 0;

  $$(".subject-card").forEach(card => {
    const matchesYear = activeFilter === "all" || card.dataset.year === activeFilter;
    const matchesSearch = card.dataset.search.includes(term) || $("h3", card).textContent.toLowerCase().includes(term);
    card.hidden = !(matchesYear && matchesSearch);
    if (!card.hidden) visibleCards++;
  });

  $("#emptyState").hidden = visibleCards !== 0;
  clearSearch.hidden = term === "";
}

searchInput.addEventListener("input", filterCards);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  filterCards();
});

$$('.filter').forEach(button => button.addEventListener("click", () => {
  $$(".filter").forEach(item => item.classList.remove("is-active"));
  button.classList.add("is-active");
  activeFilter = button.dataset.filter;
  filterCards();
}));

// 3. MODAL DE DETALHES E LOCALSTORAGE
const modal = $("#courseModal");
const saveCourseButton = $("#saveCourse");
let currentCourse = null;
let savedCourses = JSON.parse(localStorage.getItem("tecnotrilha-courses") || "[]");

function openCourse(id) {
  const course = courses[id];
  if (!course) return;
  currentCourse = id;
  $("#modalIcon").textContent = course.icon;
  $("#modalYear").textContent = course.year;
  $("#modalTitle").textContent = course.title;
  $("#modalDescription").textContent = course.description;
  $("#modalTopics").innerHTML = course.topics.map(topic => `<li>${topic}</li>`).join("");
  updateSaveButton();
  modal.showModal();
}

function updateSaveButton() {
  const isSaved = savedCourses.includes(currentCourse);
  saveCourseButton.textContent = isSaved ? "✓ Adicionada à minha trilha" : "+ Adicionar à minha trilha";
}

function saveTrail() {
  localStorage.setItem("tecnotrilha-courses", JSON.stringify(savedCourses));
  $("#trailCount").textContent = savedCourses.length;
  renderTrail();
}

function toggleCourse(id) {
  const index = savedCourses.indexOf(id);
  if (index >= 0) {
    savedCourses.splice(index, 1);
    showToast("Disciplina removida da trilha");
  } else {
    savedCourses.push(id);
    showToast("Disciplina adicionada à trilha");
  }
  saveTrail();
  updateSaveButton();
}

$$('[data-course]').forEach(button => button.addEventListener("click", () => openCourse(button.dataset.course)));
$$('[data-close-modal]').forEach(button => button.addEventListener("click", () => modal.close()));
modal.addEventListener("click", event => { if (event.target === modal) modal.close(); });
saveCourseButton.addEventListener("click", () => toggleCourse(currentCourse));

// 4. GAVETA "MINHA TRILHA"
const trailDrawer = $("#trailDrawer");
const pageOverlay = $("#pageOverlay");

function renderTrail() {
  const list = $("#trailList");
  if (!savedCourses.length) {
    list.innerHTML = '<div class="trail-empty"><span>◇</span><strong>Sua trilha está vazia</strong><p>Adicione disciplinas para montar sua sequência de estudos.</p></div>';
    return;
  }

  list.innerHTML = savedCourses.map(id => {
    const course = courses[id];
    return `<article class="trail-item">
      <span class="trail-item__icon">${course.icon}</span>
      <div><strong>${course.title}</strong><small>${course.year}</small></div>
      <button type="button" data-remove="${id}" aria-label="Remover ${course.title}">×</button>
    </article>`;
  }).join("");

  $$('[data-remove]', list).forEach(button => button.addEventListener("click", () => toggleCourse(button.dataset.remove)));
}

function setDrawer(open) {
  trailDrawer.classList.toggle("is-open", open);
  pageOverlay.classList.toggle("is-visible", open);
  trailDrawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-locked", open);
}

$("#openTrail").addEventListener("click", () => setDrawer(true));
$("#closeTrail").addEventListener("click", () => setDrawer(false));
pageOverlay.addEventListener("click", () => setDrawer(false));

// 5. CARROSSEL
const slides = $$(".hero__slide");
const dots = $$("[data-go-to]");
let currentSlide = 0;
let carouselTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === currentSlide));
}

function startCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showSlide(currentSlide + 1), 6500);
}

$("#previousSlide").addEventListener("click", () => { showSlide(currentSlide - 1); startCarousel(); });
$("#nextSlide").addEventListener("click", () => { showSlide(currentSlide + 1); startCarousel(); });
dots.forEach(dot => dot.addEventListener("click", () => { showSlide(Number(dot.dataset.goTo)); startCarousel(); }));

// 6. MENU, TEMA E FAQ
const menuButton = $("#menuButton");
const menu = $("#menu");
menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});
$$('#menu a').forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const themeButton = $("#themeButton");
const savedTheme = localStorage.getItem("tecnotrilha-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
}

themeButton.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  localStorage.setItem("tecnotrilha-theme", isDark ? "light" : "dark");
  updateThemeButton();
});

$$('.accordion__item button').forEach(button => button.addEventListener("click", () => {
  const answer = button.nextElementSibling;
  const open = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!open));
  $("b", button).textContent = open ? "+" : "−";
  answer.hidden = open;
}));

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

// 7. MODO APRESENTAÇÃO
// Uma sequência guiada baseada no roteiro da feira. O site continua funcionando
// normalmente fora deste modo e nenhum código precisa ser exibido ao público.
const presentationSteps = [
  {
    section: "Introdução",
    kicker: "Portal Trilha Técnica + MiniGram",
    title: "Dois projetos, duas formas de criar",
    description: "Uma apresentação guiada sobre como estrutura, aparência e comportamento trabalham juntos na Web e no Android.",
    cue: "A página inicial do portal e o objetivo dos dois projetos.",
    anchor: "#inicio",
    mode: "intro"
  },
  {
    section: "Portal Trilha Técnica",
    kicker: "Desenvolvimento Web",
    title: "Informação organizada para facilitar a navegação",
    description: "O portal reúne conteúdos do Curso Técnico em Informática em um cabeçalho, menu, seções e recursos de estudo.",
    cue: "Cabeçalho, menu principal, banner e seções de conteúdo.",
    anchor: "#inicio",
    mode: "portal"
  },
  {
    section: "HTML",
    kicker: "Estrutura do conteúdo",
    title: "O esqueleto que define o que existe na página",
    description: "Os contornos percorrem toda a página e revelam cabeçalho, navegação, seções, artigos, listas, conteúdo visual e rodapé.",
    cue: "A rolagem é automática: acompanhe a estrutura do topo ao rodapé e depois de volta ao início.",
    anchor: "#inicio",
    mode: "html",
    demo: "html"
  },
  {
    section: "CSS",
    kicker: "Aparência e organização visual",
    title: "A mesma estrutura, várias aparências",
    description: "Enquanto esta etapa permanece aberta, o CSS muda automaticamente cores, cantos, espaços e sombras sem alterar o conteúdo.",
    cue: "A sequência é automática: acompanhe no painel cores, cantos, espaçamento, sombras e a versão sem CSS.",
    anchor: "#inicio",
    mode: "css",
    demo: "css"
  },
  {
    section: "JavaScript",
    kicker: "Interatividade",
    title: "Veja onde o JavaScript entra em ação",
    description: "Marcadores identificam cada região interativa e o portal percorre sozinho cliques, digitação, filtros, janelas e respostas da interface.",
    cue: "Acompanhe a demonstração automática ou clique em qualquer marcador para repetir uma ação específica.",
    anchor: "#inicio",
    mode: "js",
    demo: "js"
  },
  {
    section: "MiniGram",
    kicker: "Desenvolvimento Mobile",
    title: "Desenvolvimento Mobile na prática: construindo o MiniGram",
    description: "Na disciplina de Desenvolvimento Mobile, o XML monta as telas, o Java programa as ações e o Android executa o aplicativo.",
    cue: "Use a timeline real do MiniGram para apresentar as tecnologias trabalhadas na disciplina.",
    mode: "slide",
    visual: "mobile"
  },
  {
    section: "XML",
    kicker: "Estrutura da interface Android",
    title: "O XML organiza o que aparece na tela",
    description: "Textos, botões, campos e espaços para imagens formam a estrutura visual que o usuário encontra no aplicativo.",
    cue: "No MiniGram real, aponte uma foto, um texto, um campo ou um botão.",
    mode: "slide",
    visual: "xml"
  },
  {
    section: "Java",
    kicker: "Funcionamento do aplicativo",
    title: "O toque dispara uma ação programada",
    description: "A sequência real mostra o Java abrindo o seletor do Android, recebendo a foto escolhida, exibindo a prévia e adicionando a publicação ao feed.",
    cue: "Avance manualmente pelas imagens: selecionar, adicionar, visualizar e publicar.",
    mode: "slide",
    visual: "java"
  },
  {
    section: "Web × Mobile",
    kicker: "Comparação",
    title: "Web x Android nativo",
    description: "Compare onde cada projeto abre, quais tecnologias formam a interface, como o comportamento é programado e como o usuário acessa a aplicação.",
    cue: "Portal Web: HTML, CSS e JavaScript. MiniGram nativo: XML e Java.",
    mode: "slide",
    visual: "compare"
  }
];

const presentationShell = $("#presentationShell");
const presentationSlide = $("#presentationSlide");
const presentationPalette = $("#presentationPalette");
const presentationJsMap = $("#presentationJsMap");
const presentationJsMarkers = $("#presentationJsMarkers");
const presentationJsSpotlight = $("#presentationJsSpotlight");
const presentationButton = $("#presentationButton");
const presentationGuide = $("#presentationGuide");
const presentationPrevious = $("#presentationPrevious");
const presentationNext = $("#presentationNext");
const presentationExit = $("#presentationExit");
const presentationModes = ["presentation-intro", "presentation-portal", "presentation-html", "presentation-css", "presentation-js", "presentation-slide-active"];
let presentationActive = false;
let presentationCurrentStep = 0;
let presentationOwnsFullscreen = false;
let presentationOriginalState = null;
let presentationDemoTimers = [];
let presentationFocusTimer;
let presentationHtmlInterval;
let presentationHtmlStartTimer;
let presentationHtmlAnchorIndex = -1;
let presentationHtmlDirection = 1;
let presentationCssInterval;
let presentationCssStartTimer;
let presentationCssAutoFeatureIndex = -1;
let presentationCssUnstyled = false;
let presentationJsInterval;
let presentationJsStartTimer;
let presentationJsRegionIndex = -1;
let presentationJsExecuting = false;
let presentationJsFocusedTarget = null;
let minigramSequenceController = null;

const htmlTourStops = [
  { selector: "#inicio", label: "cabeçalho, navegação e destaque principal" },
  { selector: ".search-area", label: "seção e campo de busca" },
  { selector: "#disciplinas", label: "início da seção e lista de disciplinas" },
  { selector: ".subject-card:nth-child(5)", label: "continuação dos artigos de disciplinas" },
  { selector: ".subject-card:nth-child(9)", label: "últimos artigos da lista de disciplinas" },
  { selector: "#trilha", label: "seção e lista ordenada de etapas" },
  { selector: "#sobre", label: "seção e artigos de benefícios" },
  { selector: "#duvidas", label: "seção e artigos de perguntas" },
  { selector: ".footer", label: "rodapé da página" }
];

const cssFeatureOrder = ["colors", "corners", "fonts", "sizes", "spacing", "shadows"];
const cssFeatureOptions = {
  colors: {
    label: "CORES",
    icon: "●",
    summary: "A paleta muda em toda a página, enquanto o conteúdo e a estrutura permanecem iguais.",
    options: [
      { name: "ORIGINAL", className: null },
      { name: "OCEANO", className: "presentation-css-colors" },
      { name: "PÔR DO SOL", className: "presentation-css-colors-sunset" },
      { name: "NEON", className: "presentation-css-colors-berry" }
    ]
  },
  corners: {
    label: "CANTOS",
    icon: "⌜",
    summary: "O raio dos cantos altera a personalidade de botões, cartões, campos e seções.",
    options: [
      { name: "ORIGINAIS", className: null },
      { name: "RETOS", className: "presentation-css-corners-square" },
      { name: "SUAVES", className: "presentation-css-corners-soft" },
      { name: "CRIATIVOS", className: "presentation-css-corners" }
    ]
  },
  fonts: {
    label: "FONTES",
    icon: "Aa",
    summary: "A família tipográfica muda o tom do portal inteiro: editorial, amigável ou técnico.",
    options: [
      { name: "ORIGINAL", className: null },
      { name: "EDITORIAL", className: "presentation-css-font-serif" },
      { name: "AMIGÁVEL", className: "presentation-css-font-friendly" },
      { name: "TÉCNICA", className: "presentation-css-font-mono" }
    ]
  },
  sizes: {
    label: "TAMANHOS",
    icon: "A↕",
    summary: "A escala tipográfica aumenta ou diminui títulos, textos, botões e componentes do site.",
    options: [
      { name: "ORIGINAL", className: null },
      { name: "COMPACTO", className: "presentation-css-size-small" },
      { name: "GRANDE", className: "presentation-css-size-large" },
      { name: "GIGANTE", className: "presentation-css-size-xl" }
    ]
  },
  spacing: {
    label: "ESPAÇAMENTO",
    icon: "↔",
    summary: "Margens, preenchimentos e distâncias controlam a densidade e a organização da página.",
    options: [
      { name: "ORIGINAL", className: null },
      { name: "COMPACTO", className: "presentation-css-spacing-compact" },
      { name: "AREJADO", className: "presentation-css-spacing" }
    ]
  },
  shadows: {
    label: "SOMBRAS",
    icon: "◒",
    summary: "Tamanho, intensidade e cor das sombras mudam a profundidade dos elementos em todo o site.",
    options: [
      { name: "ORIGINAIS", className: null },
      { name: "SUAVES", className: "presentation-css-shadows-soft" },
      { name: "COLORIDAS", className: "presentation-css-shadows" },
      { name: "DRAMÁTICAS", className: "presentation-css-shadows-bold" }
    ]
  }
};
const presentationCssSelections = Object.fromEntries(cssFeatureOrder.map(feature => [feature, 0]));
const presentationCssClassNames = Object.values(cssFeatureOptions)
  .flatMap(feature => feature.options.map(option => option.className))
  .filter(Boolean)
  .concat("presentation-css-unstyled");

const javascriptRegions = [
  { id: "carousel", title: "Carrossel", action: "Clique nas setas", result: "troca o destaque", selector: "#nextSlide", anchor: "#inicio", placement: "above" },
  { id: "theme", title: "Tema", action: "Clique no botão", result: "muda as cores", selector: "#themeButton", anchor: "#inicio", placement: "below-left" },
  { id: "trail", title: "Minha trilha", action: "Clique no botão", result: "abre itens salvos", selector: "#openTrail", anchor: "#inicio", placement: "below-right" },
  { id: "search", title: "Busca", action: "Digite uma palavra", result: "filtra os cards", selector: ".search-box__input", anchor: ".search-area", placement: "below" },
  { id: "filters", title: "Filtros", action: "Escolha um ano", result: "muda a lista", selector: ".filters", anchor: "#disciplinas", placement: "above" },
  { id: "course", title: "Detalhes", action: "Clique em uma disciplina", result: "abre informações", selector: ".subject-card[data-year=\"2\"] button", anchor: "#disciplinas", placement: "right" },
  { id: "faq", title: "Perguntas", action: "Clique na pergunta", result: "abre a resposta", selector: ".accordion__item:nth-child(2) button", anchor: "#duvidas", placement: "left" }
];

// Os rótulos são adicionados por JavaScript para manter o HTML normal limpo.
[
  [".header", "<header> cabeçalho"],
  [".nav", "<nav> menu"],
  [".hero__frame", "<section> destaque"],
  [".hero__copy", "<div> conteúdo textual"],
  [".hero__visual", "<div> conteúdo visual"],
  [".search-area", "<section> busca"],
  [".search-box", "<div> campo de busca"],
  [".subjects", "<section> disciplinas"],
  [".subject-grid", "<div> lista de conteúdos"],
  [".subject-card", "<article> disciplina"],
  [".path", "<section> trilha"],
  [".path__steps", "<ol> etapas"],
  [".path__steps li", "<li> etapa"],
  [".about", "<section> sobre"],
  [".benefits article", "<article> benefício"],
  [".faq", "<section> perguntas"],
  [".accordion__item", "<article> pergunta"],
  [".cta", "<section> chamada final"],
  [".footer", "<footer> rodapé"]
].forEach(([selector, label]) => {
  $$(selector).forEach(element => { element.dataset.htmlLabel = label; });
});

[
  [".hero__frame", "cor + composição"],
  [".hero__copy h1", "tipografia"],
  [".button--light", "botão + estados"],
  [".search-box", "espaçamento"],
  [".subject-card", "card + sombra"]
].forEach(([selector, label]) => {
  const element = $(selector);
  if (element) element.dataset.cssLabel = label;
});

[
  ["#nextSlide", "Carrossel: clique para trocar o destaque"],
  ["#themeButton", "Tema: clique para trocar as cores"],
  ["#openTrail", "Minha trilha: clique para abrir"],
  [".search-box__input", "Busca: digite para filtrar"],
  [".filters", "Filtros: escolha um ano"],
  [".subject-card[data-year=\"2\"] button", "Detalhes: clique para abrir"],
  [".accordion__item:nth-child(2) button", "Pergunta: clique para responder"]
].forEach(([selector, label]) => {
  const element = $(selector);
  if (element) element.dataset.jsLabel = label;
});

function presentationVisual(type) {
  if (type === "mobile") {
    return `<div class="presentation-visual presentation-minigram-overview">
      <figure class="minigram-phone-shot minigram-phone-shot--intro">
        <img src="assets/minigram/01-timeline-limpa.png" alt="Timeline inicial real do MiniGram no Android">
        <figcaption>Captura real do aplicativo no emulador Android</figcaption>
      </figure>
      <div class="minigram-explainer">
        <span class="presentation-visual__eyebrow">Disciplina · Desenvolvimento Mobile</span>
        <h2>Desenvolvimento Mobile na prática: <em>construindo o MiniGram.</em></h2>
        <p>O projeto mostra como XML, Java e Android trabalham juntos para criar um aplicativo que funciona no celular.</p>
        <div class="presentation-tech-list">
          <span><b>XML</b><small>monta a tela</small></span>
          <span><b>Java</b><small>responde aos toques</small></span>
          <span><b>Android</b><small>executa o aplicativo</small></span>
        </div>
        <div class="minigram-equation"><strong>Interface</strong><span>+</span><strong>Ação</strong><span>=</span><strong>Experiência</strong></div>
      </div>
    </div>`;
  }

  if (type === "xml") {
    return `<div class="presentation-visual presentation-minigram-lesson presentation-minigram-xml">
      <figure class="minigram-phone-shot minigram-annotated minigram-annotated--xml-timeline">
        <img src="assets/minigram/01-timeline-limpa.png" alt="Timeline do MiniGram com os elementos do XML destacados por contornos pontilhados">
        <span class="minigram-hotspot minigram-hotspot--silent" aria-label="Cabeçalho do perfil" style="--x:3.5%;--y:5.7%;--w:93%;--h:7%;--delay:.2s"></span>
        <span class="minigram-hotspot minigram-hotspot--silent" aria-label="Campo de texto da publicação" style="--x:3.5%;--y:13.3%;--w:93%;--h:7.4%;--delay:.9s"></span>
        <span class="minigram-hotspot minigram-hotspot--silent" aria-label="Botões Selecionar imagens e Publicar" style="--x:28.5%;--y:22.6%;--w:68.5%;--h:6.2%;--delay:1.6s"></span>
        <span class="minigram-hotspot minigram-hotspot--silent" aria-label="Timeline de publicações" style="--x:3%;--y:30.2%;--w:94%;--h:62%;--delay:2.3s"></span>
      </figure>
      <div class="minigram-explainer">
        <span class="presentation-visual__eyebrow">XML · estrutura visual</span>
        <h2>O XML define <em>o que existe</em> na tela.</h2>
        <p>Ele organiza dimensões, posições, textos, cores e identificadores que o Java encontra depois.</p>
        <ul class="minigram-component-list">
          <li><code>ImageView</code><span>mostra fotos de perfil e publicações</span></li>
          <li><code>EditText</code><span>cria o campo “No que você está pensando?”</span></li>
          <li><code>Button</code><span>cria os botões Selecionar imagens e Publicar</span></li>
          <li><code>ScrollView</code><span>permite percorrer a timeline</span></li>
        </ul>
      </div>
    </div>`;
  }

  if (type === "java") {
    return `<div class="presentation-visual presentation-minigram-lesson presentation-minigram-java">
      <div class="minigram-sequence-stage">
        <div class="minigram-phone-sequence" aria-label="Sequência manual da publicação de uma foto no MiniGram">
          <figure class="minigram-sequence-frame is-active" data-caption="Toque em “Selecionar imagens”">
            <img src="assets/minigram/01-timeline-limpa.png" alt="Timeline do MiniGram antes da publicação" decoding="async">
            <i class="minigram-tap" aria-hidden="true" style="--tap-x:50%;--tap-y:25.5%"></i>
          </figure>
          <figure class="minigram-sequence-frame" data-caption="Escolha a foto dos cavalos">
            <img src="assets/minigram/02-galeria-limpa.png" alt="Seletor de fotos do Android com duas imagens" decoding="async">
            <i class="minigram-tap" aria-hidden="true" style="--tap-x:16.5%;--tap-y:34.5%"></i>
          </figure>
          <figure class="minigram-sequence-frame" data-caption="Confirme em “Adicionar (1)”">
            <img src="assets/minigram/03-foto-selecionada-limpa.png" alt="Foto dos cavalos selecionada e botão Adicionar" decoding="async">
            <i class="minigram-tap" aria-hidden="true" style="--tap-x:82.5%;--tap-y:90.8%"></i>
          </figure>
          <figure class="minigram-sequence-frame" data-caption="Com a prévia pronta, toque em “Publicar”">
            <img src="assets/minigram/04-preview-limpa.png" alt="Prévia da foto escolhida no MiniGram" decoding="async">
            <i class="minigram-tap" aria-hidden="true" style="--tap-x:85%;--tap-y:36.3%"></i>
          </figure>
          <figure class="minigram-sequence-frame" data-caption="A nova publicação aparece no topo da timeline">
            <img src="assets/minigram/05-publicacao-limpa.png" alt="Nova publicação exibida no topo da timeline do MiniGram" decoding="async">
          </figure>
        </div>
        <p class="minigram-sequence-caption" id="minigramSequenceCaption">Toque em “Selecionar imagens”</p>
        <div class="minigram-sequence-controls" aria-label="Controlar imagens da demonstração">
          <button type="button" id="minigramSequencePrevious">Anterior</button>
          <span id="minigramSequenceProgress">1 de 5</span>
          <button type="button" id="minigramSequenceNext">Próxima</button>
        </div>
      </div>
      <div class="minigram-explainer">
        <span class="presentation-visual__eyebrow">Java · comportamento</span>
        <h2>O Java transforma o toque em <em>resultado.</em></h2>
        <ol class="minigram-java-steps">
          <li class="is-active"><code>setOnClickListener</code><span>percebe o toque no botão</span></li>
          <li><code>ACTION_OPEN_DOCUMENT</code><span>abre o seletor de imagens</span></li>
          <li><code>onActivityResult</code><span>recebe a foto confirmada</span></li>
          <li><code>setImageURI + publicar()</code><span>mostra a prévia e executa o novo toque</span></li>
          <li><code>add(0, post)</code><span>coloca a publicação no topo</span></li>
        </ol>
      </div>
    </div>`;
  }

  if (type === "profile") {
    return `<div class="presentation-visual presentation-minigram-lesson presentation-minigram-profile">
      <figure class="minigram-phone-shot minigram-annotated minigram-annotated--profile">
        <img src="assets/minigram/06-perfil.png" alt="Tela real de edição do perfil no MiniGram">
        <span class="minigram-hotspot" style="--x:36%;--y:14%;--w:28%;--h:17%;--delay:.2s"><b>ImageView</b><small>foto do perfil</small></span>
        <span class="minigram-hotspot" style="--x:4.5%;--y:37%;--w:91%;--h:17%;--delay:1.1s"><b>EditText</b><small>apelido e biografia</small></span>
        <span class="minigram-hotspot" style="--x:4.5%;--y:57%;--w:91%;--h:5%;--delay:2s"><b>Button</b><small>salvar perfil</small></span>
      </figure>
      <div class="minigram-explainer">
        <span class="presentation-visual__eyebrow">XML + Java · trabalhando juntos</span>
        <h2>O XML monta o formulário. O Java <em>salva os dados.</em></h2>
        <div class="minigram-role-pair">
          <article><b>XML</b><p>Cria a imagem, os campos e o botão com seus tamanhos e posições.</p></article>
          <article><b>Java</b><p>Lê os campos, atualiza o cabeçalho e mantém o perfil no aparelho.</p></article>
        </div>
        <p class="minigram-local-note">No MiniGram, perfil e publicações continuam disponíveis sem internet porque são armazenados localmente.</p>
      </div>
    </div>`;
  }

  if (type === "compare") {
    return `<div class="presentation-visual presentation-compare-lesson">
      <span class="presentation-visual__eyebrow">Comparação</span>
      <h2>Web x Android nativo</h2>
      <div class="presentation-compare">
        <article>
          <h3>Portal <span>• Web</span></h3>
          <dl>
            <div><dt>Onde abre</dt><dd>Navegador</dd></div>
            <div><dt>Interface</dt><dd>HTML + CSS</dd></div>
            <div><dt>Comportamento</dt><dd>JavaScript</dd></div>
            <div><dt>Uso</dt><dd>Acesso por endereço</dd></div>
          </dl>
        </article>
        <article>
          <h3>MiniGram <span>• Nativo</span></h3>
          <dl>
            <div><dt>Onde abre</dt><dd>Aplicativo no Android</dd></div>
            <div><dt>Interface</dt><dd>XML</dd></div>
            <div><dt>Comportamento</dt><dd>Java</dd></div>
            <div><dt>Uso</dt><dd>Instalado no dispositivo</dd></div>
          </dl>
        </article>
      </div>
      <p class="presentation-compare-conclusion">Em ambos, interface + comportamento trabalham juntos.</p>
    </div>`;
  }

  return "";
}

function setupMinigramSequence() {
  const stage = document.querySelector(".minigram-sequence-stage");
  if (!stage) {
    minigramSequenceController = null;
    return;
  }

  const frames = [...stage.querySelectorAll(".minigram-sequence-frame")];
  const codeSteps = [...presentationSlide.querySelectorAll(".minigram-java-steps li")];
  const caption = stage.querySelector("#minigramSequenceCaption");
  const progress = stage.querySelector("#minigramSequenceProgress");
  const previous = stage.querySelector("#minigramSequencePrevious");
  const next = stage.querySelector("#minigramSequenceNext");
  let current = 0;

  const update = index => {
    current = Math.max(0, Math.min(index, frames.length - 1));
    frames.forEach((frame, frameIndex) => frame.classList.toggle("is-active", frameIndex === current));
    codeSteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === current));
    caption.textContent = frames[current].dataset.caption;
    progress.textContent = `${current + 1} de ${frames.length}`;
    previous.disabled = current === 0;
    next.disabled = current === frames.length - 1;
    announcePresentation(`Demonstração do MiniGram, imagem ${current + 1} de ${frames.length}. ${caption.textContent}`);
  };

  previous.addEventListener("click", () => update(current - 1));
  next.addEventListener("click", () => update(current + 1));
  minigramSequenceController = {
    next: () => update(current + 1),
    previous: () => update(current - 1),
    atStart: () => current === 0,
    atEnd: () => current === frames.length - 1
  };
  update(0);
}

function clearPresentationModes() {
  presentationModes.forEach(className => document.body.classList.remove(className));
}

function scrollToPresentationAnchor(selector) {
  const target = $(selector);
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
}

function announcePresentation(message) {
  $("#presentationLive").textContent = message;
}

function clearPresentationDemoEffects() {
  presentationDemoTimers.forEach(timer => window.clearTimeout(timer));
  presentationDemoTimers = [];
  window.clearTimeout(presentationFocusTimer);
  window.clearInterval(presentationHtmlInterval);
  window.clearTimeout(presentationHtmlStartTimer);
  window.clearInterval(presentationCssInterval);
  window.clearTimeout(presentationCssStartTimer);
  window.clearInterval(presentationJsInterval);
  window.clearTimeout(presentationJsStartTimer);
  presentationHtmlInterval = undefined;
  presentationHtmlStartTimer = undefined;
  presentationCssInterval = undefined;
  presentationCssStartTimer = undefined;
  presentationJsInterval = undefined;
  presentationJsStartTimer = undefined;
  presentationJsExecuting = false;
  presentationJsFocusedTarget = null;
  clearPresentationCssOptionClasses();
  $$(".presentation-js-marker").forEach(marker => marker.classList.remove("is-active"));
  hidePresentationJsSpotlight();
  $$(".presentation-demo-focus").forEach(element => {
    element.classList.remove("presentation-demo-focus");
    delete element.dataset.demoAction;
  });
  $$(".presentation-demo-flash").forEach(element => element.classList.remove("presentation-demo-flash"));
  if (modal.open) modal.close();
  setDrawer(false);
  if (presentationOriginalState) {
    presentationJsExecuting = true;
    try {
      restorePresentationState();
    } finally {
      presentationJsExecuting = false;
    }
  }
}

function advancePresentationHtmlTour() {
  if (presentationHtmlAnchorIndex < 0) {
    presentationHtmlAnchorIndex = 0;
  } else {
    let nextIndex = presentationHtmlAnchorIndex + presentationHtmlDirection;
    if (nextIndex >= htmlTourStops.length) {
      presentationHtmlDirection = -1;
      nextIndex = htmlTourStops.length - 2;
    } else if (nextIndex < 0) {
      presentationHtmlDirection = 1;
      nextIndex = 1;
    }
    presentationHtmlAnchorIndex = nextIndex;
  }

  const stop = htmlTourStops[presentationHtmlAnchorIndex];
  scrollToPresentationAnchor(stop.selector);
  announcePresentation(`HTML em toda a página: ${stop.label}.`);
}

function startPresentationHtmlTour() {
  presentationHtmlAnchorIndex = -1;
  presentationHtmlDirection = 1;
  presentationHtmlStartTimer = window.setTimeout(() => {
    advancePresentationHtmlTour();
    presentationHtmlInterval = window.setInterval(advancePresentationHtmlTour, 4000);
  }, 600);
  presentationDemoTimers.push(presentationHtmlStartTimer);
}

function clearPresentationCssOptionClasses() {
  presentationCssClassNames.forEach(className => document.body.classList.remove(className));
}

function applyPresentationCssSelections(activeFeature, shouldAnnounce = true) {
  clearPresentationCssOptionClasses();

  cssFeatureOrder.forEach(feature => {
    const featureData = cssFeatureOptions[feature];
    const option = featureData.options[presentationCssSelections[feature]];
    if (!presentationCssUnstyled && option.className) document.body.classList.add(option.className);

    const row = $(`[data-css-feature="${feature}"]`, presentationPalette);
    if (!row) return;
    row.classList.toggle("is-active", feature === activeFeature);
    row.dataset.cssOption = option.name;
    const description = $("small", row);
    if (description) description.textContent = `${option.name} · clique para trocar`;
  });

  const unstyledRow = $('[data-css-feature="unstyled"]', presentationPalette);
  if (unstyledRow) {
    unstyledRow.classList.toggle("is-active", activeFeature === "unstyled" || presentationCssUnstyled);
    const description = $("small", unstyledRow);
    if (description) description.textContent = presentationCssUnstyled
      ? "ATIVO · clique para restaurar o CSS"
      : "Clique para mostrar somente a estrutura";
  }

  if (presentationCssUnstyled) document.body.classList.add("presentation-css-unstyled");

  if (activeFeature === "unstyled") {
    $("#presentationCssState").textContent = presentationCssUnstyled ? "CSS · DESLIGADO" : "CSS · RESTAURADO";
    $("#presentationCssIcon").textContent = presentationCssUnstyled ? "</>" : "✦";
    $("#presentationCssSummary").textContent = presentationCssUnstyled
      ? "A aparência foi retirada para revelar títulos, textos, links, listas e seções definidos pelo HTML."
      : "O CSS voltou com todas as escolhas visuais que estavam selecionadas antes."
    $(".presentation-palette footer").innerHTML = presentationCssUnstyled
      ? "Comparação sem aparência · <strong>clique novamente para restaurar</strong>"
      : "CSS restaurado · <strong>o ciclo automático continua</strong>";
    if (shouldAnnounce) announcePresentation(presentationCssUnstyled
      ? "CSS temporariamente desligado. A estrutura HTML continua presente."
      : "CSS restaurado com todas as escolhas anteriores.");
    return;
  }

  if (!activeFeature) return;
  const featureData = cssFeatureOptions[activeFeature];
  const option = featureData.options[presentationCssSelections[activeFeature]];
  $("#presentationCssState").textContent = `${featureData.label} · ${option.name}`;
  $("#presentationCssIcon").textContent = featureData.icon;
  $("#presentationCssSummary").textContent = featureData.summary;
  $(".presentation-palette footer").innerHTML = "Alterações acumuladas · <strong>o ciclo continua automaticamente</strong>";
  if (shouldAnnounce) announcePresentation(`CSS em ação: ${featureData.label.toLowerCase()}, opção ${option.name.toLowerCase()}. As outras escolhas foram mantidas.`);
}

function advancePresentationCssFeature(feature) {
  const featureData = cssFeatureOptions[feature];
  if (!featureData) return;
  presentationCssSelections[feature] = (presentationCssSelections[feature] + 1) % featureData.options.length;
  applyPresentationCssSelections(feature);
}

function advancePresentationCssAutoplay() {
  presentationCssAutoFeatureIndex = (presentationCssAutoFeatureIndex + 1) % cssFeatureOrder.length;
  advancePresentationCssFeature(cssFeatureOrder[presentationCssAutoFeatureIndex]);
}

function startPresentationCssAutoplay() {
  cssFeatureOrder.forEach(feature => { presentationCssSelections[feature] = 0; });
  presentationCssAutoFeatureIndex = -1;
  presentationCssUnstyled = false;
  applyPresentationCssSelections(null, false);
  $("#presentationCssState").textContent = "CSS AO VIVO";
  $("#presentationCssIcon").textContent = "✦";
  $("#presentationCssSummary").textContent = "Cada propriedade muda sem apagar as escolhas anteriores. Você também pode clicar em qualquer item.";
  $(".presentation-palette footer").innerHTML = "Demonstração automática · <strong>uma propriedade a cada 4 segundos</strong>";

  presentationCssStartTimer = window.setTimeout(() => {
    advancePresentationCssAutoplay();
    presentationCssInterval = window.setInterval(advancePresentationCssAutoplay, 4000);
  }, 650);
  presentationDemoTimers.push(presentationCssStartTimer);
}

function selectPresentationCssFeature(feature) {
  if (!document.body.classList.contains("presentation-css")) return;
  window.clearInterval(presentationCssInterval);
  window.clearTimeout(presentationCssStartTimer);

  if (feature === "unstyled") {
    presentationCssUnstyled = !presentationCssUnstyled;
    applyPresentationCssSelections("unstyled");
    if (!presentationCssUnstyled) presentationCssInterval = window.setInterval(advancePresentationCssAutoplay, 4000);
    return;
  }

  if (!cssFeatureOptions[feature]) return;
  presentationCssUnstyled = false;
  presentationCssAutoFeatureIndex = cssFeatureOrder.indexOf(feature);
  advancePresentationCssFeature(feature);
  presentationCssInterval = window.setInterval(advancePresentationCssAutoplay, 4000);
}

function renderPresentationJsMarkers() {
  presentationJsMarkers.innerHTML = javascriptRegions.map((region, index) => `
    <button class="presentation-js-marker" type="button" data-js-region="${index}" aria-label="Demonstrar ${region.title}">
      <b>${String(index + 1).padStart(2, "0")}</b>
      <span><strong>${region.title}</strong><small>${region.action} → ${region.result}</small></span>
    </button>
  `).join("");

  $$("[data-js-region]", presentationJsMarkers).forEach(marker => marker.addEventListener("click", () => {
    const index = Number(marker.dataset.jsRegion);
    window.clearInterval(presentationJsInterval);
    window.clearTimeout(presentationJsStartTimer);
    presentationDemoTimers.forEach(timer => window.clearTimeout(timer));
    presentationDemoTimers = [];
    presentPresentationJsRegion(index);
    restartPresentationJsAutoplay();
  }));

  window.requestAnimationFrame(positionPresentationJsMarkers);
}

function positionPresentationJsMarkers() {
  if (!presentationActive || !document.body.classList.contains("presentation-js")) return;
  const minTop = window.innerWidth <= 680 ? 112 : 136;
  const bottomSpace = 20;

  $$("[data-js-region]", presentationJsMarkers).forEach(marker => {
    const region = javascriptRegions[Number(marker.dataset.jsRegion)];
    const target = $(region.selector);
    if (!target) {
      marker.hidden = true;
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const visible = targetRect.bottom > 76 && targetRect.top < window.innerHeight - bottomSpace && targetRect.right > 0 && targetRect.left < window.innerWidth;
    marker.hidden = !visible;
    if (!visible) return;

    const markerRect = marker.getBoundingClientRect();
    let left = targetRect.left + (targetRect.width - markerRect.width) / 2;
    let top = targetRect.top - markerRect.height - 12;

    if (region.placement === "below") top = targetRect.bottom + 12;
    if (region.placement === "below-left") {
      left = targetRect.right - markerRect.width;
      top = targetRect.bottom + 12;
    }
    if (region.placement === "below-right") {
      left = targetRect.left;
      top = targetRect.bottom + 12;
    }
    if (region.placement === "left") {
      left = targetRect.left - markerRect.width - 14;
      top = targetRect.top + (targetRect.height - markerRect.height) / 2;
    }
    if (region.placement === "right") {
      left = targetRect.right + 14;
      top = targetRect.top + (targetRect.height - markerRect.height) / 2;
    }

    left = Math.max(10, Math.min(left, window.innerWidth - markerRect.width - 10));
    top = Math.max(minTop, Math.min(top, window.innerHeight - bottomSpace - markerRect.height - 8));
    marker.style.left = `${Math.round(left)}px`;
    marker.style.top = `${Math.round(top)}px`;
  });
}

function setPresentationJsActiveRegion(index) {
  $$("[data-js-region]", presentationJsMarkers).forEach(marker => {
    marker.classList.toggle("is-active", Number(marker.dataset.jsRegion) === index);
  });
}

function setPresentationSpotlightPane(name, left, top, width, height) {
  const pane = $(`[data-spotlight-pane="${name}"]`, presentationJsSpotlight);
  if (!pane) return;
  pane.style.left = `${Math.max(0, Math.round(left))}px`;
  pane.style.top = `${Math.max(0, Math.round(top))}px`;
  pane.style.width = `${Math.max(0, Math.round(width))}px`;
  pane.style.height = `${Math.max(0, Math.round(height))}px`;
}

function showPresentationJsSpotlight(index, targetOverride = null) {
  const region = javascriptRegions[index];
  const target = targetOverride || (region ? $(region.selector) : null);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const padding = rect.width > 360 ? 9 : 14;
  const holeLeft = Math.max(0, rect.left - padding);
  const holeTop = Math.max(0, rect.top - padding);
  const holeRight = Math.min(window.innerWidth, rect.right + padding);
  const holeBottom = Math.min(window.innerHeight, rect.bottom + padding);
  const holeWidth = holeRight - holeLeft;
  const holeHeight = holeBottom - holeTop;

  setPresentationSpotlightPane("top", 0, 0, window.innerWidth, holeTop);
  setPresentationSpotlightPane("left", 0, holeTop, holeLeft, holeHeight);
  setPresentationSpotlightPane("right", holeRight, holeTop, window.innerWidth - holeRight, holeHeight);
  setPresentationSpotlightPane("bottom", 0, holeBottom, window.innerWidth, window.innerHeight - holeBottom);
  presentationJsSpotlight.hidden = false;
  presentationJsSpotlight.setAttribute("aria-hidden", "false");
  presentationJsMap.classList.add("is-spotlighting");
}

function hidePresentationJsSpotlight() {
  presentationJsMap.classList.remove("is-spotlighting");
  presentationJsSpotlight.hidden = true;
  presentationJsSpotlight.setAttribute("aria-hidden", "true");
}

function presentPresentationJsRegion(index, targetOverride = null) {
  const region = javascriptRegions[index];
  if (!region || !document.body.classList.contains("presentation-js")) return;
  presentationJsRegionIndex = index;
  presentationJsFocusedTarget = targetOverride;
  setPresentationJsActiveRegion(index);
  hidePresentationJsSpotlight();
  focusPresentationAction(null, "");
  $("#presentationJsStatus").textContent = `Foco: ${region.title} · ${region.action} → ${region.result}`;
  if (modal.open) modal.close();
  setDrawer(false);
  scrollToPresentationAnchor(region.anchor);
  announcePresentation(`Foco da próxima ação JavaScript: ${region.title}. ${region.action}; ${region.result}.`);

  const focusTimer = window.setTimeout(() => {
    const target = targetOverride || $(region.selector);
    positionPresentationJsMarkers();
    showPresentationJsSpotlight(index, target);
    focusPresentationAction(target, `${region.action.toLowerCase()} → ${region.result}`);
    const revealTimer = window.setTimeout(() => {
      hidePresentationJsSpotlight();
      demonstratePresentationJsRegion(index, true, targetOverride);
    }, 1450);
    presentationDemoTimers.push(revealTimer);
  }, 500);
  presentationDemoTimers.push(focusTimer);
}

function runPresentationJsNativeAction(action) {
  presentationJsExecuting = true;
  try {
    action();
  } finally {
    presentationJsExecuting = false;
  }
}

function demonstratePresentationJsRegion(index, alreadyPositioned = false, targetOverride = null) {
  const region = javascriptRegions[index];
  if (!region || !document.body.classList.contains("presentation-js")) return;
  presentationJsRegionIndex = index;
  setPresentationJsActiveRegion(index);
  $("#presentationJsStatus").textContent = `${region.title}: ${region.action} → ${region.result}`;
  if (modal.open) modal.close();
  setDrawer(false);
  if (!alreadyPositioned) scrollToPresentationAnchor(region.anchor);

  const actionTimer = window.setTimeout(() => {
    const target = targetOverride || $(region.selector);
    positionPresentationJsMarkers();
    focusPresentationAction(target, `${region.action.toLowerCase()} → ${region.result}`);
    flashPresentationElement(target);

    if (region.id === "carousel") {
      if (target) runPresentationJsNativeAction(() => target.click());
      else showSlide(currentSlide + 1);
    } else if (region.id === "theme") {
      runPresentationJsNativeAction(() => (target || themeButton).click());
    } else if (region.id === "trail") {
      if (target) runPresentationJsNativeAction(() => target.click());
      else setDrawer(true);
      presentationDemoTimers.push(window.setTimeout(() => setDrawer(false), 2500));
    } else if (region.id === "search") {
      const allFilter = $('.filter[data-filter="all"]');
      if (allFilter) runPresentationJsNativeAction(() => allFilter.click());
      searchInput.value = "web";
      filterCards();
    } else if (region.id === "filters") {
      searchInput.value = "";
      const selectedFilter = target?.closest?.(".filter") || $('.filter[data-filter="2"]');
      if (selectedFilter) runPresentationJsNativeAction(() => selectedFilter.click());
    } else if (region.id === "course") {
      if (target) runPresentationJsNativeAction(() => target.click());
      else openCourse("web");
      presentationDemoTimers.push(window.setTimeout(() => { if (modal.open) modal.close(); }, 2500));
    } else if (region.id === "faq") {
      if (target?.getAttribute("aria-expanded") === "true") runPresentationJsNativeAction(() => target.click());
      presentationDemoTimers.push(window.setTimeout(() => {
        if (target) runPresentationJsNativeAction(() => target.click());
      }, 160));
    }

    positionPresentationJsMarkers();
    announcePresentation(`JavaScript em ação: ${region.title}. ${region.result}.`);
  }, alreadyPositioned ? 300 : 520);
  presentationDemoTimers.push(actionTimer);
}

function advancePresentationJsRegion() {
  presentationDemoTimers.forEach(timer => window.clearTimeout(timer));
  presentationDemoTimers = [];
  presentPresentationJsRegion((presentationJsRegionIndex + 1) % javascriptRegions.length);
}

function startPresentationJsAutoplay() {
  presentationJsRegionIndex = -1;
  renderPresentationJsMarkers();
  $("#presentationJsStatus").textContent = "Os marcadores mostram onde o usuário age e como a página responde";
  presentationJsStartTimer = window.setTimeout(() => {
    advancePresentationJsRegion();
    presentationJsInterval = window.setInterval(advancePresentationJsRegion, 7600);
  }, 900);
  presentationDemoTimers.push(presentationJsStartTimer);
}

function restartPresentationJsAutoplay() {
  window.clearInterval(presentationJsInterval);
  window.clearTimeout(presentationJsStartTimer);
  presentationJsInterval = window.setInterval(advancePresentationJsRegion, 7600);
}

function focusPresentationAction(element, label) {
  window.clearTimeout(presentationFocusTimer);
  $$(".presentation-demo-focus").forEach(item => {
    item.classList.remove("presentation-demo-focus");
    delete item.dataset.demoAction;
  });
  if (!element) return;
  element.dataset.demoAction = `1 · ${label}`;
  element.classList.add("presentation-demo-focus");
  presentationFocusTimer = window.setTimeout(() => {
    element.classList.remove("presentation-demo-focus");
    delete element.dataset.demoAction;
  }, 3000);
}

function showPresentationStep(index) {
  presentationCurrentStep = Math.max(0, Math.min(index, presentationSteps.length - 1));
  const step = presentationSteps[presentationCurrentStep];
  const isSlide = Boolean(step.visual);
  minigramSequenceController = null;

  clearPresentationDemoEffects();
  clearPresentationModes();
  if (step.mode !== "slide") document.body.classList.add(`presentation-${step.mode}`);
  if (isSlide) document.body.classList.add("presentation-slide-active");

  presentationPalette.hidden = step.mode !== "css";
  presentationJsMap.hidden = step.mode !== "js";
  if (step.mode === "html") startPresentationHtmlTour();
  if (step.mode === "css") startPresentationCssAutoplay();
  if (step.mode === "js") startPresentationJsAutoplay();

  presentationSlide.classList.toggle("is-visible", isSlide);
  presentationSlide.setAttribute("aria-hidden", String(!isSlide));
  presentationSlide.innerHTML = isSlide ? presentationVisual(step.visual) : "";
  if (step.visual === "java") setupMinigramSequence();

  $("#presentationGuideSection").textContent = `${step.section} · ${step.kicker}`;
  $("#presentationGuideTitle").textContent = step.title;
  $("#presentationGuideDescription").textContent = step.description;
  $("#presentationGuideCue").textContent = step.cue;
  $("#presentationGuideProgress").textContent = `${presentationCurrentStep + 1} de ${presentationSteps.length}`;
  presentationPrevious.disabled = presentationCurrentStep === 0;
  presentationNext.textContent = presentationCurrentStep === presentationSteps.length - 1 ? "Encerrar" : "Avançar";
  presentationGuide.classList.toggle("is-compact", isSlide);

  if (step.anchor) window.setTimeout(() => scrollToPresentationAnchor(step.anchor), 60);
  announcePresentation(`Etapa ${presentationCurrentStep + 1} de ${presentationSteps.length}: ${step.section}. ${step.title}`);
}

function flashPresentationElement(element) {
  if (!element) return;
  element.classList.remove("presentation-demo-flash");
  void element.offsetWidth;
  element.classList.add("presentation-demo-flash");
  window.setTimeout(() => element.classList.remove("presentation-demo-flash"), 800);
}

function enterPresentation() {
  if (presentationActive) return;
  presentationActive = true;
  presentationOriginalState = {
    theme: document.documentElement.dataset.theme,
    storedTheme: localStorage.getItem("tecnotrilha-theme"),
    scrollY: window.scrollY,
    search: searchInput.value,
    filter: activeFilter,
    slide: currentSlide,
    accordions: $$(".accordion__item button").map(button => button.getAttribute("aria-expanded"))
  };
  clearInterval(carouselTimer);
  presentationShell.hidden = false;
  presentationShell.setAttribute("aria-hidden", "false");
  document.body.classList.add("presentation-active");
  showPresentationStep(0);
  announcePresentation("Modo apresentação iniciado. Use as setas para navegar e Escape para sair.");
}

function restorePresentationState() {
  if (!presentationOriginalState) return;
  if (presentationOriginalState.theme) document.documentElement.dataset.theme = presentationOriginalState.theme;
  else delete document.documentElement.dataset.theme;
  if (presentationOriginalState.storedTheme) localStorage.setItem("tecnotrilha-theme", presentationOriginalState.storedTheme);
  else localStorage.removeItem("tecnotrilha-theme");
  searchInput.value = presentationOriginalState.search;
  activeFilter = presentationOriginalState.filter;
  $$(".filter").forEach(button => button.classList.toggle("is-active", button.dataset.filter === activeFilter));
  filterCards();
  showSlide(presentationOriginalState.slide);
  $$(".accordion__item button").forEach((button, index) => {
    if (button.getAttribute("aria-expanded") !== presentationOriginalState.accordions[index]) button.click();
  });
  updateThemeButton();
}

function exitPresentation() {
  if (!presentationActive) return;
  presentationActive = false;
  clearPresentationDemoEffects();
  clearPresentationModes();
  document.body.classList.remove("presentation-active");
  presentationShell.hidden = true;
  presentationShell.setAttribute("aria-hidden", "true");
  presentationSlide.innerHTML = "";
  presentationPalette.hidden = true;
  presentationJsMap.hidden = true;
  if (modal.open) modal.close();
  setDrawer(false);
  restorePresentationState();
  startCarousel();
  if (presentationOwnsFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  presentationOwnsFullscreen = false;
  const originalScroll = presentationOriginalState?.scrollY || 0;
  presentationOriginalState = null;
  window.scrollTo({ top: originalScroll, behavior: "auto" });
  presentationButton.focus();
}

function nextPresentationStep() {
  if (minigramSequenceController && !minigramSequenceController.atEnd()) {
    minigramSequenceController.next();
    return;
  }
  if (presentationCurrentStep < presentationSteps.length - 1) showPresentationStep(presentationCurrentStep + 1);
  else exitPresentation();
}

function previousPresentationStep() {
  if (minigramSequenceController && !minigramSequenceController.atStart()) {
    minigramSequenceController.previous();
    return;
  }
  if (presentationCurrentStep > 0) showPresentationStep(presentationCurrentStep - 1);
}

function togglePresentationFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      presentationOwnsFullscreen = true;
      announcePresentation("Tela cheia ativada.");
    }).catch(() => announcePresentation("O navegador não permitiu ativar a tela cheia."));
  } else {
    document.exitFullscreen().catch(() => {});
    presentationOwnsFullscreen = false;
  }
}

presentationButton.addEventListener("click", () => {
  enterPresentation();
  togglePresentationFullscreen();
});
presentationPrevious.addEventListener("click", previousPresentationStep);
presentationNext.addEventListener("click", nextPresentationStep);
presentationExit.addEventListener("click", exitPresentation);
$$('[data-css-select]').forEach(button => button.addEventListener("click", () => selectPresentationCssFeature(button.dataset.cssSelect)));

document.addEventListener("click", event => {
  if (!presentationActive || !document.body.classList.contains("presentation-js") || presentationJsExecuting) return;
  const regionIndex = javascriptRegions.findIndex(region => {
    const regionTarget = $(region.selector);
    return regionTarget && regionTarget.contains(event.target);
  });
  if (regionIndex < 0) return;

  const regionTarget = $(javascriptRegions[regionIndex].selector);
  const clickedControl = event.target.closest?.("button, a, input");
  const visualTarget = clickedControl && regionTarget.contains(clickedControl) && !clickedControl.matches("input")
    ? clickedControl
    : regionTarget;

  event.preventDefault();
  event.stopImmediatePropagation();
  window.clearInterval(presentationJsInterval);
  window.clearTimeout(presentationJsStartTimer);
  presentationDemoTimers.forEach(timer => window.clearTimeout(timer));
  presentationDemoTimers = [];
  presentPresentationJsRegion(regionIndex, visualTarget);
  restartPresentationJsAutoplay();
}, true);

window.addEventListener("scroll", () => {
  if (document.body.classList.contains("presentation-js")) window.requestAnimationFrame(() => {
    positionPresentationJsMarkers();
    if (!presentationJsSpotlight.hidden && presentationJsRegionIndex >= 0) showPresentationJsSpotlight(presentationJsRegionIndex, presentationJsFocusedTarget);
  });
}, { passive: true });
window.addEventListener("resize", () => {
  if (document.body.classList.contains("presentation-js")) window.requestAnimationFrame(() => {
    positionPresentationJsMarkers();
    if (!presentationJsSpotlight.hidden && presentationJsRegionIndex >= 0) showPresentationJsSpotlight(presentationJsRegionIndex, presentationJsFocusedTarget);
  });
});

document.addEventListener("keydown", event => {
  if (!presentationActive) return;
  if (event.key === "Escape") {
    event.preventDefault();
    exitPresentation();
    return;
  }
  if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.key === " " && event.target.closest("button, a")) return;
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    if (minigramSequenceController && !minigramSequenceController.atEnd()) minigramSequenceController.next();
    else nextPresentationStep();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (minigramSequenceController && !minigramSequenceController.atStart()) minigramSequenceController.previous();
    else previousPresentationStep();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && presentationOwnsFullscreen && presentationActive) {
    presentationOwnsFullscreen = false;
    exitPresentation();
  } else if (!document.fullscreenElement) {
    presentationOwnsFullscreen = false;
  }
});

// Estado inicial da página.
saveTrail();
updateThemeButton();
startCarousel();

// Link direto para ensaios: index.html?apresentacao=1&etapa=4
const presentationParams = new URLSearchParams(window.location.search);
if (presentationParams.get("apresentacao") === "1") {
  enterPresentation();
  const requestedStep = Number(presentationParams.get("etapa"));
  if (Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= presentationSteps.length) {
    showPresentationStep(requestedStep - 1);
  }
}
