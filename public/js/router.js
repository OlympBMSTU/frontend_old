const fioRegExp = /[А-Яа-я- ]+/;

if (!navigator.cookieEnabled) {
    alert( 'Включите cookie для работы с этим сайтом' );
  }

// LIB
function resetPage() {
    for (let pt of document.getElementsByClassName('part')) {
        pt.style.display = 'none';
    };
    for (let el of document.getElementsByTagName('input')) {
        el.style.backgroundColor = "#ffffff";
    };
}

function resetFields() {
    for (let el of document.getElementsByTagName('input')) {
        el.style.backgroundColor = "#ffffff";
    };
}

function toRegister() {
    resetPage();
    document.getElementById('register_part').style.display = 'block';
}

function toInfo() {
    if (hasCookie('bmstuOlimpAuth')) {
        api.requestData("info", "GET")
        .then(function(response) {
            if (response.res_code === 'OK') {
                resetPage();

                document.getElementById('fio_info').innerHTML = response.res_data.fio;
                document.getElementById('email_info').innerHTML = response.res_data.email;

                document.getElementById('info_part').style.display = 'block';
            } else {
                deleteCookie('bmstuOlimpAuth');
                toLogin();
            }
        });
    } else {
        toLogin();
    }
}

function toLogin() {
    resetPage();
    document.getElementById('login_part').style.display = 'block';
}

function toRecover() {
    resetPage();
    document.getElementById('recover_part').style.display = 'block';
}

function showError (msg, dissolve = false) {
    const err_field = document.getElementById("error");
    err_field.innerHTML = msg;

    if (dissolve) {
        setTimeout(function() { document.getElementById("error").innerHTML='' }, 5000);
    }
}



// BTNS
const to_recover_pass = document.getElementById("btn_recover_pass");
to_recover_pass.onclick = function() {
    showError('');
    toRecover();
    return false;
}

const to_register_form = document.getElementById("btn_start_register");
to_register_form.onclick = function() {
    showError('');
    toRegister();
    return false;
}

const rec_to_login_form = document.getElementById("btn_rec_to_login");
rec_to_login_form.onclick = function() {
    showError('');
    toLogin();
    return false;
}

const reg_to_login_form = document.getElementById("btn_reg_to_login");
reg_to_login_form.onclick = function() {
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

    resetFields();

    const login_input = document.getElementById("reg_login_input");
    const login = login_input.value;

    const pass_input = document.getElementById("reg_password_input");
    const pass = pass_input.value;

    const repass_input = document.getElementById("reg_repassword_input");
    const repass = repass_input.value;

    const email_input = document.getElementById("reg_email_input");
    const email = email_input.value;

    const familia_input = document.getElementById("reg_familia_input");
    const familia = familia_input.value;

    const imia_input = document.getElementById("reg_imia_input");
    const imia = imia_input.value;

    const otchestvo_input = document.getElementById("reg_otchestvo_input");
    const otchestvo = otchestvo_input.value;


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

    let familia_check = familia.match(fioRegExp);
    if (familia === '' || !familia_check || familia_check[0].length != familia.length) {
        familia_input.style.backgroundColor = "#ffbbbb";
        showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
        isValid = false;
    }

    let imia_check = imia.match(fioRegExp);
    if (imia === '' || !imia_check || imia_check[0].length != imia.length) {
        imia_input.style.backgroundColor = "#ffbbbb";
        showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
        isValid = false;
    }

    if (otchestvo  != '') {
        let otchestvo_check = otchestvo.match(fioRegExp);
        if (!otchestvo_check || !otchestvo_check || otchestvo_check[0].length != otchestvo.length) {
            otchestvo_input.style.backgroundColor = "#ffbbbb";
            showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
            isValid = false;
        }
    }

    if (email === '') {
        email_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }


    if (pass != repass) { 
        pass_input.style.backgroundColor = "#ffbbbb";
        repass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;

        showError('Пароли не совпадают');

        return false;
    }
    
    let captcha = grecaptcha.getResponse(1);
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        isValid = false;

        return false;
    }

	if (isValid){
        api.requestData("register", "POST", {login: login, password: pass, familia: familia, imia: imia, otchestvo: otchestvo, email: email, 'g-recaptcha-response': captcha})
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

const change_passsword_form = document.getElementById("change_passsword_form");
change_passsword_form.addEventListener('submit', event => {
    event.preventDefault();

    resetFields();

    const old_pass_input = document.getElementById("cng_password_old_input");
    const old_pass = old_pass_input.value;

    const pass_input = document.getElementById("cng_password_new_input");
    const pass = pass_input.value;

    const repass_input = document.getElementById("cng_password_renew_input");
    const repass = repass_input.value;


    showError('');

    let isValid = true;

    if (old_pass.length < 8) {
        old_pass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
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


    if (pass != repass) { 
        pass_input.style.backgroundColor = "#ffbbbb";
        repass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;

        showError('Пароли не совпадают');

        return false;
    }

	if (isValid){
        api.requestData("changepassword", "POST", {password: old_pass, newpassword: pass} )
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

    const login_input = document.getElementById("log_login_input");
    const login = login_input.value;

    const pass_input = document.getElementById("log_password_input");
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

                setCookie('bmstuOlimpAuth', response.res_data, {expires: 84000});

                toInfo();
            } else {
                showError(response.res_msg);
            }
        });
    }	
});

const recover_form = document.getElementById("recover_form");
recover_form.addEventListener('submit', event => {
    event.preventDefault();

    const login_input = document.getElementById("rec_login_input");
    const login = login_input.value;

    const email_input = document.getElementById("rec_email_input");
    const email = email_input.value;

    resetFields();
    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (email === '') {
        email_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

	let captcha = grecaptcha.getResponse(0);
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        isValid = false;

        return false;
    }		

	if (isValid){
        api.requestData("recover", "POST", {login: login, email: email, 'g-recaptcha-response': captcha})
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

window.onload = function() {
    toInfo();
}