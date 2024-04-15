const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, hyperlink } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('header')
        .setDescription('Get a quick preview of a professor without the comments')
        .addStringOption(option =>
            option.setName('professor')
                .setRequired(true)
                .setDescription(`The professor's name. 'Firstname Lastname', 'Firstname L.', and 'F. Lastname' are all the same`)),
    async execute(interaction) {

        try {
        let url = `${process.env.server}${interaction.options.getString('professor')}`;

        let res = await fetch(`${url}`)
        let data = await res.json();


        let ret = ``;
        let recent = ``;

        if (data.result === "Error") {
            const embed = new EmbedBuilder()
                .setDescription(`"${interaction.options.getString('professor')}" returned an error, double check the spelling (case doesn't matter but spelling and punctuation do). Names can be shortened as well, for example. 'Jean Gerard' can be 'J. Gerard' or 'Jean G.'`).setColor("#FF0000");

            return await interaction.reply({ embeds: [embed] });
        }
    
    
        ret += `
        **Professor: ${data.result.info.name}**
        **Rating**: ${data.result.info.rating}
        **Would Take Again**: ${data.result.info.wta}
        **Difficulty**: ${data.result.info.level}
        **Total Ratings**: ${data.result.info.totalRatings}\n
        `

        let l = hyperlink(`Rmp Url`, `${data.result.info.link}`)
        let l2 = hyperlink(`Bot Git`, `https://github.com/EmperorJean/rmpUMBbot`)
        let l3 = hyperlink(`Backend Git`, `https://github.com/EmperorJean/rmpUMBbackend`)
        let l4 = hyperlink(`Report an Issue`, `https://github.com/EmperorJean/rmpUMBbackend/issues`)
        const embed = new EmbedBuilder()
            .setDescription(ret).setColor("#69f2ff")
            .setTitle(`Visit ${data.result.info.name}'s page`)
            .setURL(data.result.info.link)
            .addFields({ name: 'Links', value: `${l} - ${l2} - ${l3} - ${l4}`, inline: true })
            .setFooter({ text: 'All info is pulled from www.ratemyprofessors.com | For more info use /rating' })

        await interaction.reply({ embeds: [embed] });
    }catch(err)
    {
        const embed = new EmbedBuilder()
        .setDescription(`An error occured and has been logged`).setColor("#FF0000")

        console.error(err)
        return 
    }

    },
};