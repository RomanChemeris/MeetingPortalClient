class Modal extends React.Component {
    constructor(props) {
        super(props);
        var currentDate = new Date();
        currentDate.setMinutes(0);
        this.state = {
            date: currentDate,
            timeFrom: ("0" + (currentDate.getHours() + 1)).slice(-2) + ":00",
            timeTo: ("0" + (currentDate.getHours() + 2)).slice(-2) + ":00",
            name: ''
        };
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.sendBookingRequest = this.sendBookingRequest.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeTimeFrom = this.changeTimeFrom.bind(this);
        this.changeTimeTo = this.changeTimeTo.bind(this);
        this.changeName = this.changeName.bind(this);
    }
    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('show');
        $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
    }
    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('hide');
        handleModalCloseClick();
    }
    sendBookingRequest(e) {
        console.log(e.target.value);
    }
    changeDate(e) {
        this.setState({ date: e.toISOString() });
    }
    changeTimeFrom(e) {
        this.setState({ timeFrom: e.format("HH:mm") });
    }
    changeTimeTo(e) {
        this.setState({ timeTo: e.format("HH:mm") });
    }
    changeName(e) {
        this.setState({ name: e.target.value });
    }
    render() {
        return (
            <div>
                <div className="modal fade" ref={modal => this.modal = modal} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Бронирование комнаты {this.props
                                    .dataItem.Name}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label">Дата</label>
                                    <div className="col-sm-6">
                                        <Datetime locale="ru" timeFormat={false} onChange={this.changeDate} defaultValue={this.state.date} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label">Время начала</label>
                                    <div className="col-sm-6">
                                        <Datetime locale="ru" dateFormat={false} onChange={this.changeTimeFrom} defaultValue={this.state.timeFrom} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label">Время окончания</label>
                                    <div className="col-sm-6">
                                        <Datetime locale="ru" dateFormat={false} onChange={this.changeTimeTo} defaultValue={this.state.timeTo} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label">Название</label>
                                    <div className="col-sm-6">
                                        <input className="form-control" type="text" onChange={this.changeName} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.sendBookingRequest}>Забронировать</button>
                                <button type="button" className="btn btn-secondary" onClick={this.handleCloseClick}>Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class MeetingRoomInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomInfo: []
        };
        this.handleModalShowClick = this.handleModalShowClick.bind(this);
    }
    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'http://meetingportal.pvpve.ru/api/MeetingRooms/GetMeetingRoomInfo/' + this.props.data.Id, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ roomInfo: data });
        };
        xhr.send();
    }
    getIcon(b) {
        if (b) {
            return <i className="fa fa-check text-success" />;
        }
        return <i className="fa fa-times text-danger" />;
    }
    handleModalShowClick(e) {
        this.props.onShowBooking(e);
    }
    render() {
        const infoNodes = this.state.roomInfo.map((node, i) => (
            <div key={i}>
                {node.BookingTime} {node.Name}
            </div>
        ));
        return (
            <div className="animated fadeIn">
                <div>
                    Проектор: {this.getIcon(this.props.data.HaveProjector)}
                </div>
                <div>
                    Маркерная доска: {this.getIcon(this.props.data.HaveMarkerBoard)}
                </div>
                {infoNodes.length > 0 ? "Зарезервированное время:" : ""}
                {infoNodes}
                <div>
                    <button className="btn btn-primary" onClick={() => this.handleModalShowClick(this.props.data)}>
                        Забронировать
                    </button>
                </div>
            </div>
        );
    }
}

class MeetingTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDescription: true,
            room: this.props.data
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleModalShowClick = this.handleModalShowClick.bind(this);
    }
    handleModalShowClick(e) {
        this.props.onShowBooking(e);
    }
    handleToggleClick() {
        this.setState(state => ({
            showDescription: !state.showDescription
        }));
    }
    clockIcon(val) {
        if (!val) {
            return null;
        }
        return <i className="fa fa-clock-o" aria-hidden="true" />;
    }
    projectorIcon(val) {
        if (!val) {
            return null;
        }
        return <i className="fa fa-video-camera fa-3x" title="Проектор" aria-hidden="true" />;
    }
    markerBoardIcon(val) {
        if (!val) {
            return null;
        }
        return (<i className="fa fa-square-o fa-3x" title="Маркерная доска" aria-hidden="true" />);
    }
    render() {
        return (
            <div className="list-group-item">
                <a key={this.state.room.Id} onClick={this.handleToggleClick} href="#" className="list-group-item-action flex-column align-items-start meetingRoom-item">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">Комната {this.state.room.Name}</h5>
                        <small>
                            {this.projectorIcon(this.state.room.HaveProjector)}
                            {this.markerBoardIcon(this.state.room.HaveMarkerBoard)}
                        </small>
                    </div>
                    <p className="mb-1">
                        Количество мест: {this.state.room.NumberOfChair}
                    </p>
                    <small>
                        {this.state.showDescription && this.clockIcon(this.state.room.BookingTime)} {this.state.showDescription && this.state.room.BookingTime}
                    </small>
                </a>
                {!this.state.showDescription && <MeetingRoomInfo data={this.state.room} onShowBooking={this.handleModalShowClick} />}
            </div>
        );
    }
}

class MeetingTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalShowClick = this.handleModalShowClick.bind(this);
    }
    handleModalShowClick(e) {
        this.props.onShowBooking(e);
    }
    render() {
        const roomNodes = this.props.data.map(room => (
            <MeetingTableItem key={room.Id} data={room} onShowBooking={this.handleModalShowClick} />
        ));
        return (
            <div className="list-group">
                {roomNodes}
            </div>
        );
    }
}


class MeetingBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetingRooms: [],
            showModal: false,
            bookingItem: []
        };
        this.handleModalShowClick = this.handleModalShowClick.bind(this);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
    }
    componentDidMount() {
        this.loadMeetingRoomsFromServer();
    }
    handleModalShowClick(item) {
        this.setState({
            showModal: true,
            bookingItem: item
        });
    }
    handleModalCloseClick() {
        this.setState({
            showModal: false
        });
    }
    loadMeetingRoomsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', "http://meetingportal.pvpve.ru/api/MeetingRooms/GetMeetingRooms", true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ meetingRooms: data });
        };
        xhr.send();
    }
    render() {
        return (
            <div className="meeting-box">
                <h2>Список переговорных</h2>
                <MeetingTable data={this.state.meetingRooms} onShowBooking={this.handleModalShowClick} />
                {this.state.showModal ? <Modal handleModalCloseClick={this.handleModalCloseClick} dataItem={this.state.bookingItem} /> : null}
            </div>
        );
    }
}

ReactDOM.render(
    <MeetingBox />, document.getElementById('meetingRooms')
);