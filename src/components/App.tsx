import * as React from 'react';
import { Route } from 'react-router-dom';
import Home from "./pages/Home";
import PlayOthello from "./pages/PlayOthello";

export default class App extends React.Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <>
                <Route exact path='/' component={ Home } />
                <Route path='/othello' component={ PlayOthello } />
            </>
        );
    }
}