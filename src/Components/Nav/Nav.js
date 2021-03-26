import React, { Component } from 'react';
import axios from 'axios';
import homeLogo from './../../assets/home_logo.png';
import newLogo from './../../assets/new_logo.png';
import logoutLogo from './../../assets/shut_down.png';
import './Nav.css';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUser, logout } from '../../redux/reducer'

class Nav extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser()
  }

  getUser() {
    axios.get('/api/auth/me')
    .then(res => updateUser(res.data))
  }
  
  logout() {
    axios.post('/api/auth/logout')
      .then(_ => logout)
  }
  
  render() {
    console.log(this.props)
      return this.props.location.pathname !== '/' &&
        <div className='nav'>
          <div className='nav-profile-container'>
            <div className='nav-profile-pic' style={{backgroundImage: `url(${this.props.profile_pic})`}}></div>
            <p>{this.props.username}</p>
          </div>
          <div className='nav-links'>
            <Link to='/api/dash'><img className='nav-img' src={homeLogo} alt='home' /></Link>
            <Link to='/api/form'><img className='nav-img' src={newLogo} alt='new post' /></Link>
          </div>
          <Link to='/api/' onClick={() => this.logout}><img className='nav-img logout' src={logoutLogo} alt='logout' /></Link>
        </div>
  }
}

const mapStateToProps = reduxState => reduxState

export default withRouter(connect(mapStateToProps,{updateUser, logout})(Nav));