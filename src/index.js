import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter1, setSelectedCharacter1] = useState(null);
  const [selectedCharacter2, setSelectedCharacter2] = useState(null);
  const [sharedFilms, setSharedFilms] = useState([]);
  const [sharedHomeworld, setSharedHomeworld] = useState("");
  const [sharedStarships, setSharedStarships] = useState([]);
  const [sharedVehicles, setSharedVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  //if they dot have two in common must say some sort of message

  useEffect(() => {
    async function fetchData() {
      try {
        const cachedData = localStorage.getItem("characters");
        if (cachedData) {
          setCharacters(JSON.parse(cachedData));
        } else {
          const response = await fetch("/api/people/");
          const allCharacterData = await response.json();
          localStorage.setItem("characters", JSON.stringify(allCharacterData));
          setCharacters(allCharacterData);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Network error occurred. Please try again later.");
      }
    }
    //This is the function that is called when the page loads
    fetchData();
  }, []);

  //This is the function that is called when the compare button is clicked
  const handleCompare = async () => {
    try {
      setLoading(true);

      if (selectedCharacter1 == selectedCharacter2) {
        setAlertMessage("Please select two different characters.");
        setLoading(false);
        return;
      } else if (selectedCharacter1 && selectedCharacter2) {
        //This is the set up for the first character
        const response1 = await fetch(selectedCharacter1);
        const character1 = await response1.json();
        console.log(character1, "this is character1");
        const {
          name: name1,
          films: films1,
          homeworld: planets1,
          starships: starships1,
          vehicles: vehicles1,
        } = character1;

        //This is the set up for the second character
        const response2 = await fetch(selectedCharacter2);
        const character2 = await response2.json();
        const {
          name: name2,
          films: films2,
          homeworld: planets2,
          starships: starships2,
          vehicles: vehicles2,
        } = character2;

        console.log(character2, "this is character2");

        const sharedStarships = starships1.filter((starship) =>
          starships2.includes(starship)
        );
        const sharedVehicles = vehicles1.filter((vehicle) =>
          vehicles2.includes(vehicle)
        );

        const starshipNames = [];
        if (sharedStarships.length > 0) {
          const sharedStarshipNames = sharedStarships.map(async (starship) => {
            const starshipId = starship.split("/")[5];
            const starshipResponse = await fetch(
              `/api/starships/${starshipId}`
            );
            const starshipData = await starshipResponse.json();
            starshipNames.push(starshipData.name);
            return starshipData.name;
          });
        }

        const vehicleNames = [];
        if (sharedVehicles.length > 0) {
          const sharedVehicleNames = sharedVehicles.map(async (vehicle) => {
            const vehicleId = vehicle.split("/")[5];
            const vehicleResponse = await fetch(`/api/vehicles/${vehicleId}`);
            const vehicleData = await vehicleResponse.json();
            vehicleNames.push(vehicleData.name);
            return vehicleData.name;
          });
        }

        setSharedStarships(starshipNames);
        setSharedVehicles(vehicleNames);

        //This block determines if there are shared films
        const sharedFilms = films1
          .filter((film) => films2.includes(film))
          .map((filmUrl) => {
            console.log(filmUrl, "this is filmUrl");
            const filmIndex = filmUrl.match(/\/films\/(\d+)\//)[1];
            // const filmTitle = filmUrl.split("/")[5];
            return { index: filmIndex };
          });

        const sharedFilmTitles = sharedFilms.map((film) => film.index);

        //this ends the function if they do not share films
        if (sharedFilmTitles.length === 0) {
          setAlertMessage(
            `${name1} and ${name2} have not appeared in films together. `
          );
          setLoading(false);
          return;
        }

        //This loop gets the film titles
        //An alterative way to do this is store the names of all the films in local
        //storage and then just use a switch case with the corresponding film id
        const films = [];
        for (let i = 0; i < sharedFilmTitles.length; i++) {
          const id = sharedFilmTitles[i];
          const filmResponse = await fetch(`/api/films/${id}`);
          const filmData = await filmResponse.json();
          console.log(filmData, "this is filmData");
          const film = filmData;
          films.push(film);
        }

        console.log(films);
        setSharedFilms(films);

        //This block determines if they share planet, vehicle, or starship in that order
        if (planets1 == planets2) {
          const planetId = planets1.split("/")[5];
          const planetResponse = await fetch(`/api/planets/${planetId}`);
          const planetData = await planetResponse.json();
          console.log(planetData, "this is planetData");
          setSharedHomeworld(planetData.name);
        } else {
          setSharedHomeworld("");
        }

        //This block sets alert message if they shared a film and not a planet, starship, or vehicle
        //*************** This needs rework attention */
        if (
          sharedStarships.length <= 0 &&
          sharedVehicles.length <= 0 &&
          sharedHomeworld
        ) {
          setAlertMessage(
            `${name1} and ${name2} have appeared in the following films together: ${films} but have not shared a planet, starship, or vehicles.`
          );
          setLoading(false);
          return;
        } else if (sharedFilms.length > 0) {
          setAlertMessage(
            `${name1} and ${name2} have appeared in the following films together: ${films}.`
          );
        }
      } else {
        setAlertMessage("Please select two characters.");
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage("Network error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <select onChange={(e) => setSelectedCharacter1(e.target.value)}>
        <option value={null}>Select Character 1</option>
        {characters.map((character, index) => (
          <option key={index} value={character.url}>
            {character.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setSelectedCharacter2(e.target.value)}>
        <option value={null}>Select Character 2</option>
        {characters.map((character, index) => (
          <option key={index} value={character.url}>
            {character.name}
          </option>
        ))}
      </select>

      <button onClick={handleCompare} disabled={loading}>
        {loading ? "Loading..." : "Compare"}
      </button>

      {errorMessage && <div>{errorMessage}</div>}

      {alertMessage.length > 0 && (
        <div>
          <h2>{alertMessage}</h2>
        </div>
      )}

      {sharedFilms.length > 0 && (
        <div>
          <h2>Shared Films:</h2>
          <ul>
            {sharedFilms.map((film, index) => (
              <li key={index}>
                <p>{film}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sharedStarships.length > 0 && (
        <div>
          <h2>Shared Starships:</h2>
          <ul>
            {sharedStarships.map((starship, index) => (
              <li key={index}>{starship}</li>
            ))}
          </ul>
        </div>
      )}

      {sharedHomeworld && (
        <div>
          <h2>Shared Planets:</h2>
          <ul>
            <li>{sharedHomeworld}</li>
          </ul>
        </div>
      )}

      {sharedVehicles.length > 0 && (
        <div>
          <h2>Shared Vehicles:</h2>
          <ul>
            {sharedVehicles.map((vehicle, index) => (
              <li key={index}>{vehicle}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);
const app = <App />;
const rootElement = ReactDOM.createRoot(root);
rootElement.render(app);
