import { useState } from "react"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const useWordleClone = (solution) => {
    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)])
    const [history, setHistory] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({});
    const [originalWord, setOriginaWord] = useState('');


    // format a guess into an array of letter objects
    //eg:[{key: 1 color: 'yellow'}]

    const formatGuess = (word) => {
        let solutionArray = [...word]
        let formattedGuess = [...currentGuess].map((l) => {
            return { key: l, color: 'grey' }
        })

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if (word[i] === 2) {
                formattedGuess[i].color = 'green'
                solutionArray[i] = null
            } else if (word[i] === 1) {
                formattedGuess[i].color = 'yellow'
                solutionArray[solutionArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    // Add a new guess to the guess state
    // update the isCorrect state if its correct
    // Add one to the turn state

    const addNewGuess = (formattedGuess, word, isValidWord) => {
        const allEqual = arr => arr.every(val => val === 2);
        if (allEqual(word) && isValidWord && word.length) {
            setIsCorrect(true);
            setOriginaWord(currentGuess);
        }
        setGuesses(prevGuesses => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })
        setHistory(prevHistory => {
            return [...prevHistory, currentGuess]
        })
        setTurn(prevTurn => {
            return prevTurn + 1
        })
        setUsedKeys(prevUsedKeys => {
            formattedGuess.forEach(l => {
                const currentColor = prevUsedKeys[l.key]

                if (l.color === 'green') {
                    prevUsedKeys[l.key] = 'green'
                    return
                }
                if (l.color === 'yellow' && currentColor !== 'green') {
                    prevUsedKeys[l.key] = 'yellow'
                    return
                }
                if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                    prevUsedKeys[l.key] = 'grey'
                    return
                }
            })

            return prevUsedKeys
        })
        setCurrentGuess('')
    }

    // Function to make a guess and update UI
    async function makeGuess(guess) {
        const response = await fetch('https://wordle-apis.vercel.app/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guess: guess.toUpperCase() // Ensure guess is in uppercase as per API requirement
            })
        });

        const data = await response.json();
        const formatted = formatGuess(data.score);

        // check word is valid
        if (!data.is_valid_word) {
            toast.warn("The word is not a valid word.", {
                position: "top-center"
            });
            return;
        }
        addNewGuess(formatted, data.score, data.is_valid_word);
    }


    // handle keyUp event and track current guess
    //if user press enter, add the new guess

    const handleKeyUp = ({ key }) => {

        if (key === 'Enter') {
            // only add guess if turn is less than 5
            if (turn > 5) {
                return
            }
            // do not allow duplicate words
            if (history.includes(currentGuess)) {
                toast.warn("You already tried that word.", {
                    position: "top-center"
                });
                return
            }
            // check word is 5 chars
            if (currentGuess.length !== 5) {
                return
            }

            makeGuess(currentGuess);

        }
        if (key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1))
            return
        }
        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess(prev => prev + key)
            }
        }

    }

    return { turn, currentGuess, guesses, isCorrect, usedKeys, originalWord, handleKeyUp }

}

export default useWordleClone