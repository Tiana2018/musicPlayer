/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
var app = new Vue({
    el:"#player",
    data:{
        // 查询关键字
        query: "",
        // 歌曲数组
        musicList: [],
        // 歌曲地址
        musicUrl: "",
        //正在播放的歌名
        songName:"",
        // 歌曲封面
        musicCover: "images/cover.png",
        // 歌曲评论
        hotComments: [],
        // 动画播放状态
        isPlaying: false,
        // 遮罩层的显示状态
        isShow: false,
        // mv地址
        mvUrl: "",
        //歌词
        lyric:""
    },
    methods:{
        searchMusic:function(){
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords="+this.query)
            .then(function(response){
                //console.log(response.data.result.songs)
                that.musicList = response.data.result.songs;
            },function(err){
                console.log(err)
            })
        },
        //歌曲播放
        playMusic: function(musicId){
            //console.log(musicId)
            var that = this;
            axios.get("https://autumnfish.cn/song/url?id="+musicId)
            .then(function(response){
                console.log(response.data.data[0])
                that.musicUrl = response.data.data[0].url;
            },function(err){
                console.log(err)
            })

            //歌曲详情获取
            axios.get("https://autumnfish.cn/song/detail?ids="+musicId)
            .then(function(res){
                console.log(res.data.songs[0].name)
                that.songName=res.data.songs[0].name;
                that.musicCover = res.data.songs[0].al.picUrl;
                var box = document.getElementById("box");
                box.style.backgroundImage = "url("+that.musicCover+")";
            },function(err){
                console.log(err)
            })

            //歌曲评论获取
            axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicId)
            .then(function(response){
                //console.log(response.data.hotComments);
                that.hotComments = response.data.hotComments
            },function(err){
                console.log(err)
            })

            //歌曲歌词获取
            axios.get("https://autumnfish.cn/lyric?id="+musicId).then(function(response){
                that.lyric = response.data.lrc.lyric.split("\n");
            }).catch(function(error){
                console.log(error);
            });
        },
        //播放
        musicPlay: function(){
            //console.log("play")
            this.isPlaying = true;
        },
        //暂停
        musicPause: function(){
            //console.log("pause")
            this.isPlaying = false;
        },
        //播放mv
        playMv:function(mvId){
            var that = this
            axios.get("https://autumnfish.cn/mv/url?id="+mvId)
            .then(function(res){
                console.log(res.data.data.url)
                that.isShow = true;
                that.mvUrl = res.data.data.url;
            },function(res){
                console.log(err)
            })
        },
        //mv消失
        closeMv:function(){
            this.mvUrl = "";
            this.isShow = false;
        }
    }
})