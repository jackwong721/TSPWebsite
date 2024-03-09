const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const cookieSession = require('cookie-session')
const path = require('path')

const distanceMatrixRouter = require('./routes/distanceMatrix.router')
const userRouter = require('./routes/user.router')
const historyRouter = require('./routes/history.router')

const { createNewUser, checkExistingUserID } = require('./models/userInfor.model')

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
}

async function verifyCallback(accessToken, refreshToken, profile, done){
    console.log('Google profile', profile)
    const userProfile = profile
    const userID = userProfile.id
    const userEmail = userProfile.emails[0].value

    if (userProfile){
        const existsUser = await checkExistingUserID(userID)

        if (!existsUser){
            console.log('No existing user')
            await createNewUser(userID, userEmail)
        } else {
            console.log('Existed user')
        }
    }

    done(null, profile) //First parameter: If fail
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))


// Save the session to the cookie
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Read the session from the cookie
passport.deserializeUser((id, done) => {
    done(null, id)
})

const app = express()
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60* 1000, //in milesecond (1day)
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2] // secret key (better with at least two keys)
}))

app.use(passport.initialize())
app.use(passport.session())

function checkLoggedIn (req, res, next) {
    console.log('Current user is:', req.user)
    const isLoggedIn = req.isAuthenticated() && req.user

    if (!isLoggedIn) {
        return res.status(401).json({"Error": "Unauthorised login"})
    }
    next()
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});



app.get('/auth/google', (req, res) => {
    const options = {
      scope: ['email'],
      // Additional options can be added here as needed
    };
  
    // Manually invoke the passport.authenticate function to get the URL
    const authUrl = passport.authenticate('google', options)(req, res);
  
    // Send the URL back to the front-end
    res.send({ authUrl });
})


app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure', //Direct to failure page
        successRedirect: '/', //Direct to success page
        session: true,
    }), (req, res) => {
        console.log('Google called us back!')
    }
) //passport.authenticate will help us to pass the authentication code to authentication server.

app.get('/auth/logout', (req, res) => {
    req.logout() //Remove req.user and clears any logged in session
    return res.redirect('/')
})

app.get('/failure', (req, res) => {
    return res.send('Failed to log in!')
})

app.use('/history', checkLoggedIn, historyRouter)

app.use('/route', checkLoggedIn, distanceMatrixRouter)

app.use('/user', checkLoggedIn, userRouter)


module.exports = app