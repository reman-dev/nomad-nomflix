// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { fetchCoins } from "../api";
import { useQuery } from "react-query";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const sunMoonRiseAnimation = keyframes`
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const sunMoonSetAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;

  @keyframes rise-animation {
    from {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes set-animation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CoinsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    height: 100%;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

const CoinTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CoinName = styled.span`
  margin-top: 5px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.textColor};
`;

const CoinImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 5px;
  margin-bottom: 5px;
  transition: transform 0.3s ease;

  ${Coin}:hover & {
    transform: scale(1.1);
  }
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  padding: 8px 15px;
  width: 100%;

  span:first-child {
    color: ${(props) => props.theme.priceColor};
    margin-bottom: 5px;
    font-size: 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${(props) => props.theme.textColor};
  text-transform: uppercase;
  font-weight: 500;
  margin-left: 10px;
`;

const ChangeThemeToggle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.toggleColor};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  transition: background-color 0.5s;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: absolute;
  transition: transform 0.5s ease-in-out;
`;

const SunIcon = styled(Icon)<{ $isDark: boolean }>`
  animation: ${({ $isDark }) =>
      $isDark ? sunMoonSetAnimation : sunMoonRiseAnimation}
    1s forwards;
  transform-origin: 50% 200%;
  svg {
    fill: #222222;
    transition:
      fill 0.5s,
      transform 0.5s ease;
    &:hover {
      fill: #ffa500;
      transform: scale(1.2);
    }
  }
`;

const MoonIcon = styled(Icon)<{ $isDark: boolean }>`
  animation: ${({ $isDark }) =>
      $isDark ? sunMoonRiseAnimation : sunMoonSetAnimation}
    1s forwards;
  transform-origin: 50% 200%;
  svg {
    fill: #ffffff;
    transition:
      fill 0.5s,
      transform 0.5s ease;
    &:hover {
      fill: gold;
      transform: scale(1.2);
    }
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

// interface IPaprikaCoin {
//   id: string;
//   name: string;
//   symbol: string;
//   rank: number;
//   is_new: boolean;
//   is_active: boolean;
//   type: string;
// }

interface IGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
}

function Coins() {
  const { isLoading, data } = useQuery<IGeckoCoin[]>("allCoins", fetchCoins);

  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const isDark = useRecoilValue(isDarkAtom);

  const toggleDarkAtom = () => setDarkAtom((current) => !current);

  return (
    <Container>
      <Header>
        <Title>Crypto Tracker</Title>
        <ChangeThemeToggle onClick={toggleDarkAtom} aria-hidden="true">
          <SunIcon $isDark={isDark}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="#222222"
            >
              <path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" />
            </svg>
          </SunIcon>
          <MoonIcon $isDark={isDark}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="#ffffff"
            >
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
            </svg>
          </MoonIcon>
        </ChangeThemeToggle>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : !data || !Array.isArray(data) ? (
        <Loader>api 제한으로 데이터를 불러올 수 없습니다.</Loader>
      ) : (
        <CoinsList>
          {data.slice(0, 20).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <CoinTitle>
                  <CoinImg src={coin.image} alt={coin.name} />
                  <CoinName>{coin.name}</CoinName>
                </CoinTitle>
                <PriceInfo>
                  <span>
                    {Number(coin.price_change_percentage_24h) > 0
                      ? `+${Number(coin.price_change_percentage_24h).toFixed(2)}%`
                      : `${Number(coin.price_change_percentage_24h).toFixed(2)}%`}
                  </span>
                  <span>
                    {Number(coin.price_change_24h) > 0
                      ? `+$${Number(coin.price_change_24h).toFixed(2)}`
                      : `$${Number(coin.price_change_24h).toFixed(2)}`}
                  </span>
                </PriceInfo>
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
