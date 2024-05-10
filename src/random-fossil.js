import axios from "axios";

////////////////////////////////////////////////
//  Selectors
////////////////////////////////////////////////
const getRandomFossilBtn = document.querySelector("#get-random-fossil");

const randomFossilImageDiv = document.querySelector("#random-fossil-image");

const randomFossilNamePar = document.querySelector("#random-fossil-name");

////////////////////////////////////////////////
//  Event Handlers
////////////////////////////////////////////////
getRandomFossilBtn.addEventListener("click", async () => {
  const response = await axios.post("/random-fossil.json", {
    currentFossilName: randomFossilNamePar.innerText,
  });
  const imageHtml = `<img src="${response.data.img}" alt="Image of ${response.data.name} fossil">`;
  randomFossilImageDiv.innerHTML = imageHtml;
  randomFossilNamePar.innerText = response.data.name;
});
