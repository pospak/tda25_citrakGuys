function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
           username: username,
           password:password
        })
    })
    .then(response => {
        // Pokud je odpověď neúspěšná (status 4xx, 5xx), zpracuj ji ručně
        if (!response.ok) {
            return response.json().then(errData => {
                if (response.status === 404) {
                    throw new Error("❌ Uživatel nenalezen!");
                } else if (response.status === 401) {
                    throw new Error("❌ Nesprávné heslo!");
                } else if (response.status === 500) {
                    throw new Error("❌ Interní chyba serveru! Zkus to později.");
                } else {
                    throw new Error(errData.message || "❌ Neznámá chyba!");
                }
            });
        }
        return response.json(); // Pokud je status OK (200), pokračuj dál
    })
    .then(data => {
        var message = data.message;
        var user = data.user;
        if(message == "Ok"){
           //alert(`Pokus o přihlášení uživatele ${user} - přesměrování na hlavní stránku`);
            window.location.href="/"
        }else{
            alert(`${message}`)
        }
    })
    .catch(error => {
        console.error("Chyba:", error);
        alert("⚠️ Chyba při přihlášení: " + error.message);
    });
}

function register(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passVer = document.getElementById("passwordVerify").value;
    const email = document.getElementById("email").value;


    if(password === passVer){
        fetch("/login/new", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
               username: username,
               password:password,
               email:email
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("něco se dosralo, nepodařilo se přijmout odpověď od api"); 
            }
            return response.json(); // Vrátí JSON data pro další zpracování
        })
        .then(data => {
            var message = data.message;
            if(message == "Ok"){
                alert(`Registrace proběhla v pořádku. ${username} vítej v našem systému! V dalším kroku se prosím přihlaš svými zvolenými údaji.`)
                window.location.href="/login"
            }else{
                alert("Backend odeslal špatnou odpověď nebo odpověď nebyla nalezena :(. Prosím zkus to později znovu.")
            }
        })
        .catch(error => console.error("Error: "+error))
    }else{
        alert("Hesla se neshodují! Prosím zkus to znovu.")
    }
   
   

}

function loginToGame(uuid){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
           username: username,
           password:password
        })
    })
    .then(response => {
        // Pokud je odpověď neúspěšná (status 4xx, 5xx), zpracuj ji ručně
        if (!response.ok) {
            return response.json().then(errData => {
                if (response.status === 404) {
                    throw new Error("❌ Uživatel nenalezen!");
                } else if (response.status === 401) {
                    throw new Error("❌ Nesprávné heslo!");
                } else if (response.status === 500) {
                    throw new Error("❌ Interní chyba serveru! Zkus to později.");
                } else {
                    throw new Error(errData.message || "❌ Neznámá chyba!");
                }
            });
        }
        return response.json(); // Pokud je status OK (200), pokračuj dál
    })
    .then(data => {
        var message = data.message;
        var userID = data.uuid;
        if(message == "Ok"){
           //alert(`Pokus o přihlášení uživatele ${user} - přesměrování na hlavní stránku`);
            window.location.href=`/play/friend/${uuid}/${userID}`
        }else{
            alert(`${message}`)
        }
    })
    .catch(error => {
        console.error("Chyba:", error);
        alert("⚠️ Chyba při přihlášení: " + error.message);
    });
}