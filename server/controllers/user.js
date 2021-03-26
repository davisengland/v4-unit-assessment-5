const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const result = await db.find_user_by_username(username)
        const existingUser = result[0]

        if(existingUser) {
            return res.status(409).send('Username already taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const registeredUser = await db.create_user(username, hash, `https://robohash.org/${username}.png`)
        const newUser = registeredUser[0]

        req.session.user = newUser

        return res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        const foundUser = await db.find_user_by_username(username)
        const existingUser = foundUser[0]

        if(!existingUser) {
            return res.status(401).send('User not found. Please register as a new user.')
        }

        const isAuth = bcrypt.compareSync(password, existingUser.hash)

        if(!isAuth) {
            return res.status(403).send('Incorrect password')
        }

        req.session.user = existingUser

        return res.status(200).send(req.session.user)
    },

    getUser: async (req, res, next) => {
        if(!req.session.user) {
            res.sendStatus(404)
        }

        next()
    },

    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}