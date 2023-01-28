<template>
  <div class="backdropV" tabindex="-1">
    <div class="modalV container">
      <button class="closeV">${svg}</button>
      <img alt="title" />
      <div>
        <h3 class="modal__titleV t-js"></h3>
        <div class="flexboxV">
          <ul class="modal__listV">
            <li class="modal__descV">
              <p class="modal__pV">Vote / Votes</p>
              <p class="modal__rV">
                <span class="reitV">${vote_average.toFixed(1)}</span> /
                <span class="countV">${vote_count}</span>
              </p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">Popularity</p>
              <p class="modal__valV t-js">${popularity.toFixed(1)}</p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">Original Title</p>
              <p class="modal__valV uperV t-js">${original_title}</p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">Genre</p>
              <p class="modal__valV t-js"></p>
            </li>
          </ul>
          <div>
            <p class="modal__aboutV t-js">About</p>
            <p class="t-js"></p>
          </div>
          <ul class="modal__button--listV">
            <li>
              <button data-btn="${id}" type="button" class="modal__watchV">
                add to Watched
              </button>
            </li>
            <li>
              <button data-btn="id" type="button" class="modal__queV">
                add to queue
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.modalV {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: flex-start;
  padding: 40px 12px;
  gap: 16px;
  overflow-y: auto;
  max-height: 555;
  background-color: var(--text-color-light);

  max-width: 806px;
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
    max-width: 704px;
    width: 100%;
    padding: 40px 72px 40px 36px;
  }

  @media screen and (min-width: 480px) and (max-width: 767.5px) {
    flex-direction: column;
    width: 440px;
    //  min-width: 280px;
    height: 90vh;
    overflow-y: scroll;
    padding: 40px 20px;
  }

  @media screen and (max-width: 479.5px) and (orientation: portrait) {
    flex-direction: column;
    width: calc(100% - 40px);
    //  min-width: 280px;
    height: 90vh;
    overflow-y: scroll;
    padding: 40px 20px;
  }

  @media screen and (max-height: 560.5px) and (max-width: 915.5px) and (orientation: landscape) {
    flex-direction: column;
    width: 100.01vw !important;
    max-width: inherit;
    height: 100.01vh !important;
    overflow-y: scroll;
    padding: 40px 20px;
    flex-direction: row-reverse !important;
  }

  img {
    max-width: 375px;
    border-radius: 5px;
    max-height: 478px;
    width: 100%;

    @media screen and (max-width: 479.5px) and (orientation: portrait) {
      width: 100%;
      height: auto;
    }

    @media screen and (orientation: landscape) {
      width: 100%;
      height: auto;
    }

    @media screen and (max-width: 769.5px) {
      width: 100%;
    }

    @media screen and (min-width: 768px) and (max-width: 1279.5px) {
      max-width: 264px;
      max-height: 373px;
    }
  }
}

.closeV {
  position: absolute;
  right: 8px;
  top: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.modal__titleV {
  color: var(--text-color-black);
  font-weight: 500;
  font-size: 30px;
  line-height: 1.16;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.modal__listV {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .modal__descV {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: baseline;
  }

  .modal__pV {
    color: var(--text-color-light-grey);
    font-weight: 500;
    font-size: 12px;
    line-height: 1.33;
  }
}

.reitV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  color: var(--text-color-light);

  background-color: var(--bg-color-modal-orange);
  border-radius: 5px;

  padding: 1px 10px;
}

.countV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  background-color: #f7f7f7;
  border-radius: 5px;
  padding: 1px 4px;
  color: var(--text-color-black);
}

.modal__rV {
  color: var(--text-color-light-grey);
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
}

.modal__valV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  color: var(--text-color-black);
}

.uperV {
  text-transform: uppercase;
}

.flexboxV {
  gap: 20px;
  display: flex;
  flex-direction: column;

  @media screen and (orientation: portrait) {
    gap: 20px !important;
  }

  @media screen and (max-width: 754.5px) and (orientation: landscape) {
    gap: 10px !important;
    padding-bottom: 10px;
  }
}

.modal__aboutV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  text-transform: uppercase;
  color: var(--text-color-black);
  margin-bottom: 8px;
}

.about__descV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-color-black);
}

.modal__button--listV {
  display: flex;
  gap: 15px;

  @media screen and (max-width: 767.5px) {
    gap: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  @media screen and (max-width: 371.5px) {
    grid: none;
    text-align: center;
  }
}

.modal__watchV {
  padding: 14px 10px 12px;
  color: var(--text-color-light);
  text-transform: uppercase;
  background: var(--bg-color-modal-orange);
  border-radius: 5px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  cursor: pointer;

  @media screen and (max-width: 769.5px) {
    padding: 6px 27px;
    max-width: 161px;
  }
  &:hover {
    color: var(--bg-color-modal-orange);
    text-transform: uppercase;
    background: var(--text-color-light);
    border: 2px solid #ff6b01;
    border-radius: 5px;
  }
}

.modal__queV {
  padding: 14px 10px 12px;
  color: var(--text-color-black);
  text-transform: uppercase;
  background: var(--text-color-light);
  border: none;
  border-radius: 5px;
  outline: 1px solid var(--text-color-black);
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;

  @media screen and (max-width: 769.5px) {
    //    padding: 13px 11px 13px 13px;
    max-width: 161px;
    width: 100%;
    padding: 13px 7px 13px 7px;
  }
  &:hover {
    color: var(--text-color-light);
    text-transform: uppercase;
    background: var(--bg-color-modal-orange);
    outline: none;
    border: 2px solid #ff6b01;
    border-radius: 5px;
  }
}

.backdropV {
  background-color: rgba(0, 0, 0, 0.25);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  visibility: hidden;
  transition: all 250ms;
}

.visibleV {
  overflow: hidden;
  // position: fixed;
  // width: 100%;
  // height: 100%;
  opacity: 1;
  visibility: visible;
  transition: all 250ms;
  z-index: 2;
}

.closeV:hover .icoV {
  stroke: var(--bg-color-modal-orange);
  transition: all 250ms;
}

.remove {
  background-color: #ff001b;
}
</style>