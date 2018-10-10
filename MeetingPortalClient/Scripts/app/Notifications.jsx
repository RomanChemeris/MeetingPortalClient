class RequestNotificationsList extends React.Component {
    render() {
        const notificationNodes = this.props.data.map((notification,i) => (
            <li key={i} className={"list-group-item " + (notification.Status ? "list-group-item-success" : "list-group-item-danger")}>
                {notification.CreatedTime.toString()}
                <div>Время бронирования: {notification.BookingTime}</div>
                <div>Название комнаты: {notification.RoomName}</div>
                <div>Название брони: {notification.RequestName}</div>
            </li>
        ));
        return (
            <ul className="list-group">
                {notificationNodes}
            </ul>
        );
    }
}

class RequestNotifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notificationRequests: [] };
    }
    componentDidMount() {
        this.loadRequestsFromServer();
        window.setInterval(() => this.loadRequestsFromServer(), this.props.pollInterval);
    }
    loadRequestsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'http://meetingportal.pvpve.ru/api/MeetingRooms/GetLastNotifications/', true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ notificationRequests: data });
        };
        xhr.send();
    }
    render() {
        return (
            <div className="animated fadeIn">
                <div className="jumbotron">
                    <h2>Оповещения</h2>
                    <RequestNotificationsList data={this.state.notificationRequests} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <RequestNotifications pollInterval="10000" />, document.getElementById('requestNotifications')
);