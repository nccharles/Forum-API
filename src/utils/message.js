import moment from "moment"

const formatMessage = (username, text) => {
    return {
        username,
        text,
        created_at: moment().format('dd MM Y h:mm A')
    }
}

export default formatMessage