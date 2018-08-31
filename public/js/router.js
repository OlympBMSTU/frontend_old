const login_form = document.getElementById("login_form");
const err_field = document.getElementById("error");

login_form.addEventListener('submit', event => {
    event.preventDefault();

    const login = document.getElementsByClassName("login__input")[0].value;
	const pass = document.getElementsByClassName("login__input")[1].value;
	const repass = document.getElementsByClassName("login__input")[2].value;
    const mail = document.getElementsByClassName("login__input")[3].value;
          

    document.getElementsByClassName("login__input")[0].style.backgroundColor = "#ffffff";
    document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffffff";
    document.getElementsByClassName("login__input")[2].style.backgroundColor = "#ffffff";
    document.getElementsByClassName("login__input")[3].style.backgroundColor = "#ffffff";

    err_field.innerHTML="";

    if (login === '') {
        document.getElementsByClassName("login__input")[0].style.backgroundColor = "#ffbbbb";
    }

    if (pass != '' && pass.length >= 8) {
        document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffbbbb";
    }

    if (repass != '' && pass.length >= 8) {
        document.getElementsByClassName("login__input")[2].style.backgroundColor = "#ffbbbb";
    }

    if (mail != '') {
        document.getElementsByClassName("login__input")[3].style.backgroundColor = "#ffbbbb";
    }

    if (pass != repass) { 
        document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffbbbb";
        document.getElementsByClassName("login__input")[2].style.backgroundColor = "#ffbbbb";

        err_field.innerHTML = 'Пароли не совпадают'
    }
			
			
	api.requestData("register", "POST", {login: login, password: pass, email: mail})
	.then(function(response) {
        err_field.innerText = response.res_msg;
	});
});