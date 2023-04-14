const wrapper = document.querySelector(".wrapper"),
arrowBack = wrapper.querySelector("header i"),
inputentry = document.querySelector(".inputentry"),
Infotext = inputentry.querySelector(".infotext"),
inputField = inputentry.querySelector("input"),
locbutton = inputentry.querySelector("button"),
weatherPart = wrapper.querySelector(".weatherpart"),
weathericon = weatherPart.querySelector("img");

let api;

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locbutton.addEventListener("click",() => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess , onError);
    }
    else{
        alert("Your browser does not support geolocation");
    }
});

function onSuccess(position){
    const{latitude,longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=df3a7fe15a289ba9d8d899675d457a1a`;
    fetchData();
}

function onError(error)
{
    Infotext.innerText = error.message;
    Infotext.classList.add("error");
}

function requestApi(city)
{
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=df3a7fe15a289ba9d8d899675d457a1a`;
    fetchData();
}

function fetchData()
{
    Infotext.innertext = "Obtaining weather details....";
    Infotext.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
           Infotext.innerText = "Something went wrong...";
           Infotext.classList.replace("pending","error");
    });
}

arrowBack.addEventListener("click",()=>{
    wrapper.classList.remove("active");
});

function weatherDetails(info){
    if(info.cod == "404")
    {
        Infotext.classList.replace("pending","error");
        Infotext.innerText = `${inputField.value} isn't a valid city name`;
    }
    else
    {
        const city = info.name;
        const country = info.sys.country;
        const {description,id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        const {speed} = info.wind;

        if(id == 800){
            weathericon.src = "iconspng/sun.png";
        }else if(id >= 200 && id <= 232){
            weathericon.src = "iconspng/storm.png";  
        }else if(id >= 600 && id <= 622){
            weathericon.src = "iconspng/snow.png";
        }else if(id >= 701 && id <= 781){
            weathericon.src = "iconspng/haze.png";
        }else if(id >= 801 && id <= 804){
            weathericon.src = "iconspng/clouds.png";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            weathericon.src = "iconspng/rain.png";
        }

        weatherPart.querySelector(".temp .number").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherPart.querySelector(".wind span").innerText = `${Math.floor(speed)} kmph`;
        Infotext.classList.remove("pending", "error");
        Infotext.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}