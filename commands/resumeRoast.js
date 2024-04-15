const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { generateContent } = require('../tools/gemini');
const pdf = require('pdf-parse');
const axios = require('axios');

const BOT_CHANNEL = process.env.BOT_CHANNEL;
const BOT_CHANNEL2 = process.env.BOT_CHANNEL2;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume-roast')
        .setDescription('Have gemini roast your resume')
        .addAttachmentOption(option =>
            option.setName('resume')
                .setRequired(true)
                .setDescription('Your resume (PDF)')),
    async execute(interaction) {
        try {
            const attachment = interaction.options.getAttachment('resume');
            const isEphemeral = interaction.channelId !== (BOT_CHANNEL || BOT_CHANNEL2);
            let prompt = "I want you to roast this resume, don't hold back and be very verbose! ";

            // Let user know that the bot is processing the request
            await interaction.reply({ content: 'Cooking up your roast 😈 ...', ephemeral: isEphemeral });

            await downloadAndExtractTextFromPDF(attachment.url)
                .then(text => {
                    if (text) {
                        prompt += text;
                    } else {
                        return interaction.editReply({ content: 'Could not get the contents of your resume, please make sure you are uploading a pdf file', ephemeral: isEphemeral });
                    }
                });

            const responseText = await generateContent(prompt);
            // Create an embed with the response
            const embed = new EmbedBuilder()
                .setDescription(responseText)
                .setColor('#69f2ff')
                .setFooter({ text: 'Disclaimer: Google collects interaction data and uses it to train the model!' });

            await interaction.editReply({ content: null, embeds: [embed], ephemeral: isEphemeral });
        } catch (error) {
            await interaction.editReply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};

async function downloadAndExtractTextFromPDF(pdfUrl) {
    try {
        // Fetch the PDF file as a stream
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const dataBuffer = Buffer.from(response.data);

        // Parse the PDF
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error("Error fetching or parsing PDF:", error);
        return null;
    }
}