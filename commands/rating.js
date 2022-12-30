const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
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

         if(data.result === "Error")
         {
            const embed = new EmbedBuilder()
            .setDescription(`Name returned an error, double check the spelling (case doesn't matter but spelling does)`).setColor("#FF0000");
    
             return await interaction.reply({embeds: [embed]});
         }

         for(let i = 0; i < Math.min(5, data.result.comments.length); i ++)
         {
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

        const embed = new EmbedBuilder()
        .setDescription(ret).setColor("#FFD700");

         await interaction.reply({embeds: [embed]});

	},
};