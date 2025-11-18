// backend-fake.js

// -----------------------------
// SISTEMA FAKE DE BACKEND
// -----------------------------

// === CADASTRO ===
function cadastrarFake(login, email, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const novo = {
        id: Date.now(),
        login,
        email,
        senha
    };

    usuarios.push(novo);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    console.log("Usuário cadastrado (fake):", novo);
    return true;
}


// === LOGIN ===
function loginFake(login, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(
        u => (u.login === login || u.email === login) && u.senha === senha
    );

    if (!user) {
        console.warn("Login fake inválido.");
        return false;
    }

    const sessao = {
        usuarioId: user.id,
        nome: user.login,
        email: user.email
    };

    localStorage.setItem("sessao", JSON.stringify(sessao));
    console.log("Login fake efetuado:", sessao);

    return true;
}


// === VERIFICA SESSÃO ===
function usuarioLogado() {
    return JSON.parse(localStorage.getItem("sessao"));
}


// === LOGOUT ===
function logoutFake() {
    localStorage.removeItem("sessao");
    console.log("Sessão fake finalizada.");
}


// -----------------------------
// DATASETS FAKE
// -----------------------------

// === CRIAR DATASET ===
function criarDatasetFake(nome, descricao) {
    const sessao = usuarioLogado();

    if (!sessao) {
        console.warn("Tentativa de criar dataset sem estar logado.");
        return false;
    }

    let datasets = JSON.parse(localStorage.getItem("datasets")) || [];

    const novo = {
        id: Date.now(),
        ownerId: sessao.usuarioId,
        nome,
        descricao,
        criadoEm: new Date().toISOString()
    };

    datasets.push(novo);
    localStorage.setItem("datasets", JSON.stringify(datasets));

    console.log("Dataset criado (fake):", novo);
    return true;
}


// === LISTAR DATASETS DO USUÁRIO ===
function listarDatasetsFake() {
    const sessao = usuarioLogado();
    let datasets = JSON.parse(localStorage.getItem("datasets")) || [];

    if (!sessao) return [];

    return datasets.filter(d => d.ownerId === sessao.usuarioId);
}


// === DELETAR DATASET ===
function deletarDatasetFake(id) {
    let datasets = JSON.parse(localStorage.getItem("datasets")) || [];

    // Converte o id para number antes de comparar, pois Date.now() retorna um número
    datasets = datasets.filter(d => d.id !== Number(id));

    localStorage.setItem("datasets", JSON.stringify(datasets));
    console.log("Dataset deletado (fake):", id);
    alert("Dataset deletado com sucesso!");
}


// -----------------------------
// FUNÇÕES DE INTEGRAÇÃO COM SEU HTML
// -----------------------------

// Cadastro (Chamada no 'cadastro.html')
async function cadastrar(event) {
    if (event) event.preventDefault(); // Previne o envio padrão do formulário

    const login = document.getElementById("usuarioCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value.trim();

    if (!login || !email || !senha) {
        alert("Preencha todos os campos.");
        return false;
    }

    cadastrarFake(login, email, senha);
    alert("Usuário cadastrado com sucesso!");

    window.location.href = "login.html";
    return false; // Retorna false para evitar o envio do formulário
}


// Login (Chamada no 'login.html')
async function fazerLogin(event) {
    if (event) event.preventDefault();
    const login = document.getElementById("loginUsuario").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();

    if (loginFake(login, senha)) {
        alert("Login realizado!");
        // Redireciona para a página inicial
        window.location.href = "../index.html"; 
    } else {
        alert("Login inválido. Verifique suas credenciais.");
    }
}


// Criar dataset (Chamada no 'user/criardataset.html' - será ajustado)
function enviarDataset(event) {
    if (event) event.preventDefault(); 
    
    // Verificando se os IDs dos inputs no HTML de criação estão corretos
    const nomeInput = document.getElementById("nomeDataset");
    const descricaoInput = document.getElementById("descricaoDataset");

    if (!nomeInput || !descricaoInput) {
        alert("Erro: Elementos do formulário não encontrados. Verifique os IDs (nomeDataset, descricaoDataset).");
        return false;
    }

    const nome = nomeInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!nome || !descricao) {
        alert("Preencha o nome e descrição do Dataset.");
        return false;
    }

    if (criarDatasetFake(nome, descricao)) {
        alert("Dataset criado com sucesso!");
        // Redireciona para a página de Meus Datasets
        window.location.href = "../../pages/user/dataset.html";
    } else {
        alert("Falha ao criar Dataset.");
    }
}



// Listar na tela
function mostrarDatasets() {
    const lista = listarDatasetsFake();
    const div = document.getElementById("userDatasetsSection");

    if (!div) return;

    div.innerHTML = ""; 

    if (lista.length === 0) {
        div.innerHTML = "<p style='padding: 20px; color: #555;'>Você ainda não criou nenhum dataset.</p>";
        return;
    }

    lista.forEach(ds => {
        // Estrutura de card usando as classes do index, mas com data e botão
        div.innerHTML += `
            <div class="dataset">
                <a href="../../pages/dataset.html?id=${ds.id}">
                    <img src="../../img/datasets/dataset_1.png" alt="Dataset ${ds.nome}" class="dataset-image">
                    <div class="dataset-info">
                        <h1 class="dataset-title">${ds.nome}</h1>
                        <p class="dataset-desc">${ds.descricao}</p>
                        
                        <div class="dataset-controls">
                            <small class="dataset-date">Criado em: ${new Date(ds.criadoEm).toLocaleDateString()}</small>
                            <button class="btn-excluir" onclick="event.preventDefault(); deletarDatasetFake(${ds.id}); mostrarDatasets()">Excluir</button>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
}


// Checa a sessão ao carregar a página
function checarSessao() {
    if (window.location.pathname.includes("pages/user/dataset.html") && !usuarioLogado()) {
        alert("Você precisa estar logado para acessar seus Datasets.");
        // Redireciona para o login se a página for restrita e não houver sessão
        window.location.href = "../pages/login.html"; 
    }
}

// Botão de Logout no Header
function sair() {
    logoutFake();
    window.location.href = "../pages/login.html"; 
}

function atualizarHeader() {
    const user = usuarioLogado();

    const headerDeslogado = document.getElementById("headerDeslogado");
    const headerLogado = document.getElementById("headerLogado");

    if (!headerDeslogado || !headerLogado) return; // Garante que os elementos existem

    if (user) {
        // Se tiver logado
        headerDeslogado.style.display = "none";
        
        // Conteúdo do cabeçalho logado (Meus Datasets, Nome, Email e Sair)
        headerLogado.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <a href="../../pages/user/dataset.html" class="btn-header" style="background-color: white; color: black;">Meus Datasets</a>
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <h2 style="margin: 0; font-size: 18px;">Olá, ${user.nome}</h2>
                    <p style="margin: 0;"><strong>Email:</strong> <span id="perfilEmail">${user.email}</span></p>
                </div>
                <button class="btn-header" onclick="sair()" style="margin-top: 5px; background-color: white; color: black; cursor: pointer;">Sair</button>
            </div>
        `;
        headerLogado.style.display = "flex"; // Usa flex para alinhar os elementos

    } else {
        // Se não estiver logado
        headerDeslogado.style.display = "flex";
        headerLogado.style.display = "none";
    }
}