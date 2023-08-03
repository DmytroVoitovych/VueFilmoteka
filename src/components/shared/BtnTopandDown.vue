<template>
  <button type="button" :class="toTop && 'rotate'" v-on:click.="toTopOrDown">
    <svg
      enable-background="new 0 0 512 512"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 512 512"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="55"
      height="55"
    >
      <g>
        <g>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_1_"
            x1="-0.0000027"
            x2="512"
            y1="256"
            y2="256"
          >
            <stop offset="0" style="stop-color: rgba(255, 151, 0, 1)" />
            <stop offset="1" style="stop-color: rgba(251, 75, 2, 1)" />
          </linearGradient>
          <circle cx="256" cy="256" fill="url(#SVGID_1_)" r="256" />
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="SVGID_2_"
            x1="42.6666641"
            x2="469.3333435"
            y1="256.0005188"
            y2="256.0005188"
          >
            <stop offset="0" style="stop-color: rgba(251, 75, 2, 1)" />
            <stop offset="1" style="stop-color: rgba(255, 151, 0, 1)" />
          </linearGradient>
          <path
            d="M256,469.3338623c-117.6315002,0-213.3333435-95.7018738-213.3333435-213.3333435    c0-117.6309204,95.7018356-213.333313,213.3333435-213.333313c117.6357117,0,213.3333435,95.7024002,213.3333435,213.333313    C469.3333435,373.6319885,373.6357117,469.3338623,256,469.3338623z"
            fill="url(#SVGID_2_)"
          />
        </g>
        <path
          d="M264,144c-66.2741699,0-120,53.7263947-120,120c0,66.2741394,53.7258301,120,120,120s120-53.7258606,120-120   C384,197.7263947,330.2741089,144,264,144z M264,341.7077332l-63.3152313-63.3157349h33.5786743v-82.0991974h59.4725189v82.0991974   h33.5791931L264,341.7077332z"
          opacity="0.3"
        />
        <path
          d="M256,136c-66.2741699,0-120,53.7263947-120,120c0,66.2741394,53.7258301,120,120,120   s120-53.7258606,120-120C376,189.7263947,322.2741089,136,256,136z M256,333.7077332l-63.3152313-63.3157349h33.5786743   v-82.0991974h59.4725189v82.0991974h33.5791931L256,333.7077332z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  </button>
</template>

<script lang="js">
import { featuresStore } from '@/store/storeForFeatures';
import Bowser from 'bowser';


export default {
    data() {
        return {
          toTop: false,
          locate: 0,

    }
    },

  mounted() {

    this.mangeDirectBtn();
    
  },

    methods: {
      mangeDirectBtn() {

        if (this.getRef) {
          const intersectionObserver = new IntersectionObserver((entries) => {

            entries[0].isIntersecting && (this.locate = window.scrollY);
            return !entries[0].isIntersecting && (this.locate = window.scrollY);
            

          }, { threshold: .5 });
          // start observing

          intersectionObserver.observe(this.getRef);

        }
      },
      toTopOrDown(e) {
console.log(e);
let scrollHeight = Math.max( // взнаємо висоту скролу (можна винести для чистоти коду)
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );

        if (this.toTop) {
          window.scroll({ top: 0, behavior: 'smooth', });

          return;
        }
        window.scrollBy({ top: scrollHeight, behavior: "smooth" });


  }
  },


  watch: {
    locate(n, o) {
      const platforTypeMobile = Bowser.getParser(window.navigator.userAgent).getPlatformType() === 'mobile';
     
      n < document.documentElement.scrollHeight / (platforTypeMobile ? 1.5 : 2)
        ?
        (this.toTop = (n < Number(o)) || !o ? false : true)
        :
        (this.toTop = true);
    },
    getRef(n, o) {
            n !== o && this.mangeDirectBtn();
   }
  },
    computed: {
        getRef() {

            return featuresStore?.getters?.getRefItem;
        }
    }

}
</script>

<style lang="scss" scoped>
button {
  background: none;
  position: fixed;
  bottom: 90px;
  right: calc(15px + var(--left-modal) * 2);
  padding: 0;
  border: none;
  z-index: 1;

  svg {
    &:hover {
      filter: drop-shadow(-1px 1px 5px var(--scroll-btn));
      cursor: pointer;
    }

    &:active {
      scale: 90%;
    }
  }
}

.rotate {
  rotate: 180deg;
}
</style>
