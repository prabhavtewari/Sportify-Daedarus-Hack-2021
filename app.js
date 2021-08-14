const env = require("./environment.js");
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Event = require('./models/event')
const User = require('./models/user')


const app = express();

const dbURI = env.MONGO_URI;
mongoose.connect(dbURI, {useNewUrlParser:true,useUnifiedTopology:true})
    .then((result)=> {
        console.log('Connected to DB');
        //listening
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));



//view engine
app.set('view engine','ejs')

app.use(express.static('public'));
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(morgan('dev'));

//icons

const thumbs = {
    Cricket: '<span class="material-icons">sports_cricket</span>',
     Football:'<i class="fas fa-futbol"></i>',
     Tennis:'<span class="material-icons">sports_tennis</span>',
     Badminton:'<img src="./icons/badminton.svg" alt="">',
     Volleyball:'<i class="fas fa-volleyball-ball"></i>',
     Basketball:'<i class="fas fa-basketball-ball"></i>',
     Hockey:'<span class="material-icons">sports_hockey</span>',
     Running:'<i class="fas fa-running"></i>',
     Workout:'<span class="material-icons">fitess_center</span>'
   };

//Sandbox routes
app.get('/add-event',(req,res)=>{
    const event = new Event({
        name: "DJPT",
        lat: 420,
        lng: 69,
        minpeeps: 911,
        activity: "Shitting",
        description: "Eeeeeeeeeee"
    });
    event.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
})

app.get('/all-events', (req, res)=>{
    Event.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
})

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/find',async (req,res)=>{
    let events;
    await Event.find()
        .then((result)=>{
            events=result;
        })
        .catch((err)=>{
            console.log(err);
        });
    res.render('find',{api_key:env.GOOGLE_API_KEY,events:events,fakey:env.FONT_KEY,thumbs:thumbs})
})

app.get('/event',(req,res)=>{
    res.render('event',{api_key:env.GOOGLE_API_KEY})
})

app.get('/details',(req,res)=>{
    res.render('details',{api_key:env.GOOGLE_API_KEY})
})

app.get('/login',(req,res)=>{
    res.render('login',{sawo_key:env.SAWO_KEY})
})

app.post('/add-user',async (req,res)=>{
    const {user_id,email} = req.body;
    try{
        const user = await User.login(user_id, email);
        res.send(user);
    }
    catch{
        const user = new User({
            user_id:user_id,
            email:email
        });
        user.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
    }
})