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
};

const isNotHTTPS = () => {
  return location.protocol !== "https:";
};

const isDomainFishing = (domain: string, date: string, isLoxotron: boolean) => {
  let result = countScoreByCreationDate(date);
  if (isInvalidAmountOfDots(domain)) {
    result += 10;
  }

  if (isNotHTTPS()) {
    result += 20;
  }

  if (isLoxotron) {
    result += 90;
  }

  console.log(result);

  return result >= 90;
};

const countScoreByCreationDate = (date: string) => {
  const today = dayjs();
  const formatDate = dayjs(date);
  const lifeDuration = today.diff(formatDate, "week");

  return (
    ((1 - Math.atan(0.3 * lifeDuration - 4) / (Math.PI / 2)) /
      (1 - Math.atan(0.3 * 2 - 4) / (Math.PI / 2))) *
    100
  );
};

const checkIsDateValid = (date: string) => {
  const today = dayjs();
  const formatDate = dayjs(date);
  return today.diff(formatDate, "week") > 2;
};

const getLoxotronStatus = (href: string) => {
  return fetch(`https://loxotrons.ru/api/v1/check/${href}`);
};

const Alert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFishing, setIsFishing] = useState(false);
  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const [isLoxotronState, setIsLoxotronState] = useState(false);
  let date = "";
  let isLoxotron = false;

  const onOpenInfo = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsFishing(false);
  }, []);

  const calculateFishing = useCallback(() => {
    setIsFishing(isDomainFishing(domain, date, isLoxotron));
  }, [date, isLoxotron]);

  const buttonText = isOpen ? "Свернуть" : "Почему?";
  const domain = location.href;

  useEffect(() => {
    Promise.all([
      getWhoisInfo(domain)
        .then((res) => res.json())
        .then((json) => {
          date = json.WhoisRecord.registryData.createdDate.split("T")[0];
          setIsDateInvalid(
            !checkIsDateValid(
              json.WhoisRecord.registryData.createdDate.split("T")[0]
            )
          );
        }),
      getLoxotronStatus(location.href.split("?")[0].split("/")[2])
        .then((res) => res.json())
        .then((json) => {
          if (json.records?.length > 0) {
            const result = json.records[0].trust_id;
            if ([1, 2, 3, 6, 7].includes(result)) {
              console.log(result);
              isLoxotron = true;
              setIsLoxotronState(true);
            }
          }
        }),
    ]).then((_) => calculateFishing());
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
            {isDateInvalid && (
              <li className="fishing-container_reasons-block_list_element">
                Сайт создан в последние две недели
              </li>
            )}
            {isInvalidAmountOfDots(domain) && (
              <li className="fishing-container_reasons-block_list_element">
                Домен сайта выше третьего уровня
              </li>
            )}
            {isNotHTTPS() && (
              <li className="fishing-container_reasons-block_list_element">
                Сайт не использует HTTPS
              </li>
            )}
            {isLoxotronState && (
              <li className="fishing-container_reasons-block_list_element">
                Сайт был обнаружен в базе фишинговых сайтов
              </li>
            )}
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
