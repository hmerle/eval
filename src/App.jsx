import { useRef, useState } from 'react'
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
        setWeather(["ensoleillé", "Des vêtements légers sont recommandés"]);
        break;
      case 'cloudy':
        setWeather(["nuageux", "Un gilet ou un pull peut s'avérer utile"]);
        break;
      case 'stormy':
        setWeather(["orageux", "Ne pas tarder à rentrer"]);
        break;
      case 'windy':
        setWeather(["venteux", "Un manteau est conseillé"]);
        break;
      case 'rainy':
        setWeather(["pluvieux", "Prenez un parapluie"]);
        break;
      default :
        setWeather(["inconnu", "Veuillez réessayer dans quelques secondes"]);
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
      (<div>
        <h3>Météo à <span style={{textTransform: 'capitalize'}}>{data.city}</span> · France</h3>
        <hr />
        <p className='weather' style={{textTransform: 'capitalize'}}>
          <strong>{weather[0]} - </strong>
          <strong>{data.temperature}°C</strong> 
        </p>
        <p>{weather[1]}</p>
      </div>)
      : 
        (<div>
        <h3>Aucune ville sélectionnée</h3>
      </div>)
      }
      {error ? <div>Une erreur s'est produite, merci de patienter avant de réessayer. Si l'erreur persiste, merci de contacter le support</div> : ""}
      <footer>
        <p>Application React réalisée par Hugo MERLE, élève en M2 à l'<a href='https://isen-nantes.fr'>ISEN Nantes</a></p>
        <p><i>Le code source peut être retrouvé sur <a href='https://github.com/hmerle/eval'>Github</a></i></p>
      </footer>
    </>
  )
}

export default App
