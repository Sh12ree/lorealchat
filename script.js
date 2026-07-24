/* ===============================
   DOM Elements
=============================== */

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const typing = document.getElementById("typing");

// Replace with your deployed Cloudflare Worker URL
const API_URL = "https://loreal-chatbot.shreesatyal34.workers.dev";


/* ===============================
   Conversation History
=============================== */

const messages = [

  {
    role: "system",
    content: `You are L'Oréal's Smart Product Advisor.

Only answer questions related to:

• L'Oréal skincare
• L'Oréal makeup
• L'Oréal haircare
• Beauty routines
• Ingredients
• Product recommendations

If someone asks about anything unrelated, politely reply:

"I'm here to answer questions about L'Oréal products and beauty routines only."

Keep answers friendly, professional, and concise.`
  }

];


/* ===============================
   Initial Welcome Message
=============================== */

chatWindow.innerHTML = "";

addMessage(
  "bot",
  "👋 Hello! I'm the L'Oréal Smart Product Advisor. Ask me anything about L'Oréal skincare, makeup, haircare, beauty routines, or ingredients."
);


/* ===============================
   Add Message to Chat
=============================== */

function addMessage(sender, text) {

  const wrapper = document.createElement("div");

  wrapper.className =
    sender === "user"
      ? "user-message"
      : "bot-message";

  const bubble = document.createElement("div");

  bubble.className = "bubble";

  bubble.textContent = text;

  wrapper.appendChild(bubble);

  chatWindow.appendChild(wrapper);

  chatWindow.scrollTop = chatWindow.scrollHeight;

}


/* ===============================
   Send Message
=============================== */

async function sendMessage(question) {

  addMessage("user", question);

  messages.push({

    role: "user",

    content: question

  });

  typing.classList.remove("hidden");

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        messages: messages

      })

    });

    const data = await response.json();

    typing.classList.add("hidden");

    // Works with Cloudflare Worker response
    const reply =
      data.reply ||
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    addMessage("bot", reply);

    messages.push({

      role: "assistant",

      content: reply

    });

  }

  catch (error) {

    typing.classList.add("hidden");

    addMessage(

      "bot",

      "Sorry, something went wrong. Please try again."

    );

    console.error(error);

  }

}


/* ===============================
   Form Submit
=============================== */

chatForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const question = userInput.value.trim();

  if (question === "") return;

  userInput.value = "";

  sendMessage(question);

});


/* ===============================
   Enter Key Support
=============================== */

userInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {

    event.preventDefault();

    chatForm.requestSubmit();

  }

});