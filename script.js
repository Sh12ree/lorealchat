/* ===============================
   DOM Elements
=============================== */

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const typing = document.getElementById("typing");

const productGrid = document.getElementById("productGrid");
const selectedBox = document.getElementById("selectedProducts");
const searchBar = document.getElementById("search");
const generateButton = document.getElementById("generateRoutine");


// Cloudflare Worker URL
const API_URL =
"https://loreal-chatbot.shreesatyal34.workers.dev";


/* ===============================
   Product Database
=============================== */

const products = [

{
name:"L'Oréal Revitalift Moisturizer",
category:"Skincare",
description:
"Anti-aging moisturizer with hyaluronic acid for hydration and smoother skin."
},

{
name:"L'Oréal True Match Foundation",
category:"Makeup",
description:
"Lightweight foundation with natural coverage and multiple shades."
},

{
name:"L'Oréal Voluminous Mascara",
category:"Makeup",
description:
"Adds volume and definition for fuller looking lashes."
},

{
name:"L'Oréal Infallible Lip Gloss",
category:"Makeup",
description:
"Glossy lip color with comfortable shine and hydration."
},

{
name:"L'Oréal Elvive Shampoo",
category:"Haircare",
description:
"Strengthening shampoo designed for damaged hair."
},

{
name:"L'Oréal Hair Repair Mask",
category:"Haircare",
description:
"Deep conditioning mask that restores dry and damaged hair."
}

];



/* ===============================
   Selected Products Storage
=============================== */


let selectedProducts =
JSON.parse(
localStorage.getItem("selectedProducts")
)
|| [];



/* ===============================
   AI Conversation
=============================== */


const messages = [

{
role:"system",

content:

`You are L'Oréal Smart Product Advisor.

Only answer questions about:

- L'Oréal skincare
- L'Oréal makeup
- L'Oréal haircare
- Beauty routines
- Ingredients
- Product recommendations

When users select products, create a personalized routine using those products.

Be friendly, professional, and concise.`
}

];



/* ===============================
   Chat Welcome
=============================== */


chatWindow.innerHTML="";


addMessage(
"bot",
"👋 Hello! I'm the L'Oréal Smart Product Advisor. Ask me about skincare, makeup, haircare, or beauty routines."
);



/* ===============================
   Add Chat Message
=============================== */


function addMessage(sender,text){


const wrapper =
document.createElement("div");


wrapper.className =
sender==="user"
?
"user-message"
:
"bot-message";



const bubble =
document.createElement("div");


bubble.className="bubble";


bubble.textContent=text;


wrapper.appendChild(bubble);


chatWindow.appendChild(wrapper);


chatWindow.scrollTop =
chatWindow.scrollHeight;


}



/* ===============================
   Display Products
=============================== */


function displayProducts(list=products){


productGrid.innerHTML="";



list.forEach(product=>{


const card =
document.createElement("div");


card.className="product-card";



if(selectedProducts.includes(product.name)){

card.classList.add("selected");

}



card.innerHTML=

`

<h3>${product.name}</h3>

<p><b>${product.category}</b></p>

<p>${product.description}</p>

`;




card.onclick=()=>{


if(selectedProducts.includes(product.name)){


selectedProducts =
selectedProducts.filter(
item=>item!==product.name
);


}

else{


selectedProducts.push(product.name);


}



localStorage.setItem(

"selectedProducts",

JSON.stringify(selectedProducts)

);



displayProducts();


showSelected();


};



productGrid.appendChild(card);


});


}



/* ===============================
   Selected Product Display
=============================== */


function showSelected(){


if(selectedProducts.length===0){


selectedBox.innerHTML =
"No products selected";


return;

}



selectedBox.innerHTML =

selectedProducts
.map(product=>`✓ ${product}`)
.join("<br>");

}




displayProducts();

showSelected();




/* ===============================
   Search Filter
=============================== */


searchBar.addEventListener(
"input",
()=>{


const keyword =
searchBar.value.toLowerCase();



const filtered =
products.filter(product=>


product.name
.toLowerCase()
.includes(keyword)


||

product.category
.toLowerCase()
.includes(keyword)


);



displayProducts(filtered);



}

);





/* ===============================
   Send Message To OpenAI
=============================== */


async function sendMessage(question){



addMessage(
"user",
question
);



messages.push({

role:"user",

content:question

});



typing.classList.remove("hidden");



try{


const response =
await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

messages:messages

})


});




const data =
await response.json();



typing.classList.add("hidden");



const reply =

data.choices?.[0]
?.message
?.content

||

data.error

||

"Sorry, I couldn't generate a response.";





addMessage(
"bot",
reply
);



messages.push({

role:"assistant",

content:reply

});



}

catch(error){


typing.classList.add("hidden");


addMessage(

"bot",

"Sorry, something went wrong."

);


console.error(error);


}



}



/* ===============================
   Chat Form
=============================== */


chatForm.addEventListener(
"submit",
(e)=>{


e.preventDefault();



const question =
userInput.value.trim();



if(!question)
return;



userInput.value="";



sendMessage(question);



}

);




/* ===============================
   Enter Key
=============================== */


userInput.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){


e.preventDefault();


chatForm.requestSubmit();


}


}

);





/* ===============================
   Generate Routine Button
=============================== */


generateButton.addEventListener(
"click",
()=>{


if(selectedProducts.length===0){


addMessage(

"bot",

"Please select products before generating a routine."

);


return;

}




const prompt =


`
Create a personalized L'Oréal beauty routine.

Selected products:

${selectedProducts.join(", ")}


Explain:

1. Order of use
2. When to use each product
3. Benefits of each product
4. Beauty tips
`;



sendMessage(prompt);



}

);