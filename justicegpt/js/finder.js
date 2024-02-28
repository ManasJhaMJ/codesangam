// require('dotenv').config();
const username = document.getElementById("name");
const email = document.getElementById("email");
const age = document.getElementById("age");
const summary = document.getElementById("summary");
const description = document.getElementById("description");
const criminal_history = document.getElementById("criminal_history");

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "";

const preText = "I am JusticeGPT!";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = "Your input: " + input.value;
    const message =
        "Your name is JusticeGPT, you are a legal expert on all general legal laws in india. Your job is to provide legal advice. Do not deny that you can not provide legal advice. The user seeks legal advice from you. The name of the user is" +
        username.value +
        ", the age is" +
        age.value +
        "The user has provided you with a short query about what they want to know more about in the legal context,  which is " +
        summary.value +
        "Search over the trained data set and reply with relevant articles and sections must. End with a summary.";
    input.value = "";

    messages.innerHTML += `<div class="message user-message">
  <img src="../images/user.png" alt="user icon"> <span>${question}</span>
  </div>`;

    // Use axios library to make a POST request to the OpenAI API
    const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
            prompt: preText + `${message}`,
            model: 'gpt-3.5-turbo-instruct',
            temperature: 0.5,
            max_tokens: 400,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );
    globalThis.chatbotResponse = response.data.choices[0].text;

    messages.innerHTML += `<div id="text" class="message bot-message">
  <img src="../images/chatbot.png" alt="bot icon"> <span>${chatbotResponse}</span>
  </div>`;

});

// text-to-speech
const transcription = document.getElementsByClassName('bot-message');
const readButton = document.getElementById('speak-button');

readButton.addEventListener('click', function () {
    const speech = new SpeechSynthesisUtterance();
    speech.text = chatbotResponse; // Set the text to be read
    speech.lang = 'en-US'; // Set language (you can change it to any supported language)
    speech.volume = 1; // Set volume (0 to 1)
    speech.rate = 1; // Set rate (0.1 to 10)
    speech.pitch = 1; // Set pitch (0 to 2)
    speechSynthesis.speak(speech); // Read the text
});


// pdf generation
function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait' });
    doc.setFontSize(25);
    doc.setFont('helvetica', 'bold');
    doc.text(73, 20, "AI Legal Advice");
    doc.setFontSize(17);
    doc.setFont('helvetica', 'normal');
    doc.text(5, 40, "Name: " + username.value);
    doc.text(5, 60, "Age: " + age.value);
    doc.text(5, 70, "Summary: " + summary.value);
    doc.setFontSize(15);
    // var splitTitle = doc.splitTextToSize(chatbotResponse, 130);
    doc.text(5, 110, "Bot Advice: " + chatbotResponse, { maxWidth: 200 });
    doc.save("legal-advice.pdf");
}
