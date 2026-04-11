carregarNome();
async function getUser() {
    let user = null;
    try{
        user = await cookieStore.get('usuarioLogado');
    } catch (error) {
        console.error("Erro ao verificar os cookies:", error);
        alert("Ocorreu um erro ao tentar validar usuário.");
    }
    return user;
}
async function carregarTarefas(){
    const urlAtual = window.location.href.split('/');
    const user = await getUser(); //usuario é validado no inicio do script.
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const userTasks = tarefas[user.value];
    if(userTasks === undefined)return;
    const sectionTasks = document.getElementById('section-cards-tarefas');
    userTasks.forEach(element => {
        const tituloBox = document.createElement('header');
        tituloBox.classList.add('flex-row', 'card-title');
        tituloBox.style.flex = '1';

        const titleCircle = document.createElement('p');
        titleCircle.classList.add('circle')
        titleCircle.style.backgroundColor = element['color'];
        tituloBox.appendChild(titleCircle);
        
        const titulo = document.createElement('h3');
        titulo.style.marginLeft = '5px';
        titulo.innerText = element['titulo'];
        tituloBox.appendChild(titulo);

        const editButton = document.createElement('button');
        editButton.append('✏️');
        editButton.onclick = () => editarTarefa(element['id']);
        editButton.classList.add('card-btn','edit-btn');
        tituloBox.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.append('X');
        deleteButton.onclick = () => deletarTarefa(element['id']);
        deleteButton.classList.add('card-btn','delete-btn');
        tituloBox.appendChild(deleteButton);
        
        const prazo = document.createElement('p');
        let data = new Date(element['prazo']);
        prazo.innerText = `🗓️ Prazo: ${String(data.getDate()).padStart(2,'0')}/${String(data.getMonth()).padStart(2,'0')}/${data.getFullYear()}  ⏱️ ${String(data.getHours()).padStart(2,'0')}:${String(data.getMinutes()).padStart(2,'0')}`;

        
        const importanciaBox = document.createElement('div');
        importanciaBox.classList.add('flex-row');
        const importancia = document.createElement('p');
        importancia.innerText = 'Nível de importancia: '
        importanciaBox.append(importancia);
        const priorityCircle = document.createElement('p');
        priorityCircle.classList.add('circle');
        priorityCircle.style.backgroundColor = definirCorPrioridade(element['nivel_prioridade']);
        importanciaBox.append(priorityCircle);
        
        const task = document.createElement('article');
        task.style.gap = '8px';
        task.appendChild(tituloBox);
        task.appendChild(prazo);
        task.appendChild(importanciaBox);

        if(element['descricao'] != ''){
            const descricao = document.createElement('p');
            descricao.classList.add('description-card');
            descricao.innerText = element['descricao'];

            task.appendChild(descricao);
        }
        

        sectionTasks.appendChild(task);
    });
}

function descarregarTarefas(){
    const sectionTasks = document.getElementById('section-cards-tarefas');
    sectionTasks.innerHTML ='';
}

function editarTarefa(id){
    const urlAtual = window.location.href.split('/');
    window.location.replace(urlAtual[0]+'/'+urlAtual[1]+'/'+ urlAtual[2]+`/editarTarefas.html?id=${id}`);
}

async function deletarTarefa(id){
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const user = await getUser();
    if(tarefas === null || user === null) return;
    const tarefas_atualizada = tarefas[user.value].filter((task)=>task['id'] !== id);
    tarefas[user.value] = tarefas_atualizada;
    localStorage.setItem('tarefas',JSON.stringify(tarefas));
    alert(`Tarefa deletada com sucesso`);
    descarregarTarefas();
    carregarTarefas();
}

function definirCorPrioridade(nivel){
    if(nivel === 'Baixo'){
        return '#48d94d';
    }else if( nivel === 'Medio'){
        return '#E4C931';
    }else if(nivel === 'Alto'){
        return '#d87700';
    }else if(nivel === 'Urgente'){
        return '#ff0000';
    }
}

async function logout(){
    await cookieStore.delete('usuarioLogado');
    const urlAtual = window.location.href.split('/')
    window.location.replace(urlAtual[0]+'/'+urlAtual[1]+'/'+urlAtual[2]+'/login.html'); 
}

function alterarPagina(name){
    const urlAtual = window.location.href.split('/')
    window.location.replace(urlAtual[0]+'/'+urlAtual[1]+'/'+urlAtual[2]+`/${name}`); 
}

async function carregarNome() {
    const usernameInp = document.getElementById('username');
    const users = JSON.parse(localStorage.getItem('taskflowUsuarios'));
    const userlogged = await getUser();
    if( userlogged === null || userlogged.value === null){
        const urlAtual = window.location.href.split('/');
        alert('você não está logado, redirecionando para a pagina de login.');
        window.location.replace(urlAtual[0]+'/'+urlAtual[1]+'/'+urlAtual[2]+'/login.html'); 
    }
    usernameInp.innerText = `User: ${users[userlogged.value]['nome']}`;
}

if(window.location.href.split('/')[3].split('?')[0] === 'listarTarefas.html'){
    carregarTarefas();
}