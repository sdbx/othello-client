import * as React from 'react';
import * as styles from './PlayOthello.scss';
import CanvasOthelloGame from '../../game/client/canvasGame/CanvasOthelloGame';
import NetworkClient from '../../game/client/NetworkClient';

export default class PlayOthello extends React.Component {

    canvas: HTMLCanvasElement;
    client: NetworkClient;
    game: CanvasOthelloGame;

    componentDidMount() {
        this.client = new NetworkClient();
        this.game = new CanvasOthelloGame(this.canvas);

        const roomName = 'testgame2';
        const userName = prompt('사용자 이름');

        this.client.login(userName);
        this.client.enterRoom(roomName)
        .then((data) => {
            this.game.init(userName, data);
            this.game.tryPut = (position) => this.client.put(position);
            this.client.onPut = (position) => this.game.put(position);
        })
        .catch((err) => console.error(err));
    }

    componentWillUnmount() {
        this.game.destroy();
        this.client.clear();
    }

    render() {
        return (
            <div className={ styles['page'] }>
                <canvas ref={ (c) => this.canvas = c }>
                    캔버스를 지원하지 않는 브라우저입니다.
                </canvas>
            </div>
        );
    }
}
