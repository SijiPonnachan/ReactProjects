import React from 'react'

export default function Row({ guess, currentGuess }) {
    // render the word in guess with color
    // example 0 is grey and 1 is yello and 2 is green
    if (guess) {
        return (
            <div className="row past">
                {guess.map((l, i) => (
                    <div key={i} className={l.color}>{l.key}</div>
                ))}
            </div>
        )
    }
    
    // the word should enter in each div
    if (currentGuess) {
        let letters = currentGuess.split('')

        return (
            <div className="row current">
                {letters.map((letter, i) => (
                    <div key={i} className="filled">{letter}</div>
                ))}
                {[...Array(5 - letters.length)].map((_, i) => (
                    <div key={i}></div>
                ))}
            </div>
        )
    }
    return (
        <div className="row">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )

}