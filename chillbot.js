console.log('Initializing bot');
var Bot = require('ttapi');
try {
    config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
} catch(e) {
    console.log(e);
    console.log('Ensure that config.json is present in this directory.');
    process.exit(0);
}

var bot = new Bot(config.botinfo.auth, config.botinfo.userid);

var usersList = {};

var lastSeen = {};

// DJs currently on stage
var djs = new Array();

// DJs waiting to spin
var djQueue = new Array();

//Current song info
var currentsong = {
    artist: null,
    so        ng: null,
    djname: null,
    djid: null,
    up: 0,
    down: 0,
    listeners: 0,
    snags: 0};

bot.on('ready', function (data) {
    bot.roomRegister(config.roomid);
});

bot.on('roomChanged', function(data) {
    //Fill currentsong array with room data
    if ((data.room != null) && (data.room.metadata != null)) {
        if (data.room.metadata.current_song != null) {
            populateSongData(data);
        }

        //Creates the dj list
        for (i in data.room.metadata.djs) {
            djs.push({id: data.room.metadata.djs[i]});
        }
    }
});

bot.on('roomChanged', function (data) {
       djs = data.room.metadata.djs;
});
bot.on('add_dj', function (data) {
       djs.push({id:data.user[0].userid});
});
bot.on('rem_dj', function (data) {
    for (i in djs) {
        if (djs[i].id == data.user[0].userid) {
            djs.splice(i, 1);
        }
    }
});

justSaw = function (uid) {
       return lastSeen[uid] = Date.now();
};

function populateSongData(data) {
    currentsong.artist = data.room.metadata.current_song.metadata.artist;
    currentsong.song = data.room.metadata.current_song.metadata.song;
    currentsong.djname = data.room.metadata.current_song.djnam  e;
    currentsong.djid = data.room.metadata.current_song.djid;
    currentsong.up = data.room.metadata.upvotes;
    currentsong.down = data.room.metadata.downvotes;
    currentsong.listeners = data.room.metadata.listeners;
    currentsong.started = data.room.metadata.current_song.starttime;
    currentsong.snags = 0;
}

function admincheck(userid) {
    for (i in config.admins .admins) {
        if (userid == config.admins.admins[i]) {
            return true;
                                    }
    }
    return false;
}
