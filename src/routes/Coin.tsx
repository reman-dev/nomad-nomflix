// import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import {
  fetchCoinInfo,
  // fetchCoinInfoPaprika,
  // fetchCoinTickersPaprika,
} from "../api";
import { useState } from "react";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 5px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${(props) => props.theme.textColor};
  text-transform: uppercase;
  font-weight: 500;
  margin-left: 5px;
  margin-right: 20px;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomeButton = styled.button`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 10px;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    background-color: ${(props) => props.theme.hoverColor};
  }

  a {
    display: block;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px 0px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: ${(props) => props.theme.textColor};
  }

  span:last-child {
    font-weight: 600;
    color: ${(props) => props.theme.priceColor};
  }
`;

const Description = styled.p<{ $isExpanded: boolean }>`
  margin: 20px 0px;
  line-height: 1.5;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: ${(props) => (props.$isExpanded ? "none" : "200px")};
  overflow: hidden;
  position: relative;
  transition: max-height 0.5s ease;
`;

const DescriptionContainer = styled.div`
  position: relative;
`;

const ReadMoreButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 30px 0 5px 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    ${(props) => props.theme.cardBgColor} 60%
  );
  border: none;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  color: ${(props) => props.theme.accentColor};
  display: flex;
  justify-content: center;
  align-items: flex-end;

  &:hover {
    text-decoration: underline;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 20px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px 0px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  transition: all 0.2s ease-in-out;

  a {
    display: block;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

// interface InfoData {
//   id: string;
//   name: string;
//   symbol: string;
//   rank: number;
//   is_new: boolean;
//   is_active: boolean;
//   type: string;
//   logo: string;
//   description: string;
//   message: string;
//   open_source: boolean;
//   started_at: string;
//   development_status: string;
//   hardware_wallet: boolean;
//   proof_type: string;
//   org_structure: string;
//   hash_algorithm: string;
//   first_data_at: string;
//   last_data_at: string;
// }

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

// CoinGecko 코인 상세 정보 인터페이스
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

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<IGeckoDetailData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId),
  );
  // const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
  //   ["tickers", coinId],
  //   () => fetchCoinTickersPaprika(coinId),
  // );

  const loading = infoLoading;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Container>
      <Header>
        <Img src={infoData?.image.large} alt="coin-img" />
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
        <NavContainer>
          <HomeButton>
            <Link to="/">Home</Link>
          </HomeButton>
        </NavContainer>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.market_cap_rank}</span>
              {/* <span>{infoData?.rank}</span> */}
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${infoData?.market_data.current_price.usd.toFixed(3)}</span>
              {/* <span>${tickersData?.quotes.USD.price.toFixed(3)}</span> */}
            </OverviewItem>
          </Overview>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{infoData?.market_data.total_supply}</span>
              {/* <span>{tickersData?.total_supply}</span> */}
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{infoData?.market_data.max_supply}</span>
              {/* <span>{tickersData?.max_supply}</span> */}
            </OverviewItem>
          </Overview>

          <DescriptionContainer>
            <Description $isExpanded={isExpanded}>
              {infoData?.description.en}
              {/* {infoData?.description} */}
            </Description>
            <ReadMoreButton
              onClick={() => setIsExpanded(isExpanded !== true ? true : false)}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </ReadMoreButton>
          </DescriptionContainer>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
