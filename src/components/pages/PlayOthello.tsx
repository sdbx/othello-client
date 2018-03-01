import * as React from 'react';
import CanvasOthelloGame from '../../game/client/CanvasOthelloGame';
import * as styles from './PlayOthello.scss';

export default class PlayOthello extends React.Component {

    canvas: HTMLCanvasElement;
    game: CanvasOthelloGame;

    componentDidMount() {
        this.game = new CanvasOthelloGame(this.canvas);
        this.game.init();
    }

    componentWillUnmount() {
        this.game.destroy();
    }

    render() {
        return (
            <div className={styles['page']}>
                <canvas ref={ c => this.canvas = c }>
                    캔버스를 지원하지 않는 브라우저입니다.
                </canvas>
            </div>
        )
    }
}