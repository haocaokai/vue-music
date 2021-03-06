<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
  
    <div class="bg-layer" ref="layer"></div>

    <scroll :probe-type="probeType" 
            :listen-scroll="listenScroll" 
            :data="songs" 
            class="list" 
            ref="list"
            @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>

       <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>

   
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import songList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    props: {
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      },
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      back() {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    mounted() {
      this.bgImgHeight = this.$refs.bgImg.clientHeight
      this.minTranslateY = -this.bgImgHeight + 40
      this.$refs.list.$el.style.top = `${this.bgImgHeight}px`
    },
    watch: {
      scrollY(newY) {
        let zIndex = 0
        let scale = 1
        let blur = 0
        let translateY = Math.max(this.minTranslateY, newY)
        if(this.translateY === translateY){
          return
        }
        this.translateY = translateY

        const percent = Math.abs(newY / this.bgImgHeight)

        if(newY > 0) {
          scale = 1 + percent
          zIndex = 10
        }else{
          blur = Math.min(20*percent, 20)
        }

        this.$refs.bgImg.style['transform'] = `scale(${scale})`
        this.$refs.bgImg.style['webkitTransform'] = `scale(${scale})`

        this.$refs.bgImg.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.bgImg.style['webkitBackdrop-filter'] = `blur(${blur}px)`

        this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`

        if(newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImg.style.paddingTop = 0
          this.$refs.bgImg.style.height = 40 + 'px'
          this.$refs.playBtn.style.display = 'none'
        }else{
          this.$refs.bgImg.style.paddingTop = '70%'
          this.$refs.bgImg.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImg.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      songList,
      Loading
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // overflow hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>