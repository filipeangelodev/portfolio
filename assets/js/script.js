// Swiper
const swiper = new Swiper(".swiper-stacks", {
    slidesPerView: "auto",
    spaceBetween: 0,
    loop: true,
    speed: 5000,
    allowTouchMove: false,

    autoplay: {
    delay: 0,
    disableOnInteraction: false,
    },
});

// Carregar projetos
const listaProjetos = document.getElementById("lista-projetos");
const CarregandoProjetos = document.getElementById("carregando-projetos");
const botaoCarregarMais = document.getElementById("carregar-mais");
const projetosData = document.getElementById("projetos-data");

let projetos = [];
let paginaAtual = 1;
var countProjects = 1;
const itensPorPagina = 3;

async function carregarProjetos() {
    try {
        // Simula processamento assíncrono
        await Promise.resolve();

        projetos = JSON.parse(projetosData.textContent);

        renderizarProjetos();
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);

        listaProjetos.innerHTML = `
            <p>Não foi possível carregar os projetos.</p>
        `;
    }
}

function renderizarProjetos() {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const projetosPagina = projetos.slice(inicio, fim);

    projetosPagina.forEach((projeto, index) => {
        const elemento = document.createElement("div");

        elemento.classList.add("col-12");
        elemento.classList.add("col-md-6");
        elemento.classList.add("col-lg-4");

        var html = '';

        // Card
        html += '<div class="card card-project h-100">';

            if(projeto.image){
                html += '<div class="card-img-top">'+
                    '<img src="'+ projeto.image +'" alt="'+ projeto.name +'">'+
                '</div>';
            }

            html += '<div class="card-body pb-0">';

            if(projeto.tags.length > 0){
                html += '<p class="d-flex flex-wrap gap-1">'+
                    projeto.tags.map(tag => ' <span class="project-tag">'+tag+'</span> ').join('') +
                '</p>';
            }

            html += '<h3 class="card-title">'+ projeto.name +'</h3>';
            html += '<p class="card-text mb-3">'+ projeto.title +'</p>';
        html += '</div>';

        html += '<div class="card-footer mt-auto pt-0">' +
            '<a href="#" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#project-'+countProjects+'">Saiba mais</a>'+
            // '<p class="text-legal mt-3 mb-0"><small>*Os projetos apresentados pertencem aos respectivos clientes e empresas. As imagens são utilizadas apenas para demonstração de experiência profissional.</small></p>'+
        '</div>';

        html += '</div>';

        // Modal
        html += '<div class="modal fade" id="project-'+countProjects+'" tabindex="-1" aria-labelledby="project-'+countProjects+'-label" aria-hidden="true">';
            html += '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">';
                html += '<div class="modal-content">';
                    html += '<div class="modal-header">'+
                    '<p class="modal-title"><strong>Projetos</strong></p>'+
                    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
                    '</div>';

                html += '<div class="modal-body">';
                    html += '<p class="d-flex flex-wrap gap-1">'+
                        projeto.tags.map(tag => ' <span class="project-tag">'+tag+'</span> ').join('') +
                    '</p>';
                    html += '<p class="modal-title text-primary mb-0"><strong>'+ projeto.name +'</strong></p>';
                    html += '<p><strong>'+ projeto.title +'</strong></p>';
                    html += '<p>'+ projeto.description +'</p>';
                    html += '<p class="text-quote"><strong>Atuação:</strong> '+ projeto.quote +'</p>';
                    if( projeto.permalink ){
                        html += '<p><a href="'+ projeto.permalink +'" class="btn btn-outline-primary" target="_blank" rel="noopener nofollow">Visitar o site</a></p>';
                    }
                    // html += '<p class="text-legal"><small>*Os projetos apresentados pertencem aos respectivos clientes e empresas. As imagens são utilizadas apenas para demonstração de experiência profissional.</small></p>';
                html += '</div>';
            html += '</div>';
            html += '</div>';
        html += '</div>';        

        countProjects++;
        elemento.innerHTML = html;

        listaProjetos.appendChild(elemento);
    });

    atualizarBotao();
}

function atualizarBotao() {
    const quantidadeExibida = paginaAtual * itensPorPagina;

    CarregandoProjetos.style.display = 'none';

    if (quantidadeExibida >= projetos.length) {
        botaoCarregarMais.style.display = "none";
    } else {
        botaoCarregarMais.style.display = "block";
    }
}

botaoCarregarMais.addEventListener("click", () => {
    paginaAtual++;
    renderizarProjetos();
});

carregarProjetos();

// Intersection Observer for Smooth Scroll Reveals
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Reveal only once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Dynamic Nav Link Highlighting based on Section Visibility
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.scroll-to'); // .nav-item
const offcanvasElement = document.getElementById('offcanvasNavbar');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');

            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);

            if (offcanvas && window.innerWidth < 992) {
                offcanvas.hide();
            }

        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });

});