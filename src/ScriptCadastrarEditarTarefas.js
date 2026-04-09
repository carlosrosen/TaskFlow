const cadastrarTarefa= document.getElementById('form-cadastrar-tarefa');

cadastrarTarefa.addEventListener('submit',async (e)=>{
    let tarefas = JSON.parse(localStorage.getItem('tarefas'));
    let id = localStorage.getItem('id');
    if(id === 'NaN'|| id === null){
        id = 1;
    }else{
        id = Number.parseInt(id);
    }
    e.preventDefault(); 
    const user = await cookieStore.get('usuarioLogado');
    if( user === null || user.value === null){
        let url = window.location.href.split('/');
        newUrl = new URL(url[0]+url[1]+ url[2]+'/login.html');
        alert('você não esta logado, redirecionando para a pagina de login');
        window.location.replace(newUrl);
        return;
    }
    const email = user.value;
    const titulo = document.querySelector('input[name="titulo"]');
    const prazo = document.querySelector('input[name="prazo"]');
    const nivelPrioridade = document.querySelector('select[name="nivel-prioridade"]');
    const cor = document.getElementById('color-inp');
    const descricao = document.querySelector('textarea[name="descricao"]');
    if(titulo.value === '' || titulo.value === null){
        alert('Defina um título para a tarefa.');
        return;
    }
    if(prazo.value === '' || prazo.value === null){
        alert('Defina um prazo para a realização da tarefa.')
        console.log('valor do prazo: ',prazo.value);
        return;
    }
    const newTask = {
        'id': id
        ,'titulo':titulo.value
        ,'prazo': prazo.value
        ,'nivel_prioridade': nivelPrioridade.value
        ,'descricao': descricao.value
        ,'color': cor.value
    };
    if(tarefas === null){
        tarefas = JSON.parse(`{"${email}": []}`);
    }
    id++;
    if(tarefas[user.value] === undefined){
        tarefas[user.value] = [newTask]
    }else{
        tarefas[user.value].push(newTask)
    }
    alert(`Tarefa ${titulo.value} cadastrada com sucesso`);
    localStorage.setItem('tarefas',JSON.stringify(tarefas));
    localStorage.setItem('id',`${id}`);

    titulo.value = null;
    prazo.value = null;
    nivelPrioridade.value = 'Medio'
    descricao.value = null
    let url2 = window.location.href.split('/');
    newUrl2 = new URL(url2[0]+url2[1]+ url2[2]+'/cadastrarTarefas.html');
    window.location.replace(newUrl2);
});

document.querySelector('button[name="minhas-tarefas"]').addEventListener('click',(e)=>{
    const destino = window.location.href.split('/');
    const urlDestino = new URL(destino[0]+destino[1]+ destino[2]+'/listarTarefas.html');
    window.location.replace(urlDestino);
});