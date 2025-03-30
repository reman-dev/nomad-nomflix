import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: 50%;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 1.3vw;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -300px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: black;
  font-size: 28px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BigMovie = styled(motion.div)<{ top: number }>`
  position: fixed;
  width: 40vw;
  height: auto;
  max-height: 80vh;
  top: ${(props) => props.top}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
  background-color: #181818;
  z-index: 100;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #181818, transparent 50%);
    top: 0;
    left: 0;
  }
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px 20px 0px 20px;
  font-size: 46px;
  position: relative;
  top: -60px;
  margin-bottom: -40px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.8;
`;

const ButtonsContainer = styled.div`
  display: flex;
  padding: 0px 20px 20px 20px;
  gap: 10px;
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  svg {
    margin-right: 6px;
  }
`;

const CircleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(42, 42, 42, 0.6);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: white;
    background-color: rgba(42, 42, 42, 0.8);
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies,
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id.toString()}
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <BigMovie
                    layoutId={bigMovieMatch.params.movieId}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    top={scrollY.get() + 50}
                  >
                    {clickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `url(${makeImagePath(
                              clickedMovie.backdrop_path,
                              "w500",
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <ButtonsContainer>
                          <PlayButton>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                                fill="currentColor"
                              />
                            </svg>
                            재생
                          </PlayButton>
                          <CircleButton>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11 2V11H2V13H11V22H13V13H22V11H13V2H11Z"
                                fill="currentColor"
                              />
                            </svg>
                          </CircleButton>
                          <CircleButton>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.3169 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C18 19.3285 17.3284 20.0001 16.5 20.0001H14H13H12.6228C11.6554 20.0001 10.6944 19.808 9.77673 19.4382L7.95516 18.8124C7.41255 18.6007 6.88211 18.2689 6.39188 17.8364C6.2284 17.6907 6.07735 17.5154 5.93709 17.3095C5.40601 16.6234 5.0998 15.8557 5.01385 15.0502C5.00467 14.958 5 14.8644 5 14.7693V10.2307C5 10.1356 5.00467 10.042 5.01385 9.94978C5.0998 9.1443 5.40601 8.37659 5.93709 7.69051C5.95151 7.67169 5.96593 7.65289 5.98034 7.63411C6.14327 7.43945 6.33023 7.24581 6.55793 7.06802C7.14499 6.60301 7.6349 6.36089 8.03078 6.21482C8.12325 6.17732 8.21259 6.14646 8.29888 6.12208C8.5058 6.0655 8.84723 6 9.39258 6H10.5V7.7132L10.696 8.7732Z"
                                fill="currentColor"
                              />
                            </svg>
                          </CircleButton>
                        </ButtonsContainer>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
