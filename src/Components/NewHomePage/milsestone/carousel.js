import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./carouselArrowButton";
import { DotButton, useDotButton } from "./carouselDotsButton";
import "./carousel.css";
import Link from "next/link";
import { Tooltip, Button } from "@nextui-org/react";

const TWEEN_FACTOR_BASE = 0.2;

const Carousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    target="black"
                    href="https://gateway.lighthouse.storage/ipfs/QmeiZvhkJWn5twr7KtWJ74UpZRBUkgKVv4BLLZPDWHTQfg"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/QmeiZvhkJWn5twr7KtWJ74UpZRBUkgKVv4BLLZPDWHTQfg"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    target="black"
                    href="https://gateway.lighthouse.storage/ipfs/QmSM7vePcmMe3Lh3zP1crCoNXbUnmE5WM4ndvnhQNQ99sH"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/QmSM7vePcmMe3Lh3zP1crCoNXbUnmE5WM4ndvnhQNQ99sH"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    target="black"
                    href="https://gateway.lighthouse.storage/ipfs/Qma8aoofmqwKf1HhLSX311wBhJR689Lb3T9JUwSzRf1xjU"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/Qma8aoofmqwKf1HhLSX311wBhJR689Lb3T9JUwSzRf1xjU"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    target="black"
                    href="https://gateway.lighthouse.storage/ipfs/QmdWKMXhCvSmUrdGKE8qZzJJA4CJ8bBAZ73P8SRDL1ZWwc"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/QmdWKMXhCvSmUrdGKE8qZzJJA4CJ8bBAZ73P8SRDL1ZWwc"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    target="black"
                    href="https://gateway.lighthouse.storage/ipfs/QmR2QPNWPa9SFEFB1r3aLjEqY9iBouBujrcnz17fX2Ay9d"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/QmR2QPNWPa9SFEFB1r3aLjEqY9iBouBujrcnz17fX2Ay9d"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Tooltip
                     content="Click on below image to open the milestone in a new tab"
                  className="tooltip"
                >
                  <Link
                    href="https://gateway.lighthouse.storage/ipfs/QmZy6HADGZ6pdj8Jn7SJbfDmjpakKFJPTLetGVaBxxpjmW"
                    target="black"
                  >
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={
                        "https://gateway.lighthouse.storage/ipfs/QmZy6HADGZ6pdj8Jn7SJbfDmjpakKFJPTLetGVaBxxpjmW"
                      }
                      alt="Your alt text"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
