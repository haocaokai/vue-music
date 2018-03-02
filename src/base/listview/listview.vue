<template>
  <scroll class="listview" 
          :data="data"  
          ref="listview"
          :listenScroll="listenScroll"
          :probeType='probeType'
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
            class="item" 
            :data-index="index"
            :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>

    <div class="list-fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>

<script>
  import scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      // this.scrollY = -1
      // this.heightList = []
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortCutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove(e) {
        // 判断移动时距离 / 每个字母高度，得到detal，再据此移动到目标分类
        const ANCHOR_HEIGHT = 18
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let detal = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = parseInt(this.touch.anchorIndex) + detal
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y          // 获得滑动距离
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index])

      },
      _calculateHeight() {
        let height = 0
        let listGroup = this.$refs.listGroup
        this.heightList = []
        this.heightList.push(height)

        for(let i=0; i<listGroup.length; i++) {
          let item = listGroup[i]
          height += item.clientHeight

          this.heightList.push(height)

        }

        console.log(this.heightList)
      }
    },
    components: {
      scroll
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        },20)
      },
      scrollY(newY) {
        let heightList = this.heightList
        for(let i=0; i<heightList.length; i++) {
          let height1 = heightList[i]
          let height2 = heightList[i + 1]

          if(-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            return
          }

          this.currentIndex = 0
        }
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
