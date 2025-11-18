document.getElementById("formLogin").addEventListener("submit", async function (event) {
    event.preventDefault(); 
    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    const resp = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
            login: login,
            senha: senha
        })
    });

    if (resp.ok) {
        const data = await resp.json();
        console.log("Login OK:", data);

        window.location.href = "../index.html";
    } else {
        alert("Login ou senha incorretos");
    }
});