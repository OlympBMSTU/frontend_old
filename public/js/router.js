if (!navigator.cookieEnabled) {
    alert( 'Включите cookie для работы с этим сайтом' );
  }

// LIB
function toRegister() {
    document.getElementById('register_part').style.display = 'block';

    document.getElementById('login_part').style.display = 'none';
    document.getElementById('info_part').style.display = 'none';
}

function toInfo() {
    if (hasCookie('bmstuOlimpAuth')) {
        api.requestData("info", "GET")
        .then(function(response) {
            if (response.res_code === 'OK') {
                document.getElementById('login_info').innerHTML = response.res_data.login;
                document.getElementById('email_info').innerHTML = response.res_data.email;

                document.getElementById('info_part').style.display = 'block';

                document.getElementById('login_part').style.display = 'none';
                document.getElementById('register_part').style.display = 'none';
            } else {
                toLogin();
                deleteCookie('bmstuOlimpAuth');
            }
        });
    } else {
        toLogin();
    }
}

function toLogin() {
    document.getElementById('login_part').style.display = 'block';

    document.getElementById('info_part').style.display = 'none';
    document.getElementById('register_part').style.display = 'none';
}

function showError (msg, dissolve = false) {
    const err_field = document.getElementById("error");
    err_field.innerHTML = msg;

    if (dissolve) {
        setTimeout(function() { document.getElementById("error").innerHTML='' }, 5000);
    }
}



// BTNS
const to_register_form = document.getElementById("btn_start_register");
to_register_form.onclick = function() {
    showError('');
    toRegister();
    return false;
}

const back_to_register_form = document.getElementById("btn_back_to_login");
back_to_register_form.onclick = function() {
    showError('');
    toLogin();
    return false;
}

const logout_in_info = document.getElementById("btn_logout");
logout_in_info.onclick = function() {
    showError('');
    toLogin();
    deleteCookie('bmstuOlimpAuth');
    return false;
}

const register_form = document.getElementById("register_form");
register_form.addEventListener('submit', event => {
    event.preventDefault();

    const login_input = register_form.getElementsByClassName("login__input")[0];
    const login = login_input.value;

    const pass_input = register_form.getElementsByClassName("login__input")[1];
    const pass = pass_input.value;

    const repass_input = register_form.getElementsByClassName("login__input")[2];
    const repass = repass_input.value;

    const mail_input = register_form.getElementsByClassName("login__input")[3];
    const mail = mail_input.value;

    login_input.style.backgroundColor = "#ffffff";
    pass_input.style.backgroundColor = "#ffffff";
    repass_input.style.backgroundColor = "#ffffff";
    mail_input.style.backgroundColor = "#ffffff";

    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (pass.length < 8) {
        pass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    if (repass.length < 8) {
        repass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    if (mail === '') {
        mail_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (pass != repass) { 
        pass_input.style.backgroundColor = "#ffbbbb";
        repass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;

        showError('Пароли не совпадают');

        return false;
    }
    
    let captcha = grecaptcha.getResponse();
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        isValid = false;

        return false;
    }

	if (isValid){
        api.requestData("register", "POST", {login: login, password: pass, email: mail, 'g-recaptcha-response': captcha})
        .then(function(response) {
            
            if (response.res_code === 'OK') {
                showError(response.res_msg, true);
                toLogin();
            } else {
                showError(response.res_msg);
            }
        });
    }	
});

const login_form = document.getElementById("login_form");
login_form.addEventListener('submit', event => {
    event.preventDefault();

    const login_input = login_form.getElementsByClassName("login__input")[0];
    const login = login_input.value;

    const pass_input = login_form.getElementsByClassName("login__input")[1];
    const pass = pass_input.value;

    login_input.style.backgroundColor = "#ffffff";
    pass_input.style.backgroundColor = "#ffffff";

    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (pass.length < 8) {
        pass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
        showError('Пароль должен содержать минимум 8 символов');
    }
			
	if (isValid){
        api.requestData("login", "POST", {login: login, password: pass})
        .then(function(response) {
            if (response.res_code === 'OK') {
                showError(response.res_msg, true);

                setCookie('bmstuOlimpAuth', response.res_data, {expires: 300});

                toInfo();
            } else {
                showError(response.res_msg);
            }
        });
    }	
});

window.onload = function() {
    toInfo();
}