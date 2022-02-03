const moment = require("moment")

const formatMessage = (username, text) => {
    return {
        username,
        text,
        created_at: moment().format('h:mm A')
    }
}

module.exports = formatMessage