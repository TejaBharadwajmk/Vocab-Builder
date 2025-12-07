console.log("JS Loaded!");
// -------------------- DICTIONARY SEARCH FUNCTION --------------------
async function searchWord() {
    const word = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("result");

    if (word === "") {
        alert("Please enter a word!");
        return;
    }

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            resultDiv.innerHTML = `<p class="error">No definition found for "${word}".</p>`;
            resultDiv.classList.add("show");
            return;
        }

        const meaning = data[0].meanings[0].definitions[0].definition;
        const example = data[0].meanings[0].definitions[0].example || "No example available.";
        const part = data[0].meanings[0].partOfSpeech;

       resultDiv.innerHTML = `
    <div class="dict-card">

        <div class="word-header">
            <h2 class="word-title">${data[0].word}</h2>
            <button class="audio-btn" onclick="playAudio('${data[0].phonetics[0]?.audio || ""}')">🔊</button>
        </div>

        <div class="pos-box">
            <span>📌 Part of Speech:</span> ${part}
        </div>

        <div class="meaning-box">
            <span>💡 Meaning:</span> 
            <p>${meaning}</p>
        </div>

        <div class="example-box">
            <span>📝 Example:</span>
            <p>"${example}"</p>
        </div>

    </div>
`;

        // ⭐ IMPORTANT — SHOW THE RESULT WITH ANIMATION
        resultDiv.classList.add("show");

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = `<p class="error">Something went wrong.</p>`;
        resultDiv.classList.add("show");
    }
}


// -------------------- PARAGRAPH GENERATOR --------------------
function generateParagraph() {
    const keywords = document.getElementById("keywords").value.trim();
    const result = document.getElementById("result");
    const wordCount = document.getElementById("wordCount");
    const loading = document.getElementById("loading");
    const resultBox = document.getElementById("result-box");

    if (keywords === "") {
        alert("Please enter some keywords!");
        return;
    }

    loading.style.display = "block";
    resultBox.style.display = "block";
resultBox.classList.add("show");

    
    setTimeout(() => {
        const words = keywords.split(" ");
        const w1 = words[0] || "life";
        const w2 = words[1] || "growth";
        const w3 = words[2] || "purpose";

        const templates = [
            `The idea of ${w1} often connects deeply with ${w2}, shaping how we understand ${w3} in our daily lives. Together, these concepts influence our thoughts and inspire us to explore new perspectives.`,
            `When we talk about ${w1}, it naturally leads us to think about ${w2}. These ideas work together and help us discover the true meaning of ${w3}, making our experiences richer.`,
            `In many situations, ${w1} and ${w2} play important roles. Their connection helps us make sense of ${w3}, reminding us of how everything in life is linked together.`
        ];

        const randomIndex = Math.floor(Math.random() * templates.length);
        const paragraph = templates[randomIndex];

        result.textContent = paragraph;
        wordCount.textContent = "Words: " + paragraph.split(" ").length;

        loading.style.display = "none";
        resultBox.classList.remove("hidden");
    }, 600); // Just for loading animation
}

// ---------------- COPY TO CLIPBOARD ----------------
function copyText() {
    const text = document.getElementById("result").innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
}
function playAudio(audioUrl) {
    if (!audioUrl) {
        alert("Pronunciation not available for this word.");
        return;
    }

    new Audio(audioUrl).play().catch(() => alert("Unable to play audio"));
}

