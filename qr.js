const { makeid } = require('./gen-id');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");
const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    async function MAFIA_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS(randomItem)
            });
            
            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect,
                    qr
                } = s;
                
                if (qr) await res.end(await QRCode.toBuffer(qr));
                
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "MAFIA-MDABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    const randomText = generateRandomText();
                    try {
                        const { upload } = require('./mega');
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "IK~" + string_session;
                        let code = await sock.sendMessage(sock.user.id, { text: md });
                        await delay(2000);
                        await sock.sendMessage(
                            sock.user.id,
                            {
                                text: '*Hello there MAFIA-MD User! \ud83d\udc4b\ud83c\udffb* \n\n> Do not share your session id with anyone. use it only for bot deploy.\n\n *Thanks for using MAFIA-MD Bots \ud83c\uddf5\ud83c\uddf0* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com/channel/0029VakJs4YJkK7BYQF1Wp1g\n\n _Dont forget to give star to repos ⬇️_ \n\n- *MAFIA-MD Repository ✅* \n\nhttps://github.com/MAFIAADEEL/MAFIA-MD\n\n- *MAFIA-MD SPOT CHANNEL ✅*\n\nhttps://whatsapp.com/channel/0029VavP4nX0G0XggHzhVg0R\n\n> *Powered BY MAFIA ADEEL* \ud83d\udda4'
                            },
                            { quoted: code }
                        );
                    } catch (e) {
                        let ddd = sock.sendMessage(sock.user.id, { text: e });
                        let desc = `*Don't Share with anyone this code use for deploying MAFIA MD*\n\n ◦ *Github:* https://github.com/MAFIAADEEL/MAFIA-MD`;
                        await sock.sendMessage(sock.user.id, { text: desc }, { quoted: ddd });
                    }
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    MAFIA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    await MAFIA_MD_PAIR_CODE();
});

setInterval(() => {
    console.log("☘️ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...");
    process.exit();
}, 180000); //30min

module.exports = router;