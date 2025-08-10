// @todo: напишите здесь код парсера
function getMetaData(attr, attrContent) {
    const meta = document.querySelector(`meta[${attr}='${attrContent}']`);
    return meta.content;
}

function getCurrency(currencySign) {
    switch (currencySign) {
        case "₽":
            return "RUB";
        case "$":
            return "USD";
        case "€":
            return "EUR";
    }
}

function getPriceData (typeData) {
    const productPrice=document.querySelector(".price").textContent.trim().split("\n                ");
    const price = Number(productPrice[0].substring(1));
    const oldPrice = Number(productPrice[1].substring(1));
    const discount = oldPrice-price;
    let discountPercent;
    if (discount === 0) {
        discountPercent = "0%";
    } else {
        discountPercent = ((discount/oldPrice)*100).toFixed(2)+"%";
    }

    switch (typeData) {
        case 1:
            return price;
        case 2:
            return oldPrice;
        case 3:
            return discount; 
        case 4:
            return discountPercent;
        case 5:
            return getCurrency(productPrice[0].substring(0,1));
    }
}

function getProperties() {
    const properties = document.querySelectorAll(".properties li");
    const propertiesObj = {};
    properties.forEach(property => {
        const rows = property.querySelectorAll("span");
        propertiesObj[`${rows[0].textContent}`] = rows[1].textContent;
    });
    return propertiesObj;
}

function getProductDescription() {
    const description = document.querySelector(".description").innerHTML.trim();
    let descriptionRows = description.split("\n                ");
    descriptionRows[0]=descriptionRows[0].slice(0,3)+descriptionRows[0].slice(18);
    return descriptionRows.join("\n                ");
}

function getImagesData() {
    const images = document.querySelectorAll(".preview nav button");
    let imagesData = [];
    images.forEach(image => {
        imagesData.push({
            "preview": image.children[0].src,
            "full": image.children[0].dataset.src,
            "alt": image.children[0].alt
        });
    });
    return imagesData;
}

function getSuggested() {
    const suggested = document.querySelectorAll(".suggested .items article");
    let suggestedArr = [];
    suggested.forEach(suggest => {
        const object = {
            "name": suggest.querySelector("h3").textContent,
            "description": suggest.querySelector("p").textContent,
            "image": suggest.querySelector("img").src,
            "price": suggest.querySelector("b").textContent.substring(1),
            "currency": getCurrency(suggest.querySelector("b").textContent.substring(0,1))
        };
        suggestedArr.push(object);
    });
    return suggestedArr;
}

function getRating(review) {
    const rating = review.querySelectorAll(".rating span");
    let counter=0;
    rating.forEach(rate => {
        if(rate.classList.contains("filled")) {
            counter++;
        }
    });
    return counter;
}

function getAuthorReview(review) {
    const author = review.querySelector(".author");
    return {
        "avatar": author.querySelector("img").src,
        "name": author.querySelector("span").textContent
    }
}

function getReviews() {
    const reviews = document.querySelectorAll(".reviews .items article");
    const reviewsArr = [];
    reviews.forEach(review => {
        reviewsArr.push({
            "rating": getRating(review),
            "author": getAuthorReview(review),
            "title": review.querySelector("div:nth-child(2) .title").textContent,
            "description": review.querySelector("div:nth-child(2) p").textContent,
            "date": review.querySelector(".author i").textContent.split("/").join(".")
        });
    });
    return reviewsArr;
}

function parsePage() {
    return {
        meta: {
            "title": document.querySelector("title").textContent.substring(0,10),
            "description": getMetaData("name","description"),
            "keywords": getMetaData("name","keywords").split(", "),
            "language": document.querySelector("html").lang,
            "opengraph": {
                "title": getMetaData("property","og:title").substring(0,10),
                "image": getMetaData("property","og:image"),
                "type": getMetaData("property","og:type")
            }
        },
        product: {
            "id": document.querySelector(".product").dataset.id,
            "name": document.querySelector(".about .title").textContent,
            "isLiked": document.querySelector(".like").classList.contains("active"),
            "tags": {
                "category": [document.querySelector(".green").textContent],
                "discount": [document.querySelector(".red").textContent],
                "label": [document.querySelector(".blue").textContent]
            },
            "price": getPriceData(1),
            "oldPrice": getPriceData(2),
            "discount": getPriceData(3),
            "discountPercent": getPriceData(4),
            "currency": getPriceData(5),
            "properties": getProperties(),
            "description": getProductDescription(),
            "images": getImagesData()
        },
        suggested: getSuggested(),
        reviews: getReviews()
    };
}

window.parsePage = parsePage;