const axiosInstance = axios.create({
    baseURL: 'https://mock-api.driven.com.br/api/v6/uol/',
});

const divMsg = document.getElementById("mensagens");
let userName;
const classMap = {
  message: 'message',
  status: 'warningMsg',
  private: 'privateMsg',
};

const Reload = () => window.location.reload();

const loginError = () => {
    window.location.reload();
    alert("Seu nome já está em uso. Favor utilizar outro");
    login();
}

const loginSuccess = () => {
    setInterval(manterConexao, 5000);
    setInterval(buscarMensagens, 3000);
}

const manterConexao = () => axiosInstance.post('status', userName);

const tipoMsg = (mensagem) => {
    const className = classMap[mensagem.type] || '';
    const privateText = mensagem.type === 'private' ? 'reservadamente para ' : '';
    const html = `
    <div class="${className}" data-test="message">
        <b>(${mensagem.time})&nbsp;</b> <span>${mensagem.from}&nbsp;</span> ${privateText}<span>
        ${mensagem.to}</span>: ${mensagem.text}
    </div>`;
    divMsg.innerHTML += html;
    };
    
    const inputEl = document.querySelector('input');

    inputEl.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
    enviarMsg();
    }
    });


    
    const enviarMsg = async () => {
    try {
    const input = inputEl.value;
    await axiosInstance.post('messages', { from: userName.name, to: 'Todos', text: input, type: 'message' });
    buscarMensagens();
    inputEl.value = "";
    } catch (error) {
    Reload();
    }
    };
    
    const exibirMsg = (msg) => {
    divMsg.innerHTML = "";
    msg.forEach(tipoMsg);
    divMsg.lastChild.scrollIntoView(true);
    };
    
    const buscarMensagens = () => {
        axiosInstance.get('messages').then(({ data }) => {
        const messages = data.filter(msg => (msg.type === 'message' || msg.type === 'status' || (msg.type === 'private_message' && (msg.from === userName || msg.to === userName))));
        exibirMsg(messages);
        });
        }
        
        const login = async () => {
        const name = prompt("Digite seu nome");
        userName = { name };
        try {
        await axiosInstance.post('participants', userName);
        loginSuccess();
        } catch (error) {
        loginError();
        }
        }
        
        login();
      