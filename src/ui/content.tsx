import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import {useCallback, useState} from "react";

const Alert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const onOpenInfo =  useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen])

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, [])

    const buttonText = isOpen ? "Свернуть" :  "Развернуть"

    if (!isVisible) {
        return null;
    }

  return (
    <div className="fishing-container">
      <div className="fishing-container_close-block">
        <button className="fishing-container_close-button" onClick={onClose}>
          <span className="fishing-container_close-button_text">×</span>
        </button>
      </div>
      <h1 className="fishing-container_title">Fishing detector</h1>
      <p className="fishing-container_warning">
        Мы считаем, что этот сайт фишинговый и не безопасен для использования
      </p>
        {isOpen &&
        <div className="fishing-container_reasons-block">
        <p className="fishing-container_reasons-block_text">
          Ниже представлены критерии, которыми мы руководствуемся:
        </p>
        <ul className="fishing-container_reasons-block_list">
          <li className="fishing-container_reasons-block_list_element"></li>
          <li className="fishing-container_reasons-block_list_element"></li>
          <li className="fishing-container_reasons-block_list_element"></li>
        </ul>
      </div>}
      <div className="fishing-container_expand-block">
        <button className="fishing-container_expand-button" onClick={onOpenInfo}>{buttonText}</button>
      </div>
    </div>
  );
};

const body = document.querySelector("body");
const fishTank = document.createElement("div");
body.appendChild(fishTank);
ReactDOM.render(<Alert />, fishTank);
