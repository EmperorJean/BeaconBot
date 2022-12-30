const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, hyperlink } = require('discord.js');
const dotenv = require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rating')
        .setDescription('Look up the ratemyprofessor for any professor')
        .addStringOption(option =>
            option.setName('professor')
                .setRequired(true)
                .setDescription('The professor name')),
    async execute(interaction) {

        let url = `${process.env.server}${interaction.options.getString('professor')}`;

        let res = await fetch(`${url}`)
        let data = await res.json();


        let ret = ``;
        let recent = ``;

        if (data.result === "Error") {
            const embed = new EmbedBuilder()
                .setDescription(`"${interaction.options.getString('professor')}" returned an error, double check the spelling (case doesn't matter but spelling does)`).setColor("#FF0000");

            return await interaction.reply({ embeds: [embed] });
        }

        for (let i = 0; i < Math.min(5, data.result.comments.length); i++) {
            recent += `${data.result.comments[i]}\n\n`
        }


        ret += `
        
        **Professor: ${data.result.info.name}**
        **Rating**: ${data.result.info.rating}
        **Would Take Again**: ${data.result.info.wta}
        **Difficulty**: ${data.result.info.level}
        **Total Ratings**: ${data.result.info.totalRatings}\n
        **Recent Comments**: \n${recent}
        `


        // await channel.send({embed: embed});
        // interaction.reply({content: 'done', ephemeral: true})

        let l = hyperlink(`Rmp Url`, `${data.result.info.link}`)
        let l2 = hyperlink(`Bot Git`, `https://github.com/EmperorJean/rmpUMBbot`)
        let l3 = hyperlink(`Backend Git`, `https://github.com/EmperorJean/rmpUMBbackend`)
        const embed = new EmbedBuilder()
            .setDescription(ret).setColor("#69f2ff")
            .setTitle(`Visit ${data.result.info.name}'s page`)
            .setURL(data.result.info.link)
            .addFields({ name: 'Links', value: `${l} - ${l2} - ${l3}`, inline: true })
            .setFooter({ text: 'All info is pulled from www.ratemyprofessors.com' })

        await interaction.reply({ embeds: [embed] });

    },
};