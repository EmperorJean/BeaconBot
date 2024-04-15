const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { generateContent } = require('../tools/gemini');

const BOT_CHANNEL = process.env.BOT_CHANNEL
const BOT_CHANNEL2 = process.env.BOT_CHANNEL2
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask-gemini')
        .setDescription('Ask a question to Gemini AI.This data is used by google to train it!')
        .addStringOption(option =>
            option.setName('prompt')
                .setRequired(true)
                .setDescription('The prompt to ask Gemini AI')),
    async execute(interaction) {
        try {
            const prompt = interaction.options.getString('prompt');
            const isEphemeral = interaction.channelId !== BOT_CHANNEL && interaction.channelId !== BOT_CHANNEL2;
            
            // Let user know that the bot is processing the request
            await interaction.reply({ content: 'Processing your request...', ephemeral: isEphemeral });

            // Get the response from Gemini AI
            const title = await generateContent(`Create a short title, no more than 7 words of a heading for the prompt: ${prompt}`);
            const responseText = await generateContent(prompt);

            // Create an embed with the response
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(responseText)
                .setColor('#69f2ff')
                .setFooter({text: 'Disclaimer: Google collects interaction data and uses it to train the model!'});

            await interaction.editReply({ content: null, embeds: [embed], ephemeral: isEphemeral });
        } catch (error) {
            await interaction.editReply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};
