console.log("JS Loaded!");
const wordsByLevel = {
    beginner: ["happy", "bright", "simple", "calm", "kind", "basic", "quick"],
    intermediate: ["serendipity", "eloquent", "resilient", "tranquil", "vibrant", "meticulous"],
    expert: ["obfuscate", "quintessential", "ephemeral", "anachronistic", "idiosyncratic", "magnanimous"]
};


/* ----------------------------------------------------------
   1) DICTIONARY SEARCH (Recent Searches Page)
----------------------------------------------------------- */

async function searchWord() {
    const word = document.getElementById("search-word")?.value.trim();
    const list = document.getElementById("recent-list");

    if (!word) {
        alert("Please enter a word!");
        return;
    }

    if (!list) return; // If searching from Home page "Surprise Me" button

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            alert(`No definition found for "${word}"`);
            return;
        }

        const meaning = data[0].meanings[0].definitions[0].definition;

        // Add searched word to list
        const li = document.createElement("li");
        li.className = "recent-item";
        li.innerHTML = `
            <span class="word">${word}</span>
            <span>${meaning.substring(0, 40)}...</span>
        `;
        list.prepend(li);

    } catch (err) {
        console.error(err);
        alert("Something went wrong. Check internet connection.");
    }
}



/* ----------------------------------------------------------
   2) WORD OF THE DAY (word-of-day.html)
----------------------------------------------------------- */


async function getWordOfTheDay() {
    const level = document.getElementById("difficulty")?.value || "intermediate";  
    const wordEl = document.getElementById("wod-word");
    const posEl = document.getElementById("wod-pos");
    const phoneticEl = document.getElementById("wod-phonetic");
    const meaningEl = document.getElementById("wod-meaning");
    const exampleEl = document.getElementById("wod-example");

    try {
        const list = wordsByLevel[level];
        const word = list[Math.floor(Math.random() * list.length)];

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const res = await fetch(url);
        const data = await res.json();

        const entry = data[0];

        wordEl.textContent = entry.word;
        posEl.textContent = entry.meanings[0].partOfSpeech || "";
        phoneticEl.textContent = entry.phonetic || "";
        meaningEl.textContent = entry.meanings[0].definitions[0].definition || "Meaning unavailable.";
        exampleEl.textContent = entry.meanings[0].definitions[0].example || "No example available.";

        window.wordAudio = entry.phonetics[0]?.audio || "";

    } catch (err) {
        console.error(err);
        meaningEl.textContent = "Error loading word.";
    }
}


function playWordAudio() {
    if (!window.wordAudio) {
        alert("Audio not available.");
        return;
    }
    new Audio(window.wordAudio).play();
}



/* ----------------------------------------------------------
   3) PARAGRAPH GENERATOR (paragraph.html)
----------------------------------------------------------- */

function generateParagraph() {
    const keywords = document.getElementById("keywords")?.value.trim();
    const output = document.getElementById("paragraph-output");
    const level = document.getElementById("difficulty")?.value || "intermediate";

    if (!keywords) {
        alert("Please enter some keywords!");
        return;
    }

    output.textContent = "Generating paragraph...";

    setTimeout(() => {
        const words = keywords.split(" ");
        const w1 = words[0] || "life";
        const w2 = words[1] || "growth";
        const w3 = words[2] || "purpose";

        let paragraph = "";

        /* ⭐ BEGINNER — simple, easy sentences */
        if (level === "beginner") {
            paragraph =
                `The topic of ${w1} is connected to ${w2}, and it helps us understand ${w3} better. ` +
                `These ideas are simple but important in our daily life.`;
        }

        /* ⭐ INTERMEDIATE — normal vocabulary */
        else if (level === "intermediate") {
            paragraph =
                `The idea of ${w1} is often linked to ${w2}, shaping how we understand ${w3} in our lives. ` +
                `Together, these concepts help us build a clear perspective.`;
        }

        /* ⭐ EXPERT — advanced vocabulary */
        else if (level === "expert") {
            paragraph =
                `The concept of ${w1} intricately intertwines with ${w2}, profoundly influencing the broader interpretation of ${w3}. ` +
                `Such interconnected themes contribute to a more sophisticated and comprehensive understanding of the subject.`;
        }

        output.textContent = paragraph;

    }, 500);
}



function copyParagraph() {
    const text = document.getElementById("paragraph-output")?.innerText;
    navigator.clipboard.writeText(text);
    alert("Paragraph copied!");
}



/* ----------------------------------------------------------
   4) Play Audio for Dictionary Search
----------------------------------------------------------- */
function playAudio(audioUrl) {
    if (!audioUrl) {
        alert("Pronunciation not available for this word.");
        return;
    }

    new Audio(audioUrl).play().catch(() => alert("Unable to play audio"));
}
// -------------------- DAILY STREAK FEATURE --------------------

function updateStreak() {
    const streakBox = document.getElementById("streak-box");
    if (!streakBox) return;

    const today = new Date().toDateString();

    let lastVisit = localStorage.getItem("lastVisit");
    let streak = parseInt(localStorage.getItem("streak")) || 0;

    if (!lastVisit) {
        // First time user opens
        streak = 1;
    } 
    else {
        const last = new Date(lastVisit).toDateString();

        if (last === today) {
            // Already visited today → do nothing
        } 
        else {
            // Calculate difference in days
            const diff = (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24);

            if (diff === 1) {
                // Visited yesterday → streak++
                streak++;
            } else {
                // Missed a day → reset streak
                streak = 1;
            }
        }
    }

    // Save back to localStorage
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastVisit", today);

    // Update UI
    streakBox.textContent = `🔥 ${streak}-Day Streak`;
}

// Run streak update when page loads
document.addEventListener("DOMContentLoaded", updateStreak);

