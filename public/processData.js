function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    alert(`Požadavek na přihlášení uživatele ${username} s heslem ${password}`);
}

function register(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passVer = document.getElementById("passwordVerify").value;
    const email = document.getElementById("email").value;

    if(password === passVer){
        alert(`Požadavek na přihlášení uživatele ${username} jehož heslo ${password} se shodovalo s ověřením. Email uživatele je ${email}`)
    }else{
        alert(`Požadavek na přihlášení uživatele ${username} jehož heslo ${password} se neshodovalo s ověřením. Email uživatele je ${email}`)
    }
}