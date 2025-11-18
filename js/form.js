function validarCadastro(){
    const login = document.getElementById("usuarioCadastro").value.trim(); 
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value.trim();

    if (!login || !email || !senha) {
        alert("Os campos Nome (Usuário), E-mail e Senha são obrigatórios.");
        return false;
    }
    return true;
}


async function cadastrar() {
    if (!validarCadastro()) return false;

    const usuario = {
        login: document.getElementById("usuarioCadastro").value,
        email: document.getElementById("emailCadastro").value,
        senha: document.getElementById("senhaCadastro").value,
        nome: "",
    };

    try {
        const response = await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        console.log("STATUS:", response.status);

        if (response.status >= 200 && response.status < 300) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html"; 
        } else {
            const erro = await response.text();
            alert("Erro ao cadastrar: " + erro);
        }

    } catch (error) {
        alert("Erro de conexão com o servidor.");
        console.error("Erro no fetch:", error);
    }
}
