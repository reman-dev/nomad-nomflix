import { useQuery } from "react-query";
import { fetchCoinInfo } from "../api";
import styled from "styled-components";

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px 0px;
`;

const PriceRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const PriceItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  padding: 10px 0;
  width: 50%;
  color: ${(props) => props.theme.textColor};

  span:first-child {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 5px;
  }
  span:last-child {
    font-size: 12px;
    color: ${(props) => props.theme.priceColor};
  }
`;

const VerticalDivider = styled.div`
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 50%;
  width: 1px;
  background-color: ${(props) => props.theme.borderColor};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.borderColor};
  margin: 10px 0;
`;

interface PriceProps {
  coinId: string;
}

// interface PriceData {
//   id: string;
//   name: string;
//   symbol: string;
//   rank: number;
//   total_supply: number;
//   max_supply: number;
//   beta_value: number;
//   first_data_at: string;
//   last_updated: string;
//   quotes: {
//     USD: {
//       ath_date: string;
//       ath_price: number;
//       market_cap: number;
//       market_cap_change_24h: number;
//       percent_change_1h: number;
//       percent_change_1y: number;
//       percent_change_6h: number;
//       percent_change_7d: number;
//       percent_change_12h: number;
//       percent_change_15m: number;
//       percent_change_24h: number;
//       percent_change_30d: number;
//       percent_change_30m: number;
//       percent_from_price_ath: number;
//       price: number;
//       volume_24h: number;
//       volume_24h_change_24h: number;
//     };
//   };
// }

interface IGeckoDetailData {
  id: string;
  symbol: string;
  name: string;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  description: {
    en: string;
    [key: string]: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  genesis_date: string;
  market_cap_rank: number;
  market_data: {
    current_price: { [key: string]: number };
    ath: { [key: string]: number };
    ath_change_percentage: { [key: string]: number };
    ath_date: { [key: string]: string };
    atl: { [key: string]: number };
    atl_change_percentage: { [key: string]: number };
    atl_date: { [key: string]: string };
    market_cap: { [key: string]: number };
    market_cap_change_24h_in_currency: { [key: string]: number };
    price_change_percentage_1h_in_currency: { [key: string]: number };
    total_volume: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
    last_updated: string;
  };
  community_data: {
    twitter_followers: number;
    reddit_subscribers: number;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    commit_count_4_weeks: number;
  };
  last_updated: string;
}

function Price({ coinId }: PriceProps) {
  const { isLoading: priceInfoLoading, data: priceInfoData } =
    useQuery<IGeckoDetailData>(["PriceInfo", coinId], () =>
      fetchCoinInfo(coinId),
    );

  return priceInfoLoading ? (
    "Loading..."
  ) : (
    <PriceContainer>
      <PriceRow>
        <PriceItem>
          <span>Current Price</span>
          {/* <span>{priceInfoData?.quotes.USD.price.toFixed(2)}</span> */}
          <span>{priceInfoData?.market_data.current_price.usd.toFixed(2)}</span>
        </PriceItem>
        <VerticalDivider />
        <PriceItem>
          <span>Change 24h</span>
          {/* <span>
            {priceInfoData?.quotes.USD.percent_change_24h.toFixed(2)}%
          </span> */}
          <span>
            {priceInfoData?.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </PriceItem>
      </PriceRow>

      <Divider />

      <PriceRow>
        <PriceItem>
          <span>Volume</span>
          {/* <span>{priceInfoData?.quotes.USD.volume_24h.toFixed(2)}</span> */}
          <span>{priceInfoData?.market_data.total_volume.usd.toFixed(2)}</span>
        </PriceItem>
        <VerticalDivider />
        <PriceItem>
          <span>Market Cap</span>
          {/* <span>{priceInfoData?.quotes.USD.market_cap.toFixed(2)}</span> */}
          <span>{priceInfoData?.market_data.market_cap.usd.toFixed(2)}</span>
        </PriceItem>
      </PriceRow>
    </PriceContainer>
  );
}

export default Price;
