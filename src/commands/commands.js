const Discordjs = require('../utils/discordjs');
const Embeds = require('../utils/embeds');
const Albion = require('../services/tools4Albion');
const Other = require('../services/other');
module.exports = {

    help: (msg, param) => {

        console.log(param[0]);

        msg.reply("✅")
    },

    apply: async (msg, params, channelOut) => {
        if (params.length == 0) return

        const nick = params[0];
        const playersInfo = await Albion.getInfoPlayerName(nick);

        if (!playersInfo || playersInfo.length == 0 || playersInfo[0].Name !== nick) {
            let res = "no se encontro nick: " + nick;
            if (playersInfo && playersInfo.length != 0) {
                res += ".  encontrado: ";
                playersInfo.forEach(element => {
                    res += element.Name + ", "
                });
            }
            return msg.reply(res)
        } else {
            const allInfoPlayer = await Albion.getAllInfoPlayerID(playersInfo[0].Id)
            const isBanAlli = await Other.isBlackListAlli(playersInfo[0].Name)

            if (!isBanAlli) {
                Discordjs.changeNickName(msg, "[Aplico] " + params[0])
            } else {
                msg.reply(`${nick} se encuentra blacklisteado de BBB`)
            }
            const newMsg = await msg.guild.channels.cache.get(channelOut).send(Embeds.infoPlayer(msg.author, allInfoPlayer, isBanAlli))
            if (isBanAlli) {
                Discordjs.addReactionNo(newMsg);
            } else {
                Discordjs.addReactionYesNo(newMsg);
            }

        }

    },

}