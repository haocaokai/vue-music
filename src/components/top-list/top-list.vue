<template>
  <transition name="slide">
    <music-list  :title="title" :bg-image="bgImg" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>


<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSons} from 'common/js/song'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImg() {
        return this.topList.picUrl
      },
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if(!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getMusicList(this.topList.id).then((res) => {
          this.songs = this._normalizeSongs(res.songlist)
          
        })
      },
      _normalizeSongs(list) {     
        let ret = []

        list.forEach((item) => {
          let musicData = item.data      
          if(musicData.songid && musicData.albummid) {
            ret.push(createSons(musicData))
          }
        })

        return ret
      }
    },
    components: {
      MusicList
    },

  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>