import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
    render() {
        return (
            <>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/othello'>Othello</Link></li>
                </ul>
            </>
        );
    }
}
