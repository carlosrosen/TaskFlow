async function verificarSessao() {
  try {
    const cookie = await cookieStore.get("usuarioLogado");
    if (cookie) {
      window.location.href = "listarTarefas.html";
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

    const diaMilissegundos = 24 * 60 * 60 * 1000;
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("taskflowUsuarios")) || {};

    if (!usuarios[email] || usuarios[email].senha != senha) {
      alert("E-mail ou senha incorreta.");
      return;
    }

    try {
      await cookieStore.set({
        name: "usuarioLogado",
        value: email,
        expires: Date.now() + diaMilissegundos,
        path: "/",
      });
      alert("Login realizado com sucesso!");
      window.location.href = "listarTarefas.html";
    } catch (error) {
      console.error("Erro ao salvar o cookie:", error);
      alert("Ocorreu um erro no login.");
    }
  });
