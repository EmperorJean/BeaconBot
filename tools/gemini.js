const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to generate content using Gemini
async function generateContent(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (e) {
        console.log('gemini crashed: ' + e)
    }
}

module.exports = {
    generateContent
};
