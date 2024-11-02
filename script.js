async function getData() {
    const response = await fetch('content.json');
    return await response.json();
}

async function fetchContent() {
    const data = await getData();
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
    tagDiv.classList.add("tag-div");

    const tagAbbr = document.createElement('abbr');
    tagAbbr.textContent = tag;
    tagAbbr.title = tag;
    
    tagDiv.appendChild(tagAbbr);
    
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
    mainElement.innerHTML = '';

    content.forEach(item => {
        const containerDiv = createContainerDiv(createValueDiv(item.value), createTagDiv(item.tag));
        mainElement.appendChild(containerDiv);
    });
}

async function handleSearchInput() {
    const inputText = document.getElementById('search-input').value;
    const data = await getData();

    if (inputText) {
        const options = {
            keys: ['value'],
            threshold: 0.2
        };
        const fuse = new Fuse(data, options);
        const result = fuse.search(inputText);
        
        const fuzzyMatchedData = result.map(res => {
            const item = data.find(item => item[options.keys[0]] === res.item[options.keys[0]]);
            return { ...item };
        });

        displayContent(fuzzyMatchedData);
    } else {
        displayContent(data);
    }
}
