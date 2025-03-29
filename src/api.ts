// CoinGecko API 사용
const BASE_URL = "https://api.coinpaprika.com/v1";
const GECKO_URL = "https://api.coingecko.com/api/v3/coins";

const USE_PAPRIKA_API = false; // true: paprika, false: gecko

// OHLC 데이터 타입 정의 (timestamp, open, high, low, close)
type IGeckoHistorical = [number, number, number, number, number];

// CoinPaprika API 함수들
export const fetchCoinsPaprika = () => {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
};

export const fetchCoinInfoPaprika = (coinId: string) => {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
    response.json(),
  );
};

export const fetchCoinTickersPaprika = (coinId: string) => {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
    response.json(),
  );
};

export function fetchCoinHistoryPaprika(coinId: string) {
  return fetch(
    `https://ohlcv-api.nomadcoders.workers.dev/?coinId=${coinId}`,
  ).then((response) => response.json());
}

// CoinGecko API 함수들
export const fetchCoinsGecko = () => {
  const apiUrl = `${GECKO_URL}/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`;
  return fetch(apiUrl).then((response) => response.json());
};

export const fetchCoinInfoGecko = (coinId: string) => {
  const apiUrl = `${GECKO_URL}/${coinId}?localization=false`;
  return fetch(apiUrl).then((response) => response.json());
};

export const fetchGeckoCoinHistory = (coinId: string) => {
  const days = 7; // 7일간의 데이터 (gecko api 제한으로 candlestick3일정도만 보임)
  const apiUrl = `${GECKO_URL}/${coinId}/ohlc?vs_currency=usd&days=${days}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data: IGeckoHistorical[]) => {
      // Gecko API의 OHLC Array 형식을 IGeckoHistorical 형식으로 변환
      return data.map((item) => {
        const [timestamp, open, high, low, close] = item;
        return {
          time_open: timestamp - 1440,
          time_close: timestamp,
          open: open,
          high: high,
          low: low,
          close: close,
        };
      });
    });
};

// 실제 사용하는 함수들 (API 소스에 따라 다른 함수 호출)
export const fetchCoins = () => {
  return USE_PAPRIKA_API ? fetchCoinsPaprika() : fetchCoinsGecko();
};

export const fetchCoinInfo = (coinId: string) => {
  return USE_PAPRIKA_API
    ? fetchCoinInfoPaprika(coinId)
    : fetchCoinInfoGecko(coinId);
};

export function fetchCoinHistory(coinId: string) {
  return USE_PAPRIKA_API
    ? fetchCoinHistoryPaprika(coinId)
    : fetchGeckoCoinHistory(coinId);
}
