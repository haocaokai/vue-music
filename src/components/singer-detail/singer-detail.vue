<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSons} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  }, 
  methods: {
    _getDetail() {
      if(!this.singer.id) {
        this.$router.push('/singer/')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if(res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {       // 拿到数据后做标准化处理
      let ret = []

      list.forEach((item) => {
        let {musicData} = item        // ES6 解构赋值
        if(musicData.songid && musicData.albummid) {
          ret.push(createSons(musicData))
        }
      })

      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .singer-detail
    position fixed
    z-index 100
    top 0px
    left 0px
    right 0px
    bottom 0px
    background $color-background
    
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>