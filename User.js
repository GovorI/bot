const path = require('path')
const fs = require('fs').promises
require('dotenv').config()

class User {
    constructor(id, isAdmin, name, path, menuButtons, filesButtons) {
        this.id = id
        this.isAdmin = false || isAdmin
        this.name = name
        this.path = path
        this.menuButtons = menuButtons
        this.filesButtons = filesButtons
    }

    static async isAdminCreate() {
        try {
            const admin = await this.getUserById(process.env.ADMIN)
            if (admin) {
                // this.saveUser(admin.id, true, admin.name, admin.path, admin.menuButtons, admin.filesButtons)
                return true
            } else {
                await this.saveUser(process.env.ADMIN, true, 'name', '../data')
                return true
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getAll() {
        try {
            const data = await fs.readdir(
                path.join(__dirname, './users')
            )
            return data
        } catch (error) {
            console.error(error)
        }
    }

    static async saveUser(id, isAdmin, name, path, menuButtons, filesButtons) {
        try {
            await fs.writeFile(
                `./users/${id}.json`,
                JSON.stringify({
                    "id": id,
                    "isAdmin": isAdmin,
                    "name": name,
                    "path": path,
                    "menuButtons": menuButtons,
                    "filesButtons": filesButtons
                })
            )
            return true
        } catch (error) {
            console.error(error)
        }
    }

    static async getUserById(id) {
        try {
            const data = await fs.readFile(
                path.join(__dirname, `./users/${id}.json`),
            )
            return JSON.parse(data.toString())
        } catch (error) {
            console.error(error)
        }
    }

    static async deleteUser(userId) {
        try {
            await fs.unlink(
                path.join(__dirname, `./users/${userId}.json`)
            )
            return true
        } catch (error) {

        }
    }
}

module.exports = User