const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const result = await db.user.find_user_by_username(username)
        const existingUser = result[0]

        if(existingUser) {
            return res.status(409).send('Username already taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const registeredUser = await db.user.create_user(username, hash, `https://robohash.org/${username}.png`)
        const newUser = registeredUser[0]
        
        req.session.user = newUser

        return res.status(200).send(newUser)
    },

    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        console.log(username, password)
        const result = await db.user.find_user_by_username(username)
        const existingUser = result[0]
        console.log(existingUser)
        if(!existingUser) {
            return res.status(401).send('User not found. Please register as a new user.')
        }

        const isAuth = bcrypt.compareSync(password, existingUser.password)

        if(!isAuth) {
            return res.status(403).send('Incorrect password')
        }
        console.log(existingUser)
        req.session.user = existingUser
        console.log(req.session.user)
        return res.status(200).send(existingUser)
    },

    getUser: async (req, res) => {
        if(!req.session.user) {
            res.sendStatus(404)
        }

        res.status(200).send(req.session.user)
    },

    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}