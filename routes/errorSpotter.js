const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = "1300448864720912447"; // ID kanálu, kam chceš logy

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Discord bot je online jako ${client.user.tag}`);
});

// Přihlášení bota
client.login(DISCORD_TOKEN);

const sendLogToDiscord = async (message) => {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel) {
      channel.send(message);
    } else {
      console.error("Nepodařilo se najít Discord kanál.");
    }
  } catch (err) {
    console.error("Chyba při odesílání zprávy na Discord:", err);
  }
};

module.exports = { sendLogToDiscord };
