import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter1, setSelectedCharacter1] = useState(null);
    const [selectedCharacter2, setSelectedCharacter2] = useState(null);
    const [sharedFilms, setSharedFilms] = useState([]);
    const [sharedPlanets, setSharedPlanets] = useState([]);
    const [sharedStarships, setSharedStarships] = useState([]);
    const [sharedVehicles, setSharedVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // const [sharedFilms, setSharedFilms] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const cachedData = localStorage.getItem('characters');
                if (cachedData) {
                    setCharacters(JSON.parse(cachedData));
                } else {
                    const response = await fetch('/api/people/');
                    const data = await response.json();
                    localStorage.setItem('characters', JSON.stringify(data));
                    setCharacters(data);
                }
            } catch (error) {
                console.error(error);
                setErrorMessage('Network error occurred. Please try again later.');
            }
        }
        fetchData();
    }, []);

    const handleCompare = async () => {
        try {
            setLoading(true);

            if (selectedCharacter1 && selectedCharacter2) {
                const response1 = await fetch(selectedCharacter1);
                const data1 = await response1.json();
                const films1 = data1.films;
                const planets1 = data1.planets ? await Promise.all(data1.planets.map(url => fetch(url).then(response => response.json()))) : [];
                const starships1 = data1.starships ? await Promise.all(data1.starships.map(url => fetch(url).then(response => response.json()))) : [];
                const vehicles1 = data1.vehicles ? await Promise.all(data1.vehicles.map(url => fetch(url).then(response => response.json()))) : [];

                const response2 = await fetch(selectedCharacter2);
                const data2 = await response2.json();
                const films2 = data2.films;
                const planets2 = data2.planets ? await Promise.all(data2.planets.map(url => fetch(url).then(response => response.json()))) : [];
                const starships2 = data2.starships ? await Promise.all(data2.starships.map(url => fetch(url).then(response => response.json()))) : [];
                const vehicles2 = data2.vehicles ? await Promise.all(data2.vehicles.map(url => fetch(url).then(response => response.json()))) : [];

                const sharedFilms = films1.filter(film => films2.includes(film)).map(filmUrl => {
                    const filmTitle = filmUrl.split('/')[5];
                    return { title: filmTitle, url: filmUrl };
                });

                const sharedPlanets = planets1.filter(planet => planets2.some(p => p.url === planet.url));
                const sharedStarships = starships1.filter(starship => starships2.some(s => s.url === starship.url));
                const sharedVehicles = vehicles1.filter(vehicle => vehicles2.some(v => v.url === vehicle.url));

                setSharedFilms(sharedFilms);
                setSharedPlanets(sharedPlanets);
                setSharedStarships(sharedStarships);
                setSharedVehicles(sharedVehicles);

                console.log(sharedFilms, sharedPlanets, sharedStarships, sharedVehicles);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setErrorMessage('Network error occurred. Please try again later.');
        }
    };

//     const handleCompare = async () => {
//     try {
//         setLoading(true);

//         if (selectedCharacter1 && selectedCharacter2) {
//             // ...

//             const sharedFilms = films1.filter(film => films2.includes(film)).map(filmUrl => {
//                 const filmTitle = filmUrl.split('/')[5];
//                 const characters = data1.results.concat(data2.results).filter(character => character.films.includes(filmUrl)).map(character => character.name);
//                 return { title: filmTitle, url: filmUrl, characters };
//             });

//             setSharedFilms(sharedFilms);

//             // ...
//         }

//         setLoading(false);
//     } catch (error) {
//         console.error(error);
//         setLoading(false);
//         setErrorMessage('Network error occurred. Please try again later.');
//     }
    // };


    


    return (
        <div>
            <select onChange={e => setSelectedCharacter1(e.target.value)}>
                <option value={null}>Select Character 1</option>
                {characters.map((character, index) => (
                    <option key={index} value={character.url}>
                        {character.name}
                    </option>
                ))}
            </select>

            <select onChange={e => setSelectedCharacter2(e.target.value)}>
                <option value={null}>Select Character 2</option>
                {characters.map((character, index) => (
                    <option key={index} value={character.url}>
                        {character.name}
                    </option>
                ))}
            </select>

            <button onClick={handleCompare} disabled={loading}>
                {loading ? 'Loading...' : 'Compare'}
            </button>

            {errorMessage && <div>{errorMessage}</div>}

            {sharedFilms.length > 0 && (
                <div>
                    <h2>Shared Films:</h2>
                    <ul>
                        {sharedFilms.map((film, index) => (
                            <li key={index}>
                                <a href={`/api/film/${film.url.split('/')[5]}`}>{film.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}



            {sharedPlanets.length > 0 && (
                <div>
                    <h2>Shared Planets:</h2>
                    <ul>
                        {sharedPlanets.map((planet, index) => (
                            <li key={index}>{planet.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {sharedStarships.length > 0 && (
                <div>
                    <h2>Shared Starships:</h2>
                    <ul>
                        {sharedStarships.map((starship, index) => (
                            <li key={index}>{starship.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {sharedVehicles.length > 0 && (
                <div>
                    <h2>Shared Vehicles:</h2>
                    <ul>
                        {sharedVehicles.map((vehicle, index) => (
                            <li key={index}>{vehicle.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));