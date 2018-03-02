import axios, { AxiosInstance } from 'axios';
import { MarkerType } from '../logic/consts';
import Othello, { BoardPosition } from '../logic/Othello';
import * as Consts from './consts';

interface User {
    name: string;
    secret: string;
}

interface RoomState {
    name: string;
    keepAliveId?: number;
}

export default class NetworkClient {

    onPut: (position: BoardPosition) => void;
    private request: AxiosInstance;
    private socket: WebSocket;
    private user: User;
    private roomState: RoomState;

    constructor() {
        this.request = axios.create({
            baseURL: Consts.serverURL,
        });

        this.handleSocketMessage = this.handleSocketMessage.bind(this);
    }

    login(userName: string): boolean {
        this.user = { name: userName, secret: (userName === 'ludev' ? 'rfBd67ti3S' : 'MtYvSgD6xA') };
        return true;
    }

    enterRoom(roomName: string): Promise<any> {
        this.roomState = { name: roomName };

        return this.request.get(`/games/${roomName}`)
        .then((response) => {
            return response.data;
        })
        .then((data) => {
            console.log('방 정보:', data);
            this.initSocket();

            return data;
        });
    }

    put(position: BoardPosition) {
        console.log('보내기 시도 put:', position);

        return this.request.post(`/games/${this.roomState.name}/actions`, {
            type: 'put',
            secret: this.user.secret,
            move: Othello.convertToNotation(position),
        },
        {
            headers: {'Content-Type': 'application/json'},
        })
        .catch((err) => console.error(err));
    }

    clear() {
        window.clearInterval(this.roomState.keepAliveId);
        this.roomState = undefined;
    }

    private initSocket() {
        this.socket = new WebSocket(Consts.websocketURL);
        this.socket.onopen = () => {
            console.log('웹소켓 연결 수립');

            this.socket.send(JSON.stringify({
                type: 'login',
                secret: this.user.secret,
                game: this.roomState.name
            }));

            // send keep alive packet every 30 seconds
            this.roomState.keepAliveId = window.setInterval(
                () => this.socket.send(JSON.stringify({ type: 'ping' })), 30000
            );
        };

        this.socket.onmessage = this.handleSocketMessage;
    }

    private handleSocketMessage(e) {
        // todo: data interface 만들기
        const data = JSON.parse(e.data);

        console.log('웹소켓 받음:', data);

        switch (data.type) {
            case 'turn':
                const { valid, position } = Othello.parseOne(data.move);

                if (valid) {
                    this.onPut(position);
                } else {
                    console.error('싱크 미스');
                }
                break;
            case 'end':
                alert('게임 종료!');
                break;
        }
    }
}
