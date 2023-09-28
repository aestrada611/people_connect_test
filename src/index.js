import ReactDOM from "react-dom/client";
import React, { useState, useEffect } from "react";
import "./index.css";
import { sign } from "crypto";

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
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // I added a local cachedData because I know the intial load can be pretty significant.
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
    fetchData();
  }, []);

  //This is the function that is called when the compare button is clicked
  //I know the prompt asked to name the films they were in together, but I thought it would be more interesting to show all the shared data.
  //I still listed the films but also added shared planets, starships and vehicles which all the data comes from the API which is all proxied through the server.
  const handleCompare = async () => {
    try {
      setLoading(true);

      if (selectedCharacter1 == selectedCharacter2) {
        setAlertMessage("Please select two different characters.");
        setTimeout(() => setAnimationReady(true), 500);
        setLoading(false);
        return;
      } else if (selectedCharacter1 && selectedCharacter2) {
        //This is the set up for the first character
        const {
          name: name1,
          films: films1,
          homeworld: planets1,
          starships: starships1,
          vehicles: vehicles1,
        } = await (await fetch(selectedCharacter1)).json();

        //This is the set up for the second character
        const {
          name: name2,
          films: films2,
          homeworld: planets2,
          starships: starships2,
          vehicles: vehicles2,
        } = await (await fetch(selectedCharacter2)).json();

        //This block determines if there are shared films
        const sharedFilms = films1
          .filter((film) => films2.includes(film))
          .map((filmUrl) => {
            const filmIndex = filmUrl.match(/\/films\/(\d+)\//)[1];
            return { movieIndex: filmIndex };
          });
        const sharedFilmTitles = sharedFilms.map((film) => film.movieIndex);

        //this ends the function if they do not share films
        if (sharedFilmTitles.length === 0) {
          setAlertMessage(
            `${name1} and ${name2} have not appeared in films together. `
          );
          setTimeout(() => setAnimationReady(true), 500);
          setLoading(false);
          return;
        }

        //This block determines if they share homePlanet
        let sharedPlanet = "";
        if (planets1 == planets2) {
          const planetId = planets1.split("/")[5];
          const planetResponse = await fetch(`/api/planets/${planetId}`);
          const planetData = await planetResponse.json();
          setSharedHomeworld(planetData.name);
          sharedPlanet = planetData.name;
        } else {
          setSharedHomeworld("");
          sharedPlanet = "";
        }

        //This block determines if they share starships
        const sharedStarships = starships1.filter((starship) =>
          starships2.includes(starship)
        );
        const starshipIds = sharedStarships.map(
          (starship) => starship.split("/")[5]
        );
        const starshipResponses = await Promise.all(
          starshipIds.map((id) => fetch(`/api/starships/${id}`))
        );
        const starshipDataArray = await Promise.all(
          starshipResponses.map((response) => response.json())
        );
        const starshipNames = starshipDataArray.map(
          (starshipData) => starshipData.name
        );
        setSharedStarships(starshipNames);

        //This block determines if they share vehicles
        const sharedVehicles = vehicles1.filter((vehicle) =>
          vehicles2.includes(vehicle)
        );
        const vehicleResponses = await Promise.all(
          sharedVehicles.map((vehicle) => {
            const vehicleId = vehicle.split("/")[5];
            return fetch(`/api/vehicles/${vehicleId}`);
          })
        );
        const vehicleDataArray = await Promise.all(
          vehicleResponses.map((response) => response.json())
        );
        const vehicleNames = vehicleDataArray.map(
          (vehicleData) => vehicleData.name
        );
        setSharedVehicles(vehicleNames);

        //This block gets movie titles from shared films
        const filmResponses = await Promise.all(
          sharedFilmTitles.map((id) => fetch(`/api/films/${id}`))
        );
        const films = await Promise.all(
          filmResponses.map((response) => response.json())
        );
        setSharedFilms(films);

        //This block sets alert message
        if (
          sharedStarships.length == 0 &&
          sharedVehicles.length == 0 &&
          sharedPlanet == ""
        ) {
          setAlertMessage(
            `Although they don't share planets, vehicles nor starships; ${name1} and ${name2} have both appeared in the following films: ${films.join(
              ", "
            )}`
          );
          setTimeout(() => setAnimationReady(true), 500);
          setLoading(false);
          return;
        } else if (sharedFilms.length > 0) {
          setAlertMessage(
            `${name1} and ${name2} have appeared in the following films together: ${films.join(
              ", "
            )}.`
          );
          setTimeout(() => setAnimationReady(true), 500);
        }
      } else {
        setAlertMessage("Please select two characters.");
        setTimeout(() => setAnimationReady(true), 500);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage("Network error occurred. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div>
        <h1 className="headerText">
          Select Two Different Star Wars Characters
        </h1>
      </div>
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

      <div className="intro-text-container">
        <div className={animationReady ? "intro-text scrolling" : "intro-text"}>
          {alertMessage.length > 0 && (
            <div>
              <h2>{alertMessage}</h2>

              {sharedHomeworld.length > 0 && (
                <div>
                  <h2>Shared Planets:</h2>
                  <ul>
                    <li>{sharedHomeworld}</li>
                  </ul>
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
                      <li key={index}>
                        <p>{starship}</p>
                      </li>
                    ))}
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
          )}
        </div>
      </div>
    </div>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);
const app = <App />;
const rootElement = ReactDOM.createRoot(root);
rootElement.render(app);
