async function getApiWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  console.log(response);
  return await response.json();
}

async function galleryElement() {
  const works = await getApiWorks();

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.innerText = work.title;
    const figureElement = document.createElement("figure");
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figCaptionElement);
    const galleryHtml = document.querySelector(".gallery");
    galleryHtml.appendChild(figureElement);
  }
}
galleryElement();
