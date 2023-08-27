class DictionaryApp {
  constructor() {
    this.searchInputElement = document.querySelector(".search-input");
    this.audioElement = document.querySelector("#word-audio");
    this.mainElement = document.querySelector("main");
    this.wordsSection = document.querySelector(".words-section");

    this.init();
  }

  async fetchMeaning(term) {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`
      );

      if (!response.ok) {
        throw new Error("No meaning found");
      }

      return response.json();
    } catch (ex) {
      this.reset();
    }
  }

  getInputValue() {
    return this.searchInputElement.value;
  }

  display(response) {
    const wordData = response && response[0];

    if (!wordData) {
      alert("No meaning found");
      return;
    }

    this.displayWordArea(wordData);
    this.displayMeaning(wordData.meanings);
    this.createSourceSection(wordData.sourceUrls);

    this.wordsSection.style.display = "flex";
  }

  reset() {
    this.clearMeaningSection();
  }

  clearMeaningSection() {
    while (this.mainElement.children.length > 2) {
      this.mainElement.removeChild(this.mainElement.lastChild);
    }

    this.wordsSection.style.display = "none";
  }

  addAudioPlayEvent() {
    this.wordsSection.addEventListener("click", event => {
      if (event.target.classList.contains("play-icon")) {
        const audioElement = event.target.parentNode.querySelector("audio");
        if (audioElement) {
          audioElement.play();
        }
      }
    });
  }

  displayWordArea(wordData) {
    this.wordsSection.innerHTML = "";
  
    this.createWordArea(wordData);
    this.createPlayIcon(wordData.phonetics.find(e => e.audio));
  }
  
  createWordArea(wordData) {
    const wordArea = document.createElement("div");
    wordArea.classList.add("words-area");
    wordArea.innerHTML = `
      <p class="word">${wordData.word || ""}</p>
      <p class="phonetic">${wordData.phonetic || ""}</p>
    `;
    this.wordsSection.appendChild(wordArea);
  }
  
  createPlayIcon(audioSource) {
    if (!audioSource || !audioSource.audio) {
      return;
    }
  
    const playIconDiv = document.createElement("div");
    playIconDiv.innerHTML = `
      <img class="play-icon" src="assets/images/play.png" alt="play icon">
      <audio id="word-audio" src="${audioSource.audio}"></audio>
    `;
    this.wordsSection.appendChild(playIconDiv);
  }
  

  createSection(className, content) {
    const sectionElement = document.createElement("section");
    sectionElement.className = className;
    sectionElement.innerHTML = content;
    this.mainElement.appendChild(sectionElement);
  }

  createSynonymsSection(synonyms) {
    if (synonyms && synonyms.length > 0) {
      const synonymsContent = `
        <div class="synonyms-area">
          <p>Synonyms:</p>
          <p>${synonyms.join(", ")}</p>
        </div>
      `;
      this.createSection("synonyms-section", synonymsContent);
    }
  }

  createSourceSection(sourceUrls) {
    if (sourceUrls && sourceUrls.length > 0) {
      const sourceContent = `
        <hr>
        <div class="source-area">
          <p>Source:</p>
          <a href="${sourceUrls[0]}" target=_blank>${sourceUrls[0]}</a>
        </div>
      `;
      this.createSection("source-section", sourceContent);
    }
  }

  displayMeaning(meanings) {
    meanings.forEach(meaning => {
      this.createSection(
        "partOfSpeech",
        `<p>${meaning.partOfSpeech}</p><div class="hr-line"></div>`
      );
      this.createSection(
        "meaning-area",
        `<p>Meaning:</p><ul class="meaning-list">${meaning.definitions
          .map(def => `<li>${def.definition}</li>`)
          .join("")}</ul>`
      );
      this.createSynonymsSection(meaning.synonyms);
    });
  }

  async triggerFetchData() {
    this.reset();
    const term = this.getInputValue();
    if (term) {
      const response = await this.fetchMeaning(term);
      this.display(response);
    }
  }

  async addEventOnSubmit() {
    const searchElement = document.querySelector(".search-icon");

    this.searchInputElement.addEventListener("keyup", e => {
      if (e.key === "Enter") {
        this.triggerFetchData();
      }
    });

    searchElement.addEventListener("click", () => {
      this.triggerFetchData();
    });
  }

  init() {
    this.reset();
    this.addEventOnSubmit();
    this.addAudioPlayEvent();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DictionaryApp();
});
