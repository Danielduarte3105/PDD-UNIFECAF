// Formatação do CPF
function formatarCPF() {
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3) {
            value = value.substring(0, 3) + '.' + value.substring(3);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '.' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + '-' + value.substring(11, 13);
        }
        
        e.target.value = value;
        
        // Validação do CPF
        validarCPF(value);
    });
}

// Validação do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
        document.getElementById('cpf-error').textContent = 'CPF inválido';
        document.getElementById('cpf-error').style.display = 'block';
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== digit1) {
        document.getElementById('cpf-error').textContent = 'CPF inválido';
        document.getElementById('cpf-error').style.display = 'block';
        return false;
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(10)) !== digit2) {
        document.getElementById('cpf-error').textContent = 'CPF inválido';
        document.getElementById('cpf-error').style.display = 'block';
        return false;
    }
    
    document.getElementById('cpf-error').style.display = 'none';
    return true;
}

// Converter nome para maiúsculas
function converterNomeParaMaiusculas() {
    const nomeInput = document.getElementById('nome');
    nomeInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Atualização do relógio
function atualizarRelogio() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const dayOfWeekElement = document.getElementById('dayOfWeek');

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    const dayOfWeek = now.toLocaleDateString('pt-BR', { weekday: 'long' });

    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    dateElement.textContent = `${day}/${month}/${year}`;
    dayOfWeekElement.textContent = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

    // Atualiza campos ocultos
    document.getElementById('hiddenTime').value = timeElement.textContent;
    document.getElementById('hiddenDate').value = dateElement.textContent;
    document.getElementById('hiddenDayOfWeek').value = dayOfWeekElement.textContent;
}

// Validação do formulário e envio para Google Apps Script
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value;
    const horario = document.querySelector('input[name="horario"]:checked')?.value;
    const obs = document.getElementById('obs').value;
    const time = document.getElementById('hiddenTime').value;
    const date = document.getElementById('hiddenDate').value;
    const dayOfWeek = document.getElementById('hiddenDayOfWeek').value;
    const successMessage = document.getElementById('success-message');

    // Validação do nome
    if (!nome) {
        document.getElementById('nome-error').textContent = 'Por favor, insira seu nome';
        document.getElementById('nome-error').style.display = 'block';
        return;
    } else {
        document.getElementById('nome-error').style.display = 'none';
    }

    // Validação do CPF
    if (!validarCPF(cpf)) {
        return;
    }

    // Validação do horário
    if (!horario) {
        successMessage.textContent = 'Por favor, selecione um horário';
        successMessage.style.color = 'var(--error-color)';
        successMessage.style.display = 'block';
        return;
    } else {
        successMessage.style.display = 'none';
    }

    const formData = {
        nome,
        cpf,
        horario,
        obs,
        time,
        date,
        dayOfWeek
    };

    try {
        // Envia a requisição usando mode: 'no-cors'
        await fetch('https://script.google.com/macros/s/AKfycbxVeTROuyPep3usQYbvsnXh4gl_R9llTDuUfLhKzso1BlA8OZ51GwFnSy6tXC5t21fK/exec', {
            method: 'POST',
            mode: 'no-cors', // Evita bloqueio de CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Como 'no-cors' não retorna a resposta, assumimos sucesso e orientamos o usuário
        successMessage.textContent = 'Registro enviado! Verifique a planilha para confirmar.';
        successMessage.style.color = 'var(--success-color)';
        successMessage.style.display = 'block';
        document.getElementById('registroForm').reset();
        document.querySelectorAll('.radio-input').forEach(input => input.checked = false);
    } catch (error) {
        successMessage.textContent = 'Erro ao enviar o formulário. Tente novamente ou verifique a conexão.';
        successMessage.style.color = 'var(--error-color)';
        successMessage.style.display = 'block';
    }
});

// Melhorar experiência do formulário
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.querySelector('.form-label').style.backgroundColor = 'rgba(13, 71, 161, 0.9)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.querySelector('.form-label').style.backgroundColor = 'rgba(26, 115, 232, 0.9)';
    });
});

// Inicializar funções
formatarCPF();
converterNomeParaMaiusculas();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);
