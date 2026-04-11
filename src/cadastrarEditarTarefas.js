carregarNome();
async function getUser() {
  let user = null;
  try {
    user = await cookieStore.get("usuarioLogado");
  } catch (error) {
    console.error("Erro ao verificar os cookies:", error);
    alert("Ocorreu um erro ao tentar validar usuário.");
  }
  return user;
}

function getIdCounter() {
  let tarefas = localStorage.getItem("tarefas");
  let id = localStorage.getItem("id");
  if (id === "NaN" || id === null || tarefas === null) {
    id = 1;
  } else {
    id = Number.parseInt(id);
  }
  return id;
}

async function salvarTarefa(e, isNewTask) {
  e.preventDefault();
  let tarefas = JSON.parse(localStorage.getItem("tarefas"));
  let id;
  if (isNewTask) {
    id = getIdCounter();
  } else {
    id = getParamTaskId();
  }
  const user = await getUser(); //ao carregar o script ele ja valida se tem usuário.
  const email = user.value;
  const titulo = document.querySelector('input[name="titulo"]');
  const prazo = document.querySelector('input[name="prazo"]');
  const nivelPrioridade = document.querySelector(
    'select[name="nivel-prioridade"]',
  );
  const cor = document.getElementById("color-inp");
  const descricao = document.querySelector('textarea[name="descricao"]');
  if (titulo.value === "" || titulo.value === null) {
    alert("Defina um título para a tarefa.");
    return;
  }
  if (titulo.value.length > 50) {
    alert("O título pode ter no máximo 50 caracteres.");
    return;
  }
  if (prazo.value === "" || prazo.value === null) {
    alert("Defina um prazo para a realização da tarefa.");
    console.log("valor do prazo: ", prazo.value);
    return;
  }
  const newTask = {
    id: id,
    titulo: titulo.value,
    prazo: prazo.value,
    nivel_prioridade: nivelPrioridade.value,
    descricao: descricao.value,
    color: cor.value,
  };
  if (tarefas === null) {
    tarefas = JSON.parse(`{"${email}": []}`);
  }
  if (tarefas[email] === undefined) {
    tarefas[email] = [newTask];
  } else {
    if (isNewTask) {
      tarefas[email].push(newTask);
      id++;
    } else {
      for (let i = 0; i < tarefas[email].length; i++) {
        if (tarefas[email][i]["id"] === id) {
          tarefas[email][i] = newTask;
        }
      }
    }
  }
  alert(`Tarefa ${titulo.value} salvo com sucesso`);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  if(isNewTask){
    localStorage.setItem("id", `${id}`);
  }

  let urlAtual = window.location.href.split("/");
  urlDestino = new URL(
    urlAtual[0] + urlAtual[1] + urlAtual[2] + "/listarTarefas.html",
  );
  window.location.replace(urlDestino);
}

const cadastrarTarefa = document.getElementById("create-task");
const editarTarefa = document.getElementById("edit-task");
if (cadastrarTarefa !== null) {
  cadastrarTarefa.addEventListener("submit", async (e) => {
    salvarTarefa(e, true);
  });
} else if (editarTarefa !== null) {
  editarTarefa.addEventListener("submit", async (e) => {
    salvarTarefa(e, false);
  });
}

function getParams() {
  try {
    const retorno = {};
    params = window.location.href.split("?")[1].split("=");
    for (let i = 0; i < params.length; i += 2) {
      retorno[params[i]] = params[i + 1];
    }
    return retorno;
  } catch (error) {
    return null;
  }
}

function getParamTaskId() {
  const params = getParams();
  if (params === null) return null;

  let id = Number.parseInt(params["id"]);
  return id;
}

async function pegarTaskERegistarNosCampos() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas"));
  let urlAtual = window.location.href.split("/");
  const id = getParamTaskId();
  if (id === null) {
    window.location.replace(
      urlAtual[0] +
        "/" +
        urlAtual[1] +
        "/" +
        urlAtual[2] +
        "/listarTarefas.html",
    );
  }
  const user = await getUser(); //ao carregar o script ele ja valida se tem usuário.
  const email = user.value;
  const titulo = document.querySelector('input[name="titulo"]');
  const prazo = document.querySelector('input[name="prazo"]');
  const nivelPrioridade = document.querySelector(
    'select[name="nivel-prioridade"]',
  );
  const cor = document.getElementById("color-inp");
  const descricao = document.querySelector('textarea[name="descricao"]');
  let found = false;
  tarefas[email].forEach((element) => {
    if (element["id"] === id) {
      titulo.value = element["titulo"];
      prazo.value = element["prazo"];
      nivelPrioridade.values = element["nivel_prioridade"];
      cor.value = element["color"];
      descricao.value = element["descricao"];
      found = true;
    }
  });
  if (!found) {
    window.location.replace(
      urlAtual[0] +
        "/" +
        urlAtual[1] +
        "/" +
        urlAtual[2] +
        "/listarTarefas.html",
    );
  }
}
async function carregarNome() {
  const usernameInp = document.getElementById("username");
  const users = JSON.parse(localStorage.getItem("taskflowUsuarios"));
  const userlogged = await getUser();
  if (userlogged === null || userlogged.value === null) {
    let urlAtual = window.location.href.split("/");
    urlLogin = new URL(urlAtual[0] + urlAtual[1] + urlAtual[2] + "/login.html");
    alert("você não esta logado, redirecionando para a pagina de login");
    window.location.replace(urlLogin);
    return;
  }
  usernameInp.innerText = `User: ${users[userlogged.value]["nome"]}`;
}

if (window.location.href.split("/")[3].split("?")[0] === "editarTarefas.html") {
  pegarTaskERegistarNosCampos();
}
