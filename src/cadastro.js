async function verificarSessao() {
  try {
    const cookie = await cookieStore.get("usuarioLogado");
    if (cookie) {
      window.location.href = "tarefas.html";
    }
  } catch (error) {
    console.error("Erro ao tentar verificar o cookie:", error);
  }
}

verificarSessao();

document
  .getElementById("auth-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const repeteSenha = document.getElementById("repete_senha").value.trim();

    if (senha !== repeteSenha) {
      alert("As senhas não coincidem. Tente novamente.");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("taskflowUsuarios")) || {};

    if (usuarios[email]) {
      alert("Este e-mail já está em uso. Faça login ou use outro e-mail.");
      return;
    }

    usuarios[email] = {
      nome: nome,
      senha: senha,
    };

    localStorage.setItem("taskflowUsuarios", JSON.stringify(usuarios));

    const diaMilissegundos = 24 * 60 * 60 * 1000;

    try {
      await cookieStore.set({
        name: "usuarioLogado",
        value: email,
        expires: Date.now() + diaMilissegundos,
        path: "/",
      });
      alert("Cadastro realizado com sucesso!");
      window.location.href = "tarefas.html";
    } catch (error) {
      console.error("Erro ao salvar o cookie:", error);
      alert("Ocorreu um erro no cadastro.");
    }
  });
