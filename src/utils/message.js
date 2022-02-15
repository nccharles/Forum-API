import moment from "moment"

const formatMessage = (username, text) => {
    return {
        username,
        text,
        created_at: moment.utc().local().format('ddd DD MM,YY h:mm A')
    }
}

export default formatMessage