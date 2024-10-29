async function fetchContent() {
    const response = await fetch('content.json');
    const data = await response.json();
    displayContent(data);
}

function createValueDiv(value) {
    const valueDiv = document.createElement('div');
    valueDiv.textContent = value;
    valueDiv.classList.add("value-div");
    return valueDiv;
}

function createTagDiv(tag) {
    const tagDiv = document.createElement('div');
    tagDiv.textContent = tag;
    tagDiv.classList.add("tag-div");
    return tagDiv;
}

function createContainerDiv(...children) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add("container-div");
    children.forEach(child => containerDiv.appendChild(child));
    return containerDiv;
}

function displayContent(content) {
    const mainElement = document.getElementById('content-display');
    content.forEach(item => {
        const containerDiv = createContainerDiv(createValueDiv(item.value), createTagDiv(item.tag));
        mainElement.appendChild(containerDiv);
    });
}

async function handleSearchInput() {
    const inputText = document.getElementById('search-input').value;
    const response = await fetch('content.json');
    const data = await response.json();
    const options = {
        keys: ['value'],
        threshold: 0.2
    };

    const fuse = new Fuse(data, options);

    const result = fuse.search(inputText);
    console.log(result);
}
