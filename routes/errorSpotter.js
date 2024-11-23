const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = `${process.env.CHANNEL_ID}`; // ID kanálu, kam chceš logy

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ] 
}); 
if(DISCORD_TOKEN) console.log(DISCORD_TOKEN); else console.error("blbě se mi to říká, ale budeš muset vyrobit novej dotenv")

// Přihlášení bota
client.login(DISCORD_TOKEN);


function sendLogToDiscord(message) {
client.once("ready", async () => {
  console.log(`${client.user.tag} je ready`);
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel) {
      await channel.send(message);
      console.log("zpráva odeslána!");
    } else {
      console.error("Nepodařilo se načíst kanál s ID:", CHANNEL_ID);
    }
  } catch (err) {
    console.error("Chyba při přístupu ke kanálu:", err);
  }
});
}
module.exports = { sendLogToDiscord };
