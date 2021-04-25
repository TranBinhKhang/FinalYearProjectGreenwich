const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { array, x, boolean } = require('joi');
const { TabRouter } = require('@react-navigation/routers');
mongoose.connect('mongodb+srv://Kang:Kang123@englishcluster.uecjh.mongodb.net/test?retryWrites=true&w=majority')
.then(() => console.log('Successfully connected to online database. Amazing goodjob em.'))
.catch(error => console.error('Unable to connect. This app is a failure, just like your life.'));

if (!config.get('jwtPrivateKey')) {
console.error('CRITICAL ERROR: NUCLEAR PAYLOAD WILL DETONATE. just kidding you forgot to set private key or something');
process.exit(1);
}

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({ limit: '5000000mb' }))
app.use(bodyParser.urlencoded({
  limit: '5000000mb',
  extended: false,
}));
app.use(express.json());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Backend server live on " + port));

//=====================authorization=========================//

function authorization(req, res, next){ //This is not used, but I leave it here to prove that I know how to authorize with token. I lack the time needed to get the token working properly from the frontend, so I have to disable it for now.
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Unauthorized action.');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next()
    }
    catch{
        res.status(400).send('invalid token')
    }
}

function isadmin(req, res, next){
    console.log(req.user.isAdmin)
    if (!(req.user.isAdmin)) return res.status(403).send(req.user.isAdmin);
        next();
    }


//============================USER SCHEMA===============================//

var userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    watchedMovie: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
     }],
     completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
     }],
     isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
});

//============================USER SCHEMA===============================//

//============================LESSON SCHEMA===============================//

var lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comment:  { // Comment originally had its own schema, but then I thought 'why bother?' and store it as JSON instead
        type: Array,
        required: true, //Although it says true, it's actually false because the app will always generate an empty comment if it's null
    },
    tests: {
        type: Array,
        required: true,
        default: [ //Add some default question here to prevent crash. The end user won't see this. Hopefully.
            { 
            "question": "Test question. If you see this something is wrong", 
            "answers": [
                    {"text": "ok1", "isCorrect": false},
                    {"text": "ok2", "isCorrect": false},
                    {"text": "ok3", "isCorrect": false},
                    {"text": "ok4", "isCorrect": false},
                    ]
            },
            {
            "question": "Another test question. If you see this something is wrong", 
            "answers": [
                {"text": "ok1", "isCorrect": false},
                {"text": "ok2", "isCorrect": false},
                {"text": "ok3", "isCorrect": false},
                {"text": "ok4", "isCorrect": false},
                ]
            }
        ],
    }   
});

var commentSchema = new mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
     },
    comment: String,
    date: Date,
})

var Comment = mongoose.model('Comment', commentSchema);


//============================CLIP AND MOVIE SCHEMA===============================//

var clipSchema = new mongoose.Schema({
    clipName: String,
    content: String,
    data: String,
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: false,
     },
})

var Clip = mongoose.model('Clip', clipSchema);

var reportSchema = new mongoose.Schema({
    lessonId: { //the reference isn't actually needed. I just put it here so that the ERD would look nicer. Mongo doesn't need actual connection between different table.
        type: mongoose.Schema.Types.ObjectId, //in case you are wondering why it references lessonId, all comments are stored in lessons
        ref: 'Lesson',
        required: false,
     },
    userId: { //Likewise for user id.
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false,
     },
    userName: String,
    commentId: String,
    comment: String,
    isReply: Boolean, //These are not real data. They are just there to make some other functions work.
    parentId: {  //Same as above. Used to delete reply from database because replies are attached to a parent comment
        type: String, 
        required: false,
     },
})

var Report = mongoose.model('Report', reportSchema);


var movieSchema = new mongoose.Schema({
    movieName: String,
    desc: String,
    genre: String,
    image: String,
    clips: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clip'
    } ]
});

var Movie = mongoose.model('Movie', movieSchema);

var Lesson = mongoose.model('Lesson', lessonSchema);


//============================SCHEMA===============================//

//============================TEST FUNCTIONS===============================//

var User = mongoose.model('User', userSchema);

async function addUserTest(email, password, userName){ //this is a test function
    const user = new User({
        email: email,
        password: password,
        userName: userName
    });
    const result = await user.save();
    console.log(result);
    };  
    
    app.get('/api/', (req, res) => {
        res.send('successfully loaded')
       });

    async function createClip(clipName, content, data, lessonId) {
        const clip = new Clip({
            clipName,
            content,
            data,
            lessonId
        });
        const result = await clip.save();
    };
    
    async function createMovie(movieName, desc, clips) {
        const movie = new Movie({
            movieName,
            desc,
            clips
        });
        const result = await movie.save();
    
    };

    async function createLesson(name, content, movies) {
        const lesson = new Lesson({
            name,
            content,
            movies
        });
        const result = await lesson.save();
    };

    // createLesson('Abstract noun', 'This is noun that is abstract');
    // createLesson('Collective noun', 'This is noun that refers to something that is collective');
    // createLesson('Countable and uncountable noun', 'This is noun that is countable and uncountable');

    async function listMovies() {
        const movies = await Movie
        .findById('603b5e97346d130a044d3257')
        .populate('clips', '-_id')
        .select('movieName desc clips');
        console.log(movies);
        const inside = movies.populated('clips');
        console.log(inside);
    }

    async function updateUser(userId) {
        const userUpdate = await User.findById(userId);
        // userUpdate.watchedMovie = ['603c8a635c38680ac4116791', '60424970e5f9290bd086e8c1', '60424afa08dfc33f2010363b'];
        userUpdate.watchedMovie.push('6047769e63591810fc182a05');
        userUpdate.save();
    }

    // async function updateMovie(movieId) {
    //     const movieUpdate = await Lesson.findById(movieId);
    //     movieUpdate.comment = [];
    //     movieUpdate.save();
    // }

    // updateMovie('603b5d509726322014c7475e')

    // async function updateMovie(movieId) {
    //     const movieUpdate = await Movie.findById(movieId);
    //     movieUpdate.clips = ['60424646d529bb2bc812f3c6', '603c834eccb3bb106c687701', '603c834eccb3bb106c687700', '603c834eccb3bb106c6876ff'];
    //     movieUpdate.save();
    // }

    async function updateLesson(stuff) {
        const lessonUpdate = await Lesson.findById(movieId);
        movieUpdate.clips = ['60424646d529bb2bc812f3c6', '603c834eccb3bb106c687701', '603c834eccb3bb106c687700', '603c834eccb3bb106c6876ff'];
        movieUpdate.save();
    }


    // updateMovie('603c8a635c38680ac4116791');

    async function listUserMovies() {
        const userMovie = await User
        .findById('603b5fbae2693b4280cd49e7')
        .populate({ path: 'watchedMovie', populate: { path: 'watchedMovie.clips' }});
        const test = userMovie.populated('clips');
        console.log(userMovie);
        // if (test) {
        //     console.log('test is truthy!');
        //   }
        console.log(test);
    };

    app.post("/api/clips", async (req, res) => {
        const userMovie = await User
        .findById(req.body.userId)
        .populate({ 
            path: 'watchedMovie',
            model: 'Movie',
            populate: {
                path: 'clips',
                model: 'Clip'
            }
        });
        var merged = []; // merge all the clips arrays in watchedMovie into one arrays
            for (var i = 0; i < userMovie.watchedMovie.length; i++) {
                merged = merged.concat(userMovie.watchedMovie[i].clips);
            }
        var duplicate = [merged[0]]; //remove all the duplicate because concat causes duplicates
            for (var i=1; i< merged.length; i++) {
               if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);
            }
        var finalresult = [];
        for (let i = 0; i < duplicate.length; i++) {
            // console.log(duplicate[i].lessonId.toString() === '603b5d509726322014c7475e');
            if (duplicate[i].lessonId.toString() === req.body.lessonId) {
                finalresult.push(duplicate[i]);
                console.log('logged', duplicate[i].lessonId);
            }
        }
        const dummyData = [ //null response crashes the app. Sending dummy data to prevent this.
            {_id: "41224d776a326fb40f000001", //this id is a fake id.
            clipName: "You have watched no movie related to this lesson",
            content: "Please add some movies on Movie List below",
            data: "https://res.cloudinary.com/daekmobzf/video/upload/v1618218015/yt1s.com_-_video_placeholder_v144P_sgs82l.mp4", //this is free sample video
            lessonId: "41224d776a326fb40f000001",
            __v: 0}
        ]
        res.send(finalresult.length === 0 ? dummyData : finalresult) //if finalresult is empty, sending dummy data instead
      });
    
    // listUserMovies();

    // updateUser('603b5fbae2693b4280cd49e7');

    // listMovies();

    // createClip('Avenger Adjective 18', 'Thor describes Erik using the adjective good', 'data', '603b5d509726322014c7475e');
    // createClip('Avenger Adjective 19', 'Iron Man describe Coulson using the adjective good', 'data', '603b5d509726322014c7475e');
    // createClip('Avenger Adjective 20', 'Iron Man describe Coulson using the adjective good', 'data', '603b5d509726322014c7475e');



    // createMovie('The Great Chungus', 'BIG BIG CHENGUS BIG CHENGUS', ['60434ae93ba4f942f091f1a9', '6043830c9222ff43c0d8c1d8', '604383ba9222ff43c0d8c1d9', '6043844f9222ff43c0d8c1da', '6043857f9222ff43c0d8c1dc']);
    // createMovie('Avenger 11', 'Earth heroes and shit', ['60366a22bce5580be40345f5', '60366a22bce5580be40345f5', '60366a22bce5580be40345f5']);

//============================TEST FUNCTIONS===============================//

//============================REGISTER NEW ACCOUNT===============================//

    const registerSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        userName: Joi.string().required().min(1),
      });

    app.post('/api/register', async (req, res) =>{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);


        let user = new User({
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName,
        });
        console.log(user);

        const validation = registerSchema.validate(req.body);

        let emailExist = await User.findOne({ email: req.body.email });
            if (!emailExist && !(validation.error)) 
            {
            const result = await user.save();
            const token = jwt.sign({ _id: user._id, email: user.email, userName: user.userName, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
            res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token').send({
                _id: user._id,
                email: user.email,
                userName: user.userName,
                isAdmin: user.isAdmin
            });
            }
            else{
            return res.status(400).send('Big error');
            }
    });
    //============================REGISTER NEW ACCOUNT END===============================//


    //============================    authen ACCOUNT   ===============================//

    const authSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
      });

    app.post('/api/auth', async (req, res) =>{
        console.log(req.body)
        const validation = authSchema.validate(req.body);
        if (validation.error) return res.status(400).send('invalid username or password');
        let userExist = await User.findOne({ email: req.body.email });
        if (!userExist) return res.status(400).send('Invalid email or password');
        const valid = await bcrypt.compare(req.body.password, userExist.password);
        if (!valid) return res.status(400).send('Invalid email or password');
        const token = jwt.sign({ _id: userExist._id, email: userExist.email, userName: userExist.userName, isAdmin: userExist.isAdmin }, config.get('jwtPrivateKey'));
        res.send(token);
    });

  //============================FETCHING DATA===============================//

  app.post("/api/comment", async (req, res) => { //very straightfoward, it just send all comments from a lesson to frontend
    try {
    const comment = await Lesson.findById(req.body._id).select('comment')
    const comments = comment.comment.map(c => ({...c, showChild: false, showOptions: false, 
        showReply: false, replyCount: c.childComment ? c.childComment.length : 0})); //showChild and showReply are needed for a function in the frontend to work. All comments are rendered dynamically, so it's not possible to use state to show child comments.
    
    for (i=0; i < comments.length; i++){
        if (!comments[i].childComment) comments[i].childComment = []; //If the childComment field is null, the app will crash if someone presses the 'show replies' button in the frontend. This is meant to add an empty array so the app won't crash.
        if (comments[i].childComment !== []) comments[i].childComment.map(c => c.showOptions = false);
    }
    res.send(comments);}
    catch {
        res.send('No comment')
    }
  });

  app.get("/api/report", async (req, res) => {
    try {

    const report = await Report.find().populate('userId')

    res.send(report);
}

    catch {
        res.send('No report')
    }
  });


  app.post("/api/completedlessonlist", async (req, res) => { //very straightfoward, it just send all lessons to frontend
    const lesson = await User.find({ _id: req.body.userId});
    res.send(lesson[0].completedLessons);
  });

  app.get("/api/lesson", async (req, res) => { //very straightfoward, it just send all lessons to frontend
    const lesson = await Lesson.find();
    res.send(lesson);
  });

  app.post("/api/lessontest", async (req, res) => { //It sends all the tests of a lesson to the frontend
    const lesson = await Lesson.findById(req.body._id).select('tests'); //_id is the id of a lesson
    res.send(lesson.tests);
  });

  app.get("/api/cliplist", async (req, res) => {
    const clip = await Clip.find().select('clipName content lessonId data').populate('lessonId', {name: 1, _id: 1});
    
    for (let i = 0; i < clip.length; i++) { //There are some object with null lessonId. 
        if (!clip[i].lessonId) {            //This code will replace any null value with this string.
                                            //This is important because there are things in the frontend that uses lessonId, and there will be error if it's null
            clip[i].lessonId = { name: 'No lesson selected'}; 
        }
      }
    res.send(clip);
  });

  app.post("/api/clipcurrentlesson", async (req, res) => {
    const clip = await Clip.find({ _id: req.body._id}).select('lessonId').populate('lessonId', {name: 1, _id: 1});
    res.send(clip[0].lessonId);
  });

  app.get("/api/nolessonlist", async (req, res) => {
    const clip = await Clip.find({ lessonId: '41224d776a326fb40f000001' });
    res.send(clip);
  });

  app.post("/api/fetchmovieclip", async (req, res) => { //It sends all the clips associated with a selected movie to the frontend
    const movie = await Movie.find({ _id: req.body._id})
    // .select('clipName content lessonId data')
    .populate('clips', {clipName: 1, _id: 1});
    res.send(movie[0].clips);
  });

  app.post("/api/fetchlessonclip", async (req, res) => { //It sends all the clips associated with a selected movie to the frontend
    const clip = await Clip.find({ lessonId: req.body._id});
    // .select('clipName content lessonId data')
    res.send(clip);
  });


  app.get("/api/movielist", async (req, res) => {
    // const movie = await Movie.find().select('clipName content lessonId data').populate('lessonId', {name: 1, _id: 1});
    // res.send(clip);
        const movies = await Movie.find()
        // .findById('6047769e63591810fc182a05')
        .populate('clips')
        .select('movieName desc clips genre image');
        // console.log(movies);
        // const inside = movies.populated('clips');
        // console.log(inside);
        res.send(movies);
  });

  app.post("/api/fetchmovielesson", async (req, res) => { //It sends all of the lessons associated with a movie
    const movie = await Movie.find({ _id: req.body._id})
    .populate({ 
        path: 'clips',
        model: 'Clip',
        populate: {
            path: 'lessonId',
            model: 'Lesson'
        }
    });

    clips = movie[0].clips;

    const lessonList = []
    for (i = 0; i < clips.length; i++) {
        lessonList.push(clips[i].lessonId.name)
    }       
    var duplicate = [lessonList[0]]; //remove all the duplicate
            for (var i=1; i< lessonList.length; i++) {
               if (lessonList[i]!=lessonList[i-1]) duplicate.push(lessonList[i]);
            }

    res.send(duplicate);
  });

 //============================CATEGORY FILTER===============================//  
 app.post("/api/moviefilter", async (req, res) => {
    // const movie = await Movie.find().select('clipName content lessonId data').populate('lessonId', {name: 1, _id: 1});
    // res.send(clip);
        const movies = await Movie.find({ genre: req.body.genre })
        // .findById('6047769e63591810fc182a05')
        .populate('clips', '-_id')
        .select('movieName desc clips genre image');
        // console.log(movies);
        // const inside = movies.populated('clips');
        // console.log(inside);
        res.send(movies);
        console.log('Sent')
  });
  


//============================UPLOAD CLIP/MOVIE/COMMENT/REPORT===============================//

app.post("/api/postreport", async (req, res) => { 

    let report = new Report({
        lessonId: req.body.lessonId,
        userName: req.body.userName,
        userId: req.body.userId,
        commentId: req.body.commentId,
        comment: req.body.comment,
        isReply: req.body.isReply,
        parentId: req.body.parentId
    });

    let flag = await Lesson.findById(req.body.lessonId).select('comment');
    for (i=0; i < flag.comment.length; i++){
        if (flag.comment[i]._id == req.body.commentId) flag.comment[i].flagged = true; // flag the comment
        if (!flag.comment[i].childComment) flag.comment[i].childComment = []; //Add an empty childComment field if the comment doesn't have it. Very important because the line below needs it
        if (flag.comment[i].childComment !== []) flag.comment[i].childComment.map(c => {if (c._id == req.body.commentId) c.flagged = true}); //Flag the reply attached to a comment
    }
    flag.markModified('comment');
    await flag.save();
    await report.save();
    res.send(flag.comment[0]);
  });

  app.post("/api/dismissreport", async (req, res) => { 

    let deleteReport = await Report.findOne({ _id: req.body.reportId});
    deleteReport.remove();
    res.send('deleted ' + req.body.reportId)


    let flag = await Lesson.findById(req.body.lessonId).select('comment');
    for (i=0; i < flag.comment.length; i++){
        if (flag.comment[i]._id == req.body.commentId) flag.comment[i].flagged = false; // flag the comment
        if (!flag.comment[i].childComment) flag.comment[i].childComment = []; //Add an empty childComment field if the comment doesn't have it. Very important because the line below needs it
        if (flag.comment[i].childComment !== []) flag.comment[i].childComment.map(c => {if (c._id == req.body.commentId) c.flagged = false}); //Flag the reply attached to a comment
    }
    flag.markModified('comment');
    await flag.save();

    res.send('deleted ' + req.body.reportId);
  });


app.post("/api/postcomment", async (req, res) => { 
    const comment = await Lesson.findById(req.body.lessonId).select('comment');

    const newComment = {
        _id: new mongoose.Types.ObjectId, 
        userName: req.body.userName,
        postedAt: new Date().toISOString().split('T')[0],
        userId: req.body.userId, 
        comment: req.body.comment,
    }

    comment.comment.push(newComment);
    comment.save();
    res.send(comment.comment);
  });

  app.post("/api/replycomment", async (req, res) => { 
    const comment = await Lesson.findById(req.body.lessonId).select('comment'); //get all comments in a lesson
    const replyTo = comment.comment.findIndex(x => x._id == req.body.commentId); //get the index of the comment that you want to reply to
    const replyComment = { //content of the repy
        _id: new mongoose.Types.ObjectId, 
        userName: req.body.userName,
        postedAt: new Date().toISOString().split('T')[0],
        userId: req.body.userId, 
        comment: req.body.comment,
    }

    if (!comment.comment[replyTo].childComment) comment.comment[replyTo].childComment = []; //some comments don't have replies. This creates an empty field that stores replies

    comment.comment[replyTo].childComment.push(replyComment); //push the new comment in the comment that you want to reply to
    comment.markModified('comment'); //for some reason, changing an array doesn't qualify as change in Mongoose's eye, so I have to put this line of code here for it to register the change. This is necessary because mongoose won't save if it thinks no change has been made
    res.send(comment);
    await comment.save();
  });

app.post('/api/uploadclip', async (req, res) =>{
    let newClip = new Clip({
        clipName: req.body.clipName,
        content: req.body.content,
        data: req.body.data,
        lessonId: req.body.lessonId
    });
    await newClip.save();
    res.send(newClip);
});

app.post('/api/uploadmovie', async (req, res) =>{
    res.send(req.body)
    let newMovie = new Movie({
        movieName: req.body.movieName,
        desc: req.body.desc,
        clips: req.body.clips,
        image: req.body.image,
        genre: req.body.genre
    });
    await newMovie.save();
    res.send(newMovie);

});

app.post('/api/uploadlesson', async (req, res) =>{ //adding a new lesson is very different from adding other things.
    let newLesson = new Lesson({                   //what clips are associated with lessons cannot be set from the lesson table.
        _id: new mongoose.Types.ObjectId(),        //it has to be set from the clip table.
        name: req.body.name,                       //I have no idea what I'm even saying
        content: req.body.content,
        tests: req.body.tests
    })
    newLesson.save();
    let cliparray = req.body.cliparray;
    for (let i = 0; i < cliparray.length; i++) {  //This basically replace the lessonId in the chosen clip with the _id of the newly created lesson
        const clip = await Clip.findById(cliparray[i]);
        clip.lessonId = newLesson._id
        clip.save();
    }
    res.send(newLesson);
}
)

//============================Update CLIP===============================//

app.post('/api/updateclip', async (req, res) =>{
    let updateClip = await Clip.findOne({ _id: req.body._id});
    
    if (req.body.clipName){
    updateClip.clipName = req.body.clipName;}

    if (req.body.content){
        updateClip.content = req.body.content;}

    if (req.body.data){
        updateClip.data = req.body.data;}

    if (req.body.lessonId){
        updateClip.lessonId = req.body.lessonId;}

    res.send(updateClip);
    await updateClip.save();

}
)

//============================Update MOVIE===============================//
app.post('/api/updatemovie', async (req, res) =>{
    let updateMovie = await Movie.findOne({ _id: req.body._id});
    
    if (req.body.movieName){
        updateMovie.movieName = req.body.movieName;}

    if (req.body.desc){
        updateMovie.desc = req.body.desc;}

    if (req.body.image){
        updateMovie.image = req.body.image;}

    if (req.body.genre){
    updateMovie.genre = req.body.genre;}
    res.send(updateMovie);
    await updateMovie.save();

}
)

app.post('/api/updatemoviepicture', async (req, res) =>{
    let updatePicture = await Movie.findOne({ _id: req.body._id});
    // updatePicture.image = res.body.image;
    // await updatePicture.save();
    updatePicture.image = req.body.image;
    updatePicture.save();
    res.send(updatePicture);
}
)

//==============================Update lesson===================//

app.post('/api/updatelesson', async (req, res) =>{
    let updatedLesson = await Lesson.findOne({ _id: req.body._id});
    
    if (req.body.name){
        updatedLesson.name = req.body.name;}

    if (req.body.content){
        updatedLesson.content = req.body.content;}

    if (req.body.tests){
        updatedLesson.tests = req.body.tests
    }

    res.send(updatedLesson);
    await updatedLesson.save();

}
)

//==============================Update tests===================//

app.post('/api/updatetest', async (req, res) =>{
    let updateTest = await Lesson.findOne({ _id: req.body._id});

    updateTest.tests = req.body.tests

    res.send(updateTest);
    await updateTest.save();

}
)


//============================Add more clip to lesson====================//
app.post('/api/addcliplesson', async (req, res) =>{
    const clip = await Clip.findById(req.body._id);
    clip.lessonId = req.body.lessonId
    clip.save();
    res.send(clip);
}
)


app.post('/api/removecliplesson', async (req, res) =>{
    const clip = await Clip.findById(req.body._id);
    clip.lessonId = '41224d776a326fb40f000001'
    clip.save();
    res.send(clip);
}
)

//============================Add and delete clip in movie====================//

app.post('/api/addclip', async (req, res) =>{
    const movieUpdate = await Movie.findById(req.body.movieId);
    movieUpdate.clips.push(req.body.clipId);
    movieUpdate.save();
    res.send(movieUpdate);
}
)

app.post('/api/removeclip', async (req, res) =>{
    const movieUpdate = await Movie.findById(req.body.movieId);
    const removedclip = movieUpdate.clips;
    for (let i = 0; i < removedclip.length; i++) {
        if (removedclip[i] == req.body.clipId) {
            removedclip.splice(i, 1);
        }
      }

    // removedclip.splice(5, 1);
    
      movieUpdate.save();

    res.send(movieUpdate);
    
}
)



//============================Delete Things===============================//

app.post('/api/deleteclip', async (req, res) =>{
    let deleteClip = await Clip.findOne({ _id: req.body._id});
    deleteClip.remove();
    res.send('deleted ' + req.body._id)
}
)

app.post('/api/deletemovie', async (req, res) =>{
    let deleteMovie = await Movie.findOne({ _id: req.body._id});
    deleteMovie.remove();
    res.send('deleted ' + req.body._id)
}
)

app.post('/api/deletelesson', async (req, res) =>{
    let deleteLesson = await Lesson.findOne({ _id: req.body._id});
    deleteLesson.remove();
    res.send('deleted ' + req.body._id)
}
)

app.post('/api/deletemaincomment', async (req, res) =>{
    const comment = await Lesson.findById(req.body.lessonId);
    const removedcomment = comment.comment;
    for (let i = 0; i < removedcomment.length; i++) {
        if (removedcomment[i]._id == req.body.commentId) {
            removedcomment.splice(i, 1);
        }
    }
    comment.save();
    res.send(removedcomment);  
}
)

app.post('/api/deletereply', async (req, res) =>{
    const comment = await Lesson.findById(req.body.lessonId).select('comment'); //get all comments in a lesson
    const replyTo = comment.comment.findIndex(x => x._id == req.body.commentId); //get the index of the parent comment of the reply you want to delete

    if (!comment.comment[replyTo].childComment) return res.send('Reply does not exist'); //some comments don't have replies. This creates an empty field that stores replies

 //push the new comment in the comment that you want to reply to
    

    for (let i = 0; i < comment.comment[replyTo].childComment.length; i++) {
        if (comment.comment[replyTo].childComment[i]._id == req.body.replyId) {
            comment.comment[replyTo].childComment.splice(i, 1);
        }
      }
    
    
    comment.markModified('comment'); //for some reason, changing an array doesn't qualify as change in Mongoose's eye, so I have to put this line of code here for it to register the change. This is necessary because mongoose won't save if it thinks no change has been made
    res.send(comment);
    await comment.save();
}
)

//============================Post score===============================//

app.post('/api/completelesson', async (req, res) =>{ //
    let completed = await User.findOne({ _id: req.body.userId });
    if (completed.completedLessons.some(lesson => lesson._id == req.body.lessonId)) return res.send(true); 
    else {
        completed.completedLessons.push(req.body.lessonId);
        res.send(false);
        await completed.save();
    }

}
)




//===========================Get account info===================//

// app.get("/api/me", authorization, async (req, res) => {
//     const user = await User.findById(req.user._id).select("-password");
//     res.send(user);
//   });

app.post("/api/me", async (req, res) => { //this was originally going to require an auth token, but the token has been decoded in the frontend the moment it is sent, and encrypting it again is too much trouble. So I have to use this method instead. Less secure, but functional for now.
    const user = await User.findById(req.body._id).populate('watchedMovie').select("-password");
    res.send(user);
  });

  app.get("/api/me2", [authorization, isadmin], async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  });

  app.post("/api/ban", async (req, res) => {
    const user = await User.findById(req.body._id);
    user.isBanned = !user.isBanned;
    user.save();
    res.send(user);
  });

  app.post("/api/addmovie", async (req, res) => {
    const user = await User.findById(req.body._id);
    user.watchedMovie.push(req.body.movieId);
    user.save();
    res.send(user);
  });

  app.post("/api/removemovie", async (req, res) => {
    const user = await User.findById(req.body._id);
    for (let i = 0; i < user.watchedMovie.length; i++) {
        if (user.watchedMovie[i] == req.body.movieId) {
            user.watchedMovie.splice(i, 1);
        }
      }
    user.save();
    res.send(user);
  });




  app.post("/api/getusermovie", async (req, res) => {
    const user = await User.findById(req.body._id);
    res.send(user.watchedMovie);
  });
  

  app.post('/api/updateuser', async (req, res) =>{

    const user = await User.findById(req.body._id);
    
    if (req.body.userName){
        user.userName = req.body.userName;}

    if (req.body.email){
        user.email = req.body.email;}

    if (req.body.password && req.body.newpassword) {
        const valid = await bcrypt.compare(req.body.password, user.password);
        const salt = await bcrypt.genSalt(10);
        req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
        valid ? user.password = req.body.newpassword : console.log('wrong password');
    }

    res.send(user);
    await user.save();

}
)
    

    //addUserTest('testemail@gmail.com', '12345', 'testman');
    
    

    

    