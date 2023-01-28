<!-- <template>
    <button v-bind:type="type" :class='{addBtn:true, queBtn:see}'>
      <slot></slot>  
    </button>
</template>

<script>
    export default {
    name: 'ModalBtn',
    props: {
        type: {
            type: String,
            default: 'button'   
        },
        see: {
         type: Boolean,
         default:false   
        } 
    },
     
    }
</script>

<style lang="scss" scoped>
.addBtn { 
padding: 14px 10px 12px;
color: var(--text-color-light);
text-transform: uppercase;
background: var(--bg-color-modal-orange);
border-radius: 5px;
border: none;
border-radius: 5px;

font-family: Roboto;
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
.queBtn{
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
</style> -->