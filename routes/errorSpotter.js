
const fetch = require("node-fetch");

// URL tvého webhooku
const webhookURL = "https://discordapp.com/api/webhooks/1310249077887340604/wWzEa6MYgHOxWAeeVpkhaqEa-nlO1KwK4lr3tsgdb-djEAkoX0Ongt-bv3fER5ckUW4r";

// Funkce pro odesílání zprávy
const sendLogToDiscord = async (message) => {
  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message, // Obsah zprávy
      }),
    });

    if (response.ok) {
      console.log("Zpráva byla úspěšně odeslána!");
    } else {
      console.error("Chyba při odesílání zprávy:", await response.text());
    }
  } catch (error) {
    console.error("Chyba:", error);
  }
};

// Příklad použití
module.exports = {sendLogToDiscord};
