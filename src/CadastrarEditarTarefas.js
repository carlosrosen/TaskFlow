function getIdCounter(){
    let tarefas = localStorage.getItem('tarefas');
    let id = localStorage.getItem('id');
        if(id === 'NaN'|| id === null || tarefas === null){
            id = 1;
        }else{
            id = Number.parseInt(id);
        }
    return id;
}

async function salvarTarefa(e,retorno,isNewTask){
        e.preventDefault(); 
        let tarefas = JSON.parse(localStorage.getItem('tarefas'));
        let id;
        if(isNewTask){
            id = getIdCounter();
        }else{
            id = getParamTaskId()
        }
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
    if(tarefas[email] === undefined){
        tarefas[email] = [newTask]
    }else{
        if(isNewTask){
            tarefas[email].push(newTask)
            id++;
        }else{
            for(let i = 0; i < tarefas[email].length ;i++){
                if(tarefas[email][i]['id'] === id){
                    tarefas[email][i] = newTask;
                }
            }
        }
    }
    alert(`Tarefa ${titulo.value} salvo com sucesso`);
    localStorage.setItem('tarefas',JSON.stringify(tarefas));
    localStorage.setItem('id',`${id}`);
    
    titulo.value = null;
    prazo.value = null;
    nivelPrioridade.value = 'Medio'
    descricao.value = null
    let url2 = window.location.href.split('/');
    newUrl2 = new URL(url2[0]+url2[1]+ url2[2]+'/'+retorno);
    window.location.replace(newUrl2);
}

const cadastrarTarefa= document.getElementById('form-cadastrar-tarefa');
const editarTarefa = document.getElementById('form-editar-tarefa');
if(cadastrarTarefa !== null){
    cadastrarTarefa.addEventListener('submit',async (e)=> {salvarTarefa(e,'cadastrarTarefas.html',true)});
}else if(editarTarefa !== null){
    editarTarefa.addEventListener('submit',async (e)=> {salvarTarefa(e,'listarTarefas.html',false)});
}


document.querySelector('button[name="minhas-tarefas"]').addEventListener('click',(e)=>{
    const destino = window.location.href.split('/');
    const urlDestino = new URL(destino[0]+destino[1]+ destino[2]+'/listarTarefas.html');
    window.location.replace(urlDestino);
});

function getParams(){
    try{
        const retorno = {};
        params = window.location.href.split('?')[1].split('=');
        for(let i = 0; i< params.length;i+=2){
            retorno[params[i]] = params[i+1];
        }
        return retorno;
    }catch (error){
        return null;
    }
}

function getParamTaskId(){
    const params = getParams();
    if(params === null) return null;
    
    let id = Number.parseInt(params['id']);
    return id;
}

async function pegarTaskERegistarNosCampos(){
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    let url = window.location.href.split('/');
    const id = getParamTaskId();
    if(id === null){
        window.location.replace(url[0]+'/'+url[1]+'/'+url[2]+'/listarTarefas.html')
    }
    const user = await cookieStore.get('usuarioLogado');
    const email = user.value;
    const titulo = document.querySelector('input[name="titulo"]');
    const prazo = document.querySelector('input[name="prazo"]');
    const nivelPrioridade = document.querySelector('select[name="nivel-prioridade"]');
    const cor = document.getElementById('color-inp');
    const descricao = document.querySelector('textarea[name="descricao"]');
    let found = false;
    tarefas[email].forEach(element => {
        if(element['id'] === id){
            titulo.value = element['titulo'];
            prazo.value = element['prazo'];
            nivelPrioridade.values = element['nivel_prioridade'];
            cor.value = element['color'];
            descricao.value =  element['descricao'];
            found = true;
        }
    });
    if(!found){
        window.location.replace(url[0]+'/'+url[1]+'/'+url[2]+'/listarTarefas.html');
    }
}

if(window.location.href.split('/')[3].split('?')[0] === 'editarTarefas.html'){
    pegarTaskERegistarNosCampos();
}
