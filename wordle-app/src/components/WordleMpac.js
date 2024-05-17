
import React, { useEffect, useState } from "react";
import useWordleClone from "../hooks/useWordleClone";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Keys from "../constants/Keys";
import Modal from "./Modal";


export default function WordleMpac() {

  const { currentGuess, handleKeyUp, guesses, isCorrect, turn, usedKeys, handleKeyup, originalWord } = useWordleClone()

  const [showModal, setShowModal] = useState(false)

  // fire the handleKeyUp events in the useWordleClone hook
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);;

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)

    // show the popup when the guess is correct
    if (isCorrect) {
      setTimeout(() => setShowModal(true), 1000)
      window.removeEventListener('keyup', handleKeyup)
    }

    // show the popup if the turn is greater than 5
    if (turn > 5) {
      setTimeout(() => setShowModal(true), 1000)
      window.removeEventListener('keyup', handleKeyup)
    }

    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup, isCorrect, turn])


  return (
    <>
      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={originalWord} />}
      <div className="gridDiv">
        <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
        <Keypad keys={Keys} usedKeys={usedKeys} />
      </div>
    </>
  )

}

