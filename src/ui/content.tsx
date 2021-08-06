import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

const getWhoisInfo = (domain: string) => {
  return fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_IXAd34qkPOZBJ2wX17X3BJwyXU3pH&outputFormat=JSON&domainName=${domain}`
  );
};

const isInvalidAmountOfDots = (domain: string) => {
    let splitDomain = domain.split(".");
    return splitDomain.length >= 4;
}

const isNotHTTPS = (domain: string) => {
    return location.protocol !== "https";
}


const idDomainFishing = (domain: string, date: string) => {
    let result = countScoreByCreationDate(date);
    if (isInvalidAmountOfDots(domain)) {
        result += 10;
    }

    if (isNotHTTPS(domain)) {
        result += 20;
    }

    return result >= 90;
}

const countScoreByCreationDate = (date: string) => {
    const today = dayjs();
    const formatDate = dayjs(date);
    const lifeDuration = today.diff(formatDate, "week");
    return ((1 - (Math.tan(0.3*lifeDuration  - 4)/(Math.PI/2))) / (1 - (Math.tan(0.3*2  - 4)/(Math.PI/2)))) * 100;
}

const checkIsDateValid = (date: string) => {
  const today = dayjs();
  const formatDate = dayjs(date);
  return today.diff(formatDate, "week") > 2;
};

const Alert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [isFishing, setIsFishing] = useState(false);
  const [isDateInvalid, setIsDateInvalid] = useState(false);

  const onOpenInfo = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsFishing(false);
  }, []);

  const calculateFishing = useCallback(() => {
      setIsFishing(idDomainFishing(domain, date));
  },[])

  const buttonText = isOpen ? "Свернуть" : "Почему?";
  const domain = location.href;

  useEffect(() => {
    getWhoisInfo(domain)
      .then((res) => res.json())
      .then((json) => {
        setDate(json.WhoisRecord.registryData.createdDate.split("T")[0]);
        setIsDateInvalid(
          !checkIsDateValid(
            json.WhoisRecord.registryData.createdDate.split("T")[0]
          )
        );
        calculateFishing();
      });
  }, []);

  if (!isFishing) {
    return null;
  }

  return (
    <div className="fishing-container">
      <div className="fishing-container_close-block">
        <button className="fishing-container_close-button" onClick={onClose}>
          <span className="fishing-container_close-button_text">×</span>
        </button>
      </div>
      <h1 className="fishing-container_title">Осторожно, опасный сайт</h1>
      <p className="fishing-container_warning">
        Мы считаем, что этот сайт фишинговый и небезопасен для использования.
        Рекомендуем покинуть этот сайт, чтобы не подвергаться риску утечки
        личных данных.
      </p>
      {isOpen && (
        <div className="fishing-container_reasons-block">
          <p className="fishing-container_reasons-block_text">
            Ниже представлены критерии, которыми мы руководствуемся:
          </p>
          <ul className="fishing-container_reasons-block_list">
              {isDateInvalid &&
              <li className="fishing-container_reasons-block_list_element">
                  Сайт создан в последние две недели
              </li>}
              {isInvalidAmountOfDots(domain) &&
              <li className="fishing-container_reasons-block_list_element">
                  Домен сайта выше третьего уровня
              </li>}
              {isNotHTTPS(domain) &&
              <li className="fishing-container_reasons-block_list_element">
                  Сайт не использует HTTPS
              </li>}
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
    </div>
  );
};

const body = document.querySelector("body");
const fishTank = document.createElement("div");
body.appendChild(fishTank);
ReactDOM.render(<Alert />, fishTank);
