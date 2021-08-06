import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import {useCallback, useEffect, useState} from "react";
import dayjs from "dayjs";

const apiKey = "f7105de9cc5e002b49808b50f9cf933ee3eb1a2f1b6be75676483f4e9b98f307";

const getWhoisInfo = (domain: string) => {
  return fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_IXAd34qkPOZBJ2wX17X3BJwyXU3pH&outputFormat=JSON&domainName=${domain}`
  );
};

const checkIsDateValid = (date: string) => {
    const today = dayjs();
    const formatDate = dayjs(date)
    return today.diff(formatDate, "week") > 2;
}

const getInfoByVirusTotal = (href: string) => {
    return fetch(
        `https://www.virustotal.com/vtapi/v2/url/report?api_key=${apiKey}&resource=${href}`
    );
}

const Alert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [isFishing, setIsFishing] = useState(false);

    const onOpenInfo = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsFishing(false);
  }, []);

  const buttonText = isOpen ? "Свернуть" : "Развернуть";

  useEffect(() => {
    getWhoisInfo(location.href)
      .then((res) => res.json())
      .then((json) => {
              setDate(json.WhoisRecord.registryData.createdDate.split("T")[0]);
              setIsFishing(!checkIsDateValid(json.WhoisRecord.registryData.createdDate.split("T")[0]));
          }
      );
      // getInfoByVirusTotal(location.href)
      //     .then((res) => res.json())
      //     .then((json) => {
      //         console.log(json);
      //     })
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
    </div>
  );
};

const body = document.querySelector("body");
const fishTank = document.createElement("div");
body.appendChild(fishTank);
ReactDOM.render(<Alert />, fishTank);
