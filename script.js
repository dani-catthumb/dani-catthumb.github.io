async function getData() {
    const response = await fetch('content.json');
    return await response.json();
}

async function getHovertipJSON() {
    const response = await fetch('hovertip.json');
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

function getHovertipText(tag, hovertipJSON) {
    const matchedObject = hovertipJSON.find(obj => obj.class === tag);

    if (matchedObject) {
        return matchedObject.hovertip;
    }
    else {
        return tag;
    }
}

function createTagAbbr(tag, hovertipJSON) {

    const tagAbbr = document.createElement('abbr');
    tagAbbr.textContent = tag;
    const hovertipText = getHovertipText(tag, hovertipJSON);
    tagAbbr.dataset.tooltip = hovertipText;

    return tagAbbr;
}


function createTagDiv(tag, hovertipJSON) {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add("tag-div", tag);

    const tagAbbr = createTagAbbr(tag, hovertipJSON);

    tagDiv.appendChild(tagAbbr);

    return tagDiv;
}

function createContainerDiv(...children) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add("container-div");
    children.forEach(child => containerDiv.appendChild(child));
    return containerDiv;
}

async function displayContent(content) {
    const mainElement = document.getElementById('content-display');
    mainElement.innerHTML = '';
    const hovertipJSON = await getHovertipJSON()

    content.forEach(item => {
        const containerDiv = createContainerDiv(
            createValueDiv(item.value),
            createTagDiv(item.tag, hovertipJSON)
        );
        mainElement.appendChild(containerDiv);
    });
}

function getFifthClassArray(data) {
    return data.filter(item => item.tag === 'fifth-class');
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
            const items = data.find(
                item => (item.value === res.item.value)
            );
            return { ...items };
        });

        const fifthClassData = getFifthClassArray(data);
        // adding all fifth-class data to fuzzy matched data
        combinedData = [...fuzzyMatchedData, ...fifthClassData];
        // removing any duplicates
        const uniqueCombinedData = Array.from(new Set(combinedData.map(JSON.stringify))).map(JSON.parse);
        
        displayContent(uniqueCombinedData);
    } else {
        displayContent(data);
    }
}
