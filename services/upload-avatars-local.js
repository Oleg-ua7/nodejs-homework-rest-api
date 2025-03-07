const fs = require('fs/promises')
const path = require('path')
const Jimp = require('jimp')
const createFolderIsNotExist = require('../helpers/create-dir')

class Upload {
    constructor(AVATARS_OF_USERS) {
        this.AVATARS_OF_USERS = AVATARS_OF_USERS
    }

    async transformAvatar(pathFile) {
        const file = await Jimp.read(pathFile)
        await file.autocrop().cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).writeAsync(pathFile)
    }

    async saveAvatarToStatic({ idUser, pathFile, name, oldFile, }) {
        await this.transformAvatar(pathFile)
        const folserUserAvatar = path.join(this.AVATARS_OF_USERS, idUser)
        await createFolderIsNotExist(folserUserAvatar)
        await fs.rename(pathFile, path.join(folserUserAvatar, name))
        await this.deleteOldAvatar(path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile),
        )
        const avatarUrl = path.normalize(path.join(idUser, name))
        return avatarUrl
    }
    
    async deleteOldAvatar(pathFile) {
        try {
            await fs.unlink(pathFile)
        } catch (error) {
            console.error(error.message)
        }
    }
}

module.exports = Upload