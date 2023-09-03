// Global
let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

// home
$(document).ready(() => {
    searchByName("").then(() => {
        $("#loadingScreen").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})
// 

// side nav events
function closeSideNav() {
    $('#sideNav').animate({ left: '-256.562px' }, 500)
    $('#navLinks .links ul li').animate({ top: '300px' }, 500)
    $('.open-close-icon').addClass('fa-align-justify')
    $('.open-close-icon').removeClass('fa-x')
}

closeSideNav()

function openSideNav() {
    $('#sideNav').animate({ left: '0' }, 500)
    for (let i = 0; i < 5; i++) {
        $('#navLinks .links ul li').eq(i).animate({ top: '0' }, (i + 5) * 100)
    }
    $('.open-close-icon').addClass('fa-x')
    $('.open-close-icon').removeClass('fa-align-justify')
}

$('.open-close-icon').click(function () {
    if ($('#sideNav').css('left') == '0px') {
        closeSideNav()
    }
    else {
        openSideNav()
    }
})
// 

// get and display meals
async function searchByName(meal) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
    res = await res.json()

    if (res.meals) {
        displayMeals(res.meals)
    }
    else {
        displayMeals([])
    }
    $("#innerLoadingScreen").fadeOut(300)
}

async function searchByFLetter(letter) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    if (letter == "") {
        letter = "a"
    }

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    res = await res.json()

    if (res.meals) {
        displayMeals(res.meals)
    }
    else {
        displayMeals([])
    }
    $("#innerLoadingScreen").fadeOut(300)
}

function displayMeals(meal) {
    let box = "";

    for (let i = 0; i < meal.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${meal[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal[i].strMealThumb}" alt="Meal">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = box;
}
// 

// Get and Display Meal Details 
async function getMealDetails(id) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300);

    searchContainer.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    res = await res.json()

    displayMealDetails(res.meals[0]);
    $("#innerLoadingScreen").fadeOut(300)
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) {
        tags = []
    }

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let box = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="meal">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = box
}
// 

// search inputs
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""
}
// 

// get and display Categories
async function getCategories() {
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)
    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    res = await res.json()

    displayCategories(res.categories)
    $("#innerLoadingScreen").fadeOut(300)
}

function displayCategories(category) {
    let box = "";

    for (let i = 0; i < category.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category[i].strCategory}</h3>
                        <p>${category[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

async function getCategoryMeals(category) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    res = await res.json()


    displayMeals(res.meals.slice(0, 20))
    $("#innerLoadingScreen").fadeOut(300)

}
// 

// get and display Area
async function getArea() {
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    res = await res.json()

    displayArea(res.meals)
    $("#innerLoadingScreen").fadeOut(300)

}

function displayArea(area) {
    let box = "";

    for (let i = 0; i < area.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

async function getAreaMeals(area) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    res = await res.json()

    displayMeals(res.meals.slice(0, 20))
    $("#innerLoadingScreen").fadeOut(300)

}
// 

// get and display Ingredients
async function getIngredients() {
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    res = await res.json()

    displayIngredients(res.meals.slice(0, 20))
    $("#innerLoadingScreen").fadeOut(300)

}

function displayIngredients(ingredient) {
    let box = "";

    for (let i = 0; i < ingredient.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingredient[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredient[i].strIngredient}</h3>
                        <p>${ingredient[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

async function getIngredientsMeals(ingredient) {
    closeSideNav()
    rowData.innerHTML = ""
    $("#innerLoadingScreen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    res = await res.json()

    displayMeals(res.meals.slice(0, 20))
    $("#innerLoadingScreen").fadeOut(300)
}
// 

// form and regex
function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputFocus = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputFocus = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputFocus = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputFocus = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputFocus = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputFocus = true
    })
}

let nameInputFocus = false;
let emailInputFocus = false;
let phoneInputFocus = false;
let ageInputFocus = false;
let passwordInputFocus = false;
let repasswordInputFocus = false;

function inputsValidation() {
    if (nameInputFocus) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputFocus) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputFocus) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputFocus) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputFocus) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputFocus) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
        submitBtn.classList.replace('btn-outline-danger','btn-outline-success')
    } else {
        submitBtn.setAttribute("disabled", true)
        submitBtn.classList.replace('btn-outline-success','btn-outline-danger')
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}