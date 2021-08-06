import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import { useCallback, useState } from "react";

const getWhoisInfo = (domain: string) => {
  return fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_IXAd34qkPOZBJ2wX17X3BJwyXU3pH&outputFormat=JSON&domainName=${domain}`
  );
};

const Alert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const onOpenInfo = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const buttonText = isOpen ? "Свернуть" : "Развернуть";

  if (!isVisible) {
    return null;
  }

  const [url, setUrl] = React.useState(new Date());
  React.useEffect(() => {
    getWhoisInfo(location.href)
      .then((res) => res.json())
      .then((json) =>
        setUrl(new Date(json.WhoisRecord.registryData.createdDate))
      );
  }, []);

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
      {isOpen && (
        <div className="fishing-container_reasons-block">
          <p className="fishing-container_reasons-block_text">
            Ниже представлены критерии, которыми мы руководствуемся:
          </p>
          <ul className="fishing-container_reasons-block_list">
            <li className="fishing-container_reasons-block_list_element"></li>
            <li className="fishing-container_reasons-block_list_element"></li>
            <li className="fishing-container_reasons-block_list_element"></li>
          </ul>
        </div>
      )}
      <div className="fishing-container_expand-block">
        <button
          className="fishing-container_expand-button"
          onClick={onOpenInfo}
        >
          {buttonText}
        </button>
      </div>
      <div>{Intl.DateTimeFormat("ru").format(url)}</div>
    </div>
  );
};

const body = document.querySelector("body");
const fishTank = document.createElement("div");
body.appendChild(fishTank);
ReactDOM.render(<Alert />, fishTank);
