const selectFonts = document.getElementById("select-fonts");
const formAscii = document.getElementById("form-ascii");

function populateSelectFont(fonts) {
  fonts.forEach((font) => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;

    selectFonts.appendChild(option);
  });
}

function fetchFonts() {
  const url = "/fonts?list=False";
  console.log("Fetching fonts...");

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      populateSelectFont(data.fonts);
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchAscii(string, font) {
  const url = "/ascii?string=" + string + "&font=" + font;
  console.log("Fetching ascii...");

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const containerAscii = document.getElementById("container-ascii");
      containerAscii.innerHTML = data;
    })
    .catch((error) => {
      console.error(error);
    });
}

window.addEventListener("load", () => {
  fetchFonts();
});

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
});

formAscii.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputString = document.getElementById("input-string");
  fetchAscii(inputString.value, selectFonts.value);
});
