import React from "react";
import {Link, withRouter} from 'react-router';


class NavBar extends React.Component {
    render() {
        return (
            <nav role="navigation" class="navbar navbar-default navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" data-target="#navbarCollapse" data-toggle="collapse"
                                class="navbar-toggle">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a href="#" class="navbar-brand">
                            <p className="blue">Chrono</p>
                            <p className="yellow">Wallet</p>
                        </a>
                    </div>
                    <div id="navbarCollapse" class="collapse navbar-collapse">
                        <div className="nav-right">
                            <ul class="nav navbar-nav">
                                <li><Link className="nav-option" to="/">Home</Link></li>
                                <li><Link className="nav-option" to="exchange">Exchange</Link></li>
                                <li><Link className="nav-option" to="voting">Voting</Link></li>
                                <li><Link className="nav-option" to="redemption">Redemption</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);