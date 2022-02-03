import moment from "moment"

const formatMessage = (username, text) => {
    return {
        username,
        text,
        created_at: moment().format('h:mm A')
    }
}

export default formatMessage