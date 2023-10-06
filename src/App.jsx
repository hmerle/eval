import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [weather, setWeather] = useState("");

  const [city, setCity] = useState("");

  const [data, setData] = useState("");

  const inputRef = useRef("");

  const [error, setError] = useState(false)

  function handleInput(event){
    if (event.key === 'Enter' && event.target.value !== "") {
      searchWeather(event.target.value);
      event.currentTarget.value = "";
    }
  }

  function searchWeather(city){
    fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/"+city)
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) => setError(true));
    switch(data.condition){
      case 'sunny':
        setWeather("ensoleillé, sortez léger");
        break;
      case 'cloudy':
        setWeather("nuageux");
        break;
      case 'stormy':
        setWeather("orageux");
        break;
      case 'windy':
        setWeather("venteux");
        break;
      case 'rainy':
        setWeather("pluvieux, prenez un parapluie");
        break;
      default :
        setWeather("inconnu, veuillez réessayer");
        break;
    }
  }

  function localize(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon="+longitude+"lat="+latitude)
        .then((response) => response.json())
        .then((json) => setCity(json))
        .catch((error) => console.error(error));
        searchWeather(city.city);
      },
      (err) => setError(true)
      );
    }
  }

  return (
    <>
      <h1><strong>Météo en ligne</strong></h1>
      <div>
        <input onKeyDown={handleInput} type="text" id="task" placeholder='Rechercher une ville' ref={inputRef}/>
        <p><i>Appuyer sur Entrée pour lancer la recherche</i></p>
        <br />
        <br />
        <button onClick={localize}>Me localiser</button>
      </div>
      {data ? 
      (<div className="card">
        <h3>Météo à {data.city}</h3>
        <hr />
        <span style={{fontSize:"large"}}><strong>{data.temperature}°C</strong></span>
        <p>Le temps est {weather}</p>
      </div>)
      : 
        (<div className="card">
        <h3>Aucune ville sélectionnée</h3>
      </div>)
      }
      {error ? <div>Une erreur s'est produite, merci de patienter avant de réessayer. Si l'erreur persiste, merci de contacter le support</div> : ""}
      <br />
      <footer>Application React réalisée par Hugo MERLE, élève en M2 à l'ISEN Nantes</footer>
    </>
  )
}

export default App
