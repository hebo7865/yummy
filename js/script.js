const mealsData = document.getElementById('mealsData')

function closeSideNav(){
    let navWidth = $('.links').outerWidth();

    $('.side-nav').animate({left: -navWidth}, 500);
    $('.links li').animate({top: 300}, 500);

    $('.open-close-icon').addClass('fa-align-justify');
    $('.open-close-icon').removeClass('fa-x');
}

function openNav(){
    $('.side-nav').animate({left: 0}, 500);

    $('.open-close-icon').removeClass('fa-align-justify');
    $('.open-close-icon').addClass('fa-x');

    $('.links li').animate({top: 0}, 500);
}

$('.open-close-icon').on('click',function(){
    if($('.side-nav').css("left") == "0px"){
        closeSideNav();
    }else{
        openNav();
    }
})

$(document).ready(function(){
    $('.loading').addClass("d-none");
    closeSideNav();
    getMeals();
    $('#mealsData').children().click(function(e){
        console.log(e);
    })
})



async function getMeals(arr = ""){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${arr}`)
    response = await response.json();

    displayMeals(response.meals);
}



function displayMeals(meal){
    let temp = "";

    for(let i = 0; i < meal.length; i++){
        temp += `
        <div class="col-md-3">
            <div onclick='getMealDetails(${meal[i].idMeal})' class="meal position-relative overflow-hidden rounded-2">
                <img src="${meal[i].strMealThumb}" class="meal-img w-100" alt="">
                <div class="meal-title layer d-flex align-items-center p-2">
                    <h3>${meal[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `
    }
    
    mealsData.innerHTML = temp
}

mealsData.addEventListener('click',function(e){
    if(e.target.classList.contains('meal')){
        console.log(e.target);
    }
})


$(document).click(function(e) {
    if(e.target.innerHTML == 'Search'){
        $('#search .row').removeClass('d-none')
        closeSideNav();
        mealsData.innerHTML = '';
    }

    if(e.target.innerHTML == 'Categories'){
        $('#search .row').addClass('d-none');
        closeSideNav();
        getCategories();
    }

    if(e.target.innerHTML == 'Area'){
        $('#search .row').addClass('d-none');
        closeSideNav()
        getArea()
    }

    if(e.target.innerHTML == 'Ingredients'){
        $('#search .row').addClass('d-none');
        closeSideNav()
        getIngredients()
    }
})

$('#searchByName').keyup(function(){
    getMeals(this.value);
})

$('#searchByChar').keyup(function(){
    getMealsByFirstChar(this.value)
})

async function getMealDetails(mealId){
    mealsData.innerHTML = ''

    $('.inner-loading').fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    response = await response.json();

    showDetails(response.meals[0])
    $('.inner-loading').fadeOut(300);
}

function showDetails(meal){

    let ingredients = ''

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tag = [];

    if(meal.strTags){
        tag = meal.strTags.split(',');
    }


    let tags = ''
    for(let i = 0; i < tag.length; i++){
        tags += `
        <li class="alert alert-danger m-2 p-1">${tag[i]}</li>
        `
    }

    let temp = `
    <div class="col-md-4 text-white">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}"
            alt="">
            <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
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
            ${tags}
        </ul>

        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `

    mealsData.innerHTML = temp
}

async function getMealsByFirstChar(char){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
        response = await response.json();

        displayMeals(response.meals)
}

async function getCategories(){

    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    response = await response.json();

    displayMealsCategory(response.categories)
}

async function getCategoryMeals(category){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    displayMeals(response.meals)
}

function displayMealsCategory(meal){
    let temp = ""

    for(let i = 0; i < meal.length; i++){
        temp += `
        <div class="col-md-3">
            <div class="category position-relative overflow-hidden rounded-2">
                <img src="${meal[i].strCategoryThumb}" class="w-100" alt="">
                <div onclick='getCategoryMeals("${meal[i].strCategory}")' class="category-title layer text-center p-2">
                    <h3>${meal[i].strCategory}</h3>
                    <p>${meal[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        </div>
        `
    }

    mealsData.innerHTML = temp
}


async function getArea(){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json();

    displayArea(response.meals)
}

function displayArea(area){
    let temp = ''

    for (let i = 0; i < area.length; i++) {
        temp += `
        <div class="col-md-3">
                <div onclick='getAreaMeals("${area[i].strArea}")' class="area rounded-2 text-center text-white">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `
    }

    mealsData.innerHTML = temp;
}

