import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './Menu.scss';

export default class Menu extends React.Component {
    render() {
        return (
            <>
                <ul className={styles['menu']}>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/othello'>Othello</Link></li>
                </ul>
            </>
        );
    }
}
