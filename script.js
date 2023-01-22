let userName;
let stat;
const divMsg = document.getElementById("mensagens");


function loginError(){
    window.location.reload();
    alert("Seu nome já está em uso. Favor utilizar outro");
    login();
}
function loginSucess(){
     setInterval(manterConexao, 5000);
    setInterval(buscarMensagens, 3000);
}
function manterConexao() {
    axios.post(`https://mock-api.driven.com.br/api/v6/uol/status`, userName);
}
function tipoMsg(mensagem) {
    if (mensagem.type === `message`) {
        divMsg.innerHTML += `<div data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> para&nbsp; <span>
        ${mensagem.to}</span>: ${mensagem.text}
        </div>`;
    } else if (mensagem.type === `status`) {
        divMsg.innerHTML += `<div class="statusMsg" data-test="message">
        <b>(${mensagem.time})&nbsp;</b><span>${mensagem.from}&nbsp;</span>${mensagem.text}
        </div>`;
    } else {
        divMsg.innerHTML += `<div class="privateMsg" data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> reservadamente para&nbsp; <span>
        ${mensagem.to}</span>: ${mensagem.text}
        </div>`;
    }
}
function exibirMsg(msg){
    divMsg.innerHTML = "";
    msg.forEach(tipoMsg);
    divMsg.lastChild.scrollIntoView(true);
}

function buscarMensagens() {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages`);
    promisse.then((msg) => {
        const message = msg.data.filter(Msg => Msg.type === `message` || Msg.type === `status`
        || (Msg.type === `private_message` & (Msg.from === userName || Msg.to === userName)));
    exibirMsg(message);
    });
}

function login() {
    let string = prompt("Digite seu nome");
    userName = { name: `${string}` };

    const promisse = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants`, userName);

    promisse.then(loginSucess);
    promisse.catch(loginError);
}

login();