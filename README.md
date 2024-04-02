# Beacon Bot

This Discord bot is designed for the UMass Boston CS server. It features two main functionalities:

1. **Rating:** Allows users to query RateMyProfessor ratings directly within Discord using the `/rating` command.
2. **Ask Gemini:** Provides a way to use Google's Gemini LLM within the discord server through the `/ask-gemini` command.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/EmperorJean/BeaconBot.git
   ```
2. Navigate to the project directory:
   ```
   cd BeaconBot
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your configuration using`.env.template` as a guide
5. Run the bot:
   ```
   node index.js
   ```

## Usage

- **Rating Command:** Use the `/rating` command followed by the professor's name to get their rating. For example:
  ```
  /rating John Doe
  ```
- **Ask Gemini Command:** Use the `/ask-gemini` command followed by your query to interact with Gemini LLM. For example:
  ```
  /ask-gemini What is the difference between an NFA and a DFA?
  ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

[MIT License](LICENSE)

---

Make sure to replace placeholders like `your_discord_bot_client_id`, `your_discord_server_id`, `your_discord_bot_token`, `page_to_fetch_data_from`, and `your_gemini_llm_api_key` with your actual configuration values.