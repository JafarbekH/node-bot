const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()

app.use(express.json())

require("./bot/bot")

async function dev() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log("MONGO DB Connected"))
            .catch((error) => console.log(error))
            app.listen(process.env.PORT, () => {
                console.log(`Listening on port: ${process.env.PORT}`);
            })
    } catch (error) {}
}

dev()
